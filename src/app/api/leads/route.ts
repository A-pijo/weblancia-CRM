import { leadService } from "@/lib/repositories/services/lead.service"
import { extractLeadInfo } from "@/lib/repositories/services/lead-tracker.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created, badRequest } from "@/lib/security/response"
import { leadSchema } from "@/lib/validation/leads"
import { sendEmail } from "@/lib/email"
import { env } from "@/lib/config"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  const result = await leadService.list({
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    source: searchParams.get("source") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    sort: (searchParams.get("sort") as "asc" | "desc") ?? undefined,
  })
  return success(result)
}, { auth: true, admin: true })

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(leadSchema)(ctx.request)
  if (body.error) return body.error
  const info = extractLeadInfo(ctx.request)
  const enriched = { ...body.data, ...info }

  const lead = await leadService.create(enriched)

  await sendEmail({
    to: env.NOTIFICATION_EMAIL,
    subject: `[New Lead] ${lead.name} - ${lead.source}`,
    body: `New lead received:\nName: ${lead.name}\nEmail: ${lead.email}\nSource: ${lead.source}\nMessage: ${lead.message ?? "N/A"}`,
  }).catch(() => {})

  return created(lead)
}, { rateLimit: { max: 10, by: "ip" } })
