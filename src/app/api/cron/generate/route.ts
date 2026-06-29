import { NextResponse } from "next/server"
import { generateAndPublishArticle } from "@/lib/ai"
import { rateLimit, getClientIp } from "@/lib/rate-limiter"

const CRON_SECRET = typeof process !== "undefined" ? process.env.CRON_SECRET : undefined

export async function POST(request: Request) {
  const ip = getClientIp(request)
  const { allowed } = rateLimit(`cron-generate:${ip}`, 3, 60_000)
  if (!allowed) {
    return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 })
  }

  const authHeader = request.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  if (CRON_SECRET && token !== CRON_SECRET) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const result = await generateAndPublishArticle()

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    post: result.post,
    faq: result.faq,
    durationMs: result.durationMs,
  })
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    description: "POST to trigger AI article generation. Requires Bearer token matching CRON_SECRET.",
  })
}
