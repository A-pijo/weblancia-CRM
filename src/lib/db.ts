import pg from "pg"
import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const REQUIRED_VARS = ["HOST", "USER", "NAME"] as const

function readEnv(key: string): string {
  return process.env[`DB_${key}`] || process.env[`DATABASE_${key}`] || ""
}

function getDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  const h = readEnv("HOST")
  const u = readEnv("USER")
  const p = readEnv("PASSWORD")
  const d = readEnv("NAME")
  const o = readEnv("PORT") || "5432"
  if (!h || !u || !d) return undefined
  return `postgresql://${encodeURIComponent(u)}:${encodeURIComponent(p)}@${h}:${o}/${encodeURIComponent(d)}`
}

function createClient(): PrismaClient | undefined {
  const url = getDatabaseUrl()
  if (!url) {
    if (typeof window === "undefined") {
      console.error("[DB] DATABASE_URL or DB_HOST/USER/NAME not set. Database unavailable.")
    }
    return undefined
  }

  try {
    const pool = new pg.Pool({ connectionString: url })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  } catch (err) {
    console.error("[DB] Failed to create PrismaClient:", err)
    return undefined
  }
}

function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const name = error.name ?? ""
  const message = error.message ?? ""
  const code = (error as unknown as Record<string, unknown>).code
  return (
    code === "ECONNREFUSED" ||
    code === "P1001" ||
    code === "P1002" ||
    name === "PrismaClientInitializationError" ||
    message.includes("connection") ||
    message.includes("connect") ||
    message.includes("timeout") ||
    message.includes("refused") ||
    message.includes("ECONNREFUSED")
  )
}

const NOOP_FALLBACKS: Record<string, unknown> = {
  findMany: [],
  findFirstOrThrow: [],
  findUnique: null,
  findFirst: null,
  count: 0,
  aggregate: {},
}

function buildDb(client: PrismaClient | undefined): PrismaClient {
  if (!client) {
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive) return undefined
        if (typeof prop === "string" && prop.startsWith("$")) {
          return async () => {}
        }
        return new Proxy(
          {},
          {
            get(_, method) {
              if (method === "then") return undefined
              const fallback = NOOP_FALLBACKS[method as string]
              return async () => fallback ?? null
            },
          }
        )
      },
    })
  }

  return new Proxy(client, {
    get(target, prop) {
      const value = (target as unknown as Record<string, unknown>)[prop as string]
      if (value && typeof value === "object" && typeof prop === "string" && !prop.startsWith("$")) {
        return new Proxy(value as unknown as Record<string, unknown>, {
          get(target2, method) {
            const fn = target2[method as string]
            if (typeof fn !== "function") return fn
            return async (...args: unknown[]) => {
              try {
                return await fn(...args)
              } catch (error) {
                if (isConnectionError(error)) {
                  console.error(`[DB] ${prop}.${String(method)}() failed —`, error)
                  return NOOP_FALLBACKS[method as string] ?? null
                }
                throw error
              }
            }
          },
        })
      }
      if (typeof value === "function") {
        return (...args: unknown[]) => {
          try {
            return value(...args)
          } catch (error) {
            if (isConnectionError(error)) {
              console.error(`[DB] ${String(prop)}() failed —`, error)
              return undefined
            }
            throw error
          }
        }
      }
      return value
    },
  })
}

const client = globalForPrisma.prisma ?? createClient()
export const db = buildDb(client)

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client
}

export function isDbAvailable(): boolean {
  return !!(process.env.DATABASE_URL || REQUIRED_VARS.every((k) => !!readEnv(k)))
}

export default db
