import { prisma } from "@/lib/database/prisma"

const WEBHOOK_URL = process.env.AUDIT_WEBHOOK_URL

async function fireWebhook(payload: Record<string, unknown>) {
  if (!WEBHOOK_URL) return
  try {
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, timestamp: new Date().toISOString(), event: "SECURITY_EVENT" }),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // fire-and-forget; failures are non-blocking
  }
}

export type AuditAction =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGOUT"
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "SETTINGS_UPDATE"
  | "ROLE_CHANGE"
  | "PASSWORD_CHANGE"
  | "MEDIA_UPLOAD"
  | "MEDIA_DELETE"
  | "SECURITY_EVENT"

export type AuditEntity =
  | "USER"
  | "SERVICE"
  | "PROJECT"
  | "BLOG_POST"
  | "TESTIMONIAL"
  | "FAQ"
  | "TEAM_MEMBER"
  | "MEDIA"
  | "SETTING"
  | "LEAD"
  | "COURSE"
  | "WORKSHOP"
  | "RESOURCE"
  | "CERTIFICATE"
  | "SESSION"
  | "CATEGORY"

export async function createAuditLog(params: {
  action: AuditAction
  entity: AuditEntity
  entityId?: string | number
  description: string
  userId?: number
  metadata?: Record<string, unknown>
  ip?: string
  userAgent?: string
  request?: Request
}) {
  const ip = params.request
    ? params.request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      ?? params.request.headers.get("cf-connecting-ip")
      ?? "127.0.0.1"
    : params.ip
  const userAgent = params.request ? params.request.headers.get("user-agent") ?? undefined : params.userAgent

  try {
    await prisma.$executeRawUnsafe(
      `INSERT INTO "AuditLog" (action, entity, "entityId", description, "userId", metadata, ip, "userAgent", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7, $8, NOW())`,
      params.action,
      params.entity,
      params.entityId != null ? String(params.entityId) : null,
      params.description,
      params.userId ?? null,
      params.metadata ? JSON.stringify(params.metadata) : null,
      ip ?? null,
      userAgent ?? null,
    )
    // Fire webhook for security events (non-blocking)
    if (params.action === "SECURITY_EVENT") {
      fireWebhook({
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        description: params.description,
        userId: params.userId,
        metadata: params.metadata,
        ip,
        userAgent,
      })
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[AuditLog] Failed to write:", error)
    }
  }
}

export async function getAuditLogs(params: {
  limit?: number
  offset?: number
  userId?: number
  action?: AuditAction
  entity?: AuditEntity
  startDate?: Date
  endDate?: Date
}) {
  const conditions: string[] = []
  const values: (string | number)[] = []
  let idx = 1

  if (params.userId) {
    conditions.push(`"userId" = $${idx++}`)
    values.push(params.userId)
  }
  if (params.action) {
    conditions.push(`action = $${idx++}`)
    values.push(params.action)
  }
  if (params.entity) {
    conditions.push(`entity = $${idx++}`)
    values.push(params.entity)
  }
  if (params.startDate) {
    conditions.push(`"createdAt" >= $${idx++}`)
    values.push(params.startDate.toISOString())
  }
  if (params.endDate) {
    conditions.push(`"createdAt" <= $${idx++}`)
    values.push(params.endDate.toISOString())
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : ""

  const items = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    `SELECT * FROM "AuditLog" ${where} ORDER BY "createdAt" DESC LIMIT $${idx++} OFFSET $${idx++}`,
    ...values,
    params.limit ?? 50,
    params.offset ?? 0,
  )

  const countResult = await prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
    `SELECT COUNT(*) as count FROM "AuditLog" ${where}`,
    ...values,
  )

  return {
    items,
    total: Number(countResult[0]?.count ?? 0),
    limit: params.limit ?? 50,
    offset: params.offset ?? 0,
  }
}
