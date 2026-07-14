import { generateAndPublishArticle } from "@/lib/ai"
import { apiRoute } from "@/lib/security/api-handler"
import { success, unauthorized } from "@/lib/security/response"

const CRON_SECRET = process.env.CRON_SECRET

export const POST = apiRoute(async (ctx) => {
  const authHeader = ctx.request.headers.get("authorization")
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null

  if (CRON_SECRET && token !== CRON_SECRET) return unauthorized("Token invalide")

  const result = await generateAndPublishArticle()

  if (!result.success) return new Response(JSON.stringify({ success: false, error: result.error }), { status: 500 })

  return success({
    post: result.post,
    faq: result.faq,
    durationMs: result.durationMs,
  })
})

export const GET = apiRoute(async () => {
  return success({
    description: "POST to trigger AI article generation. Requires Bearer token matching CRON_SECRET.",
  })
})
