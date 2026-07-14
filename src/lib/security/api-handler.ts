import type { NextRequest } from "next/server"
import type { z } from "zod"
import { requireAuth, requireAdmin, requirePermission, type AuthResult } from "./auth"
import { success, created, serverError, badRequest, unauthorized, tooMany, validationError } from "./response"
import { parseBody, validateQuery } from "./validation"
import { rateLimitByUser, rateLimitByIp } from "./rate-limit"
import { createAuditLog, type AuditAction, type AuditEntity } from "./audit"
import type { Permission } from "./rbac"

type HandlerContext = {
  request: NextRequest
  params: Record<string, string | undefined>
  auth: AuthResult
}

type HandlerFn = (ctx: HandlerContext) => Promise<Response>

interface RouteConfig {
  auth?: boolean
  admin?: boolean
  permission?: Permission
  rateLimit?: { max: number; by?: "ip" | "user" }
  csrf?: boolean
  audit?: {
    action: AuditAction
    entity: AuditEntity
    getDescription: (ctx: HandlerContext) => string
    getEntityId?: (ctx: HandlerContext) => string | number | undefined
  }
}

const CSRF_COOKIE = "csrf-token"
const CSRF_HEADER = "x-csrf-token"
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"]

function generateCsrfToken(): string {
  const bytes = new Uint8Array(32)
  crypto.getRandomValues(bytes)
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("")
}

function validateCsrfToken(request: NextRequest): Response | null {
  if (SAFE_METHODS.includes(request.method)) return null
  if (!request.cookies.get("session")) return null

  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value
  const headerToken = request.headers.get(CSRF_HEADER)

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    return unauthorized("Invalid or missing CSRF token")
  }
  return null
}

function getPathParams(request: NextRequest): Record<string, string | undefined> {
  const params: Record<string, string | undefined> = {}
  const url = request.nextUrl.pathname.split("/").filter(Boolean)
  url.forEach((seg, i) => { params[`$${i}`] = seg })
  return params
}

export function apiRoute(handler: HandlerFn, config?: RouteConfig) {
  return async (request: NextRequest, { params }: { params?: Promise<Record<string, string>> } = {}) => {
    try {
      const resolvedParams: Record<string, string | undefined> = {}
      if (params) {
        const p = await params
        Object.assign(resolvedParams, p)
      }
      Object.assign(resolvedParams, getPathParams(request))

      let auth: AuthResult = { session: undefined as never, error: undefined as never }

      if (config?.auth) {
        if (config.admin) {
          auth = await requireAdmin()
        } else if (config.permission) {
          auth = await requirePermission(config.permission)
        } else {
          auth = await requireAuth()
        }
        if (auth.error) return auth.error
      }

      if (config?.csrf !== false) {
        const csrfError = validateCsrfToken(request)
        if (csrfError) return csrfError
      }

      if (config?.rateLimit) {
        const limiter = config.rateLimit
        let rl
        if (limiter.by === "user" && auth.session) {
          rl = await rateLimitByUser(auth.session.userId, request.nextUrl.pathname, limiter.max)
        } else {
          rl = await rateLimitByIp(request, request.nextUrl.pathname, limiter.max)
        }
        if (!rl.allowed) {
          const response = tooMany()
          return response
        }
      }

      const ctx: HandlerContext = {
        request,
        params: resolvedParams,
        auth,
      }

      const response = await handler(ctx)

      if (auth.session && SAFE_METHODS.includes(request.method)) {
        if (!request.cookies.get(CSRF_COOKIE)) {
          const token = generateCsrfToken()
          response.headers.append("Set-Cookie", `${CSRF_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax${process.env.NODE_ENV === "production" ? "; Secure" : ""}`)
        }
      }

      if (config?.audit && auth.session) {
        const audit = config.audit
        createAuditLog({
          action: audit.action,
          entity: audit.entity,
          entityId: audit.getEntityId?.(ctx),
          description: audit.getDescription(ctx),
          userId: auth.session.userId,
          ip: request.headers.get("x-forwarded-for") ?? request.headers.get("cf-connecting-ip") ?? "127.0.0.1",
          userAgent: request.headers.get("user-agent") ?? undefined,
        })
      }

      return response
    } catch (error) {
      return serverError(error)
    }
  }
}

export function apiBody<T extends z.ZodTypeAny>(schema: T) {
  return async (request: NextRequest): Promise<{ data: z.infer<T>; error?: never } | { data?: never; error: Response }> => {
    const result = await parseBody(request, schema)
    if (result.error) return { error: result.error }
    return { data: result.data }
  }
}

export function apiQuery<T extends z.ZodTypeAny>(schema: T) {
  return (request: NextRequest): { data: z.infer<T>; error?: never } | { data?: never; error: Response } => {
    const result = validateQuery(schema, request.nextUrl.searchParams)
    if (result.error) return { error: result.error }
    return { data: result.data }
  }
}
