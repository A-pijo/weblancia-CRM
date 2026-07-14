import { leadService } from "@/lib/repositories/services/lead.service"
import { leadStatusSchema } from "@/lib/validation/leads"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"

export const PATCH = apiRoute(
  async (ctx) => {
    const body = await apiBody(leadStatusSchema)(ctx.request)
    if (body.error) return body.error
    const updated = await leadService.updateStatus(Number(ctx.params.id), body.data.status, ctx.auth.session.userId)
    return success(updated)
  },
  { auth: true, admin: true },
)
