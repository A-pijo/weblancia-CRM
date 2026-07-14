import { prisma } from "@/lib/database/prisma"

const WINDOW_MS = 60_000
const CLEANUP_INTERVAL = 300_000
let lastCleanup = Date.now()

function getKey(identifier: string, endpoint: string): string {
  return `${endpoint}:${identifier}`
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  const cf = request.headers.get("cf-connecting-ip")
  if (cf) return cf
  return "127.0.0.1"
}

export async function rateLimit(params: {
  identifier: string
  endpoint: string
  maxRequests: number
  windowMs?: number
}): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
  const { identifier, endpoint, maxRequests, windowMs = WINDOW_MS } = params
  const key = getKey(identifier, endpoint)
  const now = Date.now()
  const windowStart = new Date(now - windowMs)

  if (Date.now() - lastCleanup > CLEANUP_INTERVAL) {
    lastCleanup = Date.now()
    try {
      await prisma.$executeRawUnsafe(
        `DELETE FROM "RateLimit" WHERE "createdAt" < NOW() - INTERVAL '10 minutes'`,
      )
    } catch {
      // cleanup failure is non-critical
    }
  }

  try {
    const result = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
      `SELECT COUNT(*) as count FROM "RateLimit"
       WHERE key = $1 AND "createdAt" >= $2::timestamp`,
      key,
      windowStart.toISOString(),
    )

    const currentCount = Number(result[0]?.count ?? 0)

    if (currentCount >= maxRequests) {
      const oldestResult = await prisma.$queryRawUnsafe<Array<{ "createdAt": Date }>>(
        `SELECT "createdAt" FROM "RateLimit"
         WHERE key = $1 AND "createdAt" >= $2::timestamp
         ORDER BY "createdAt" ASC LIMIT 1`,
        key,
        windowStart.toISOString(),
      )
      const oldestDate = oldestResult[0]?.createdAt
      const resetIn = oldestDate ? Math.max(0, windowMs - (now - oldestDate.getTime())) : windowMs
      return { allowed: false, remaining: 0, resetIn }
    }

    await prisma.$executeRawUnsafe(
      `INSERT INTO "RateLimit" (key, "createdAt")
       VALUES ($1, $2::timestamp)`,
      key,
      new Date().toISOString(),
    )

    return { allowed: true, remaining: maxRequests - currentCount - 1, resetIn: 0 }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[RateLimit] DB error, denying request:", error)
    }
    return { allowed: false, remaining: 0, resetIn: windowMs }
  }
}

export async function rateLimitByIp(request: Request, endpoint: string, maxRequests: number) {
  const ip = getClientIp(request)
  return rateLimit({ identifier: ip, endpoint, maxRequests })
}

export async function rateLimitByUser(userId: number, endpoint: string, maxRequests: number) {
  return rateLimit({ identifier: `u:${userId}`, endpoint, maxRequests })
}
