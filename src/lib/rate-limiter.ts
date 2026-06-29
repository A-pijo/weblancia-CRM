interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

const FIVE_MINUTES = 5 * 60 * 1000
const MAX_REQUESTS = 10
const MAX_ENTRIES = 10000
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < FIVE_MINUTES) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
  if (store.size > MAX_ENTRIES) {
    const sorted = [...store.entries()].sort((a, b) => a[1].resetAt - b[1].resetAt)
    const toDelete = sorted.slice(0, sorted.length - MAX_ENTRIES)
    for (const [key] of toDelete) store.delete(key)
  }
}

export function rateLimit(
  key: string,
  maxRequests: number = MAX_REQUESTS,
  windowMs: number = FIVE_MINUTES,
): { allowed: boolean; remaining: number; resetIn: number } {
  cleanup()

  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  return "127.0.0.1"
}
