import { serviceService } from "@/lib/repositories/services/service.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created, badRequest } from "@/lib/security/response"
import { createAuditLog } from "@/lib/security/audit"
import { serviceSchema } from "@/lib/validation/services"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = new URL(ctx.request.url)
  const result = await serviceService.list({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })
  return success(result)
}, { rateLimit: { max: 30 } })

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(serviceSchema.strict())(ctx.request)
  if (body.error) return body.error
  const service = await serviceService.create(body.data)

  createAuditLog({
    action: "CREATE", entity: "SERVICE", entityId: service.id,
    description: `Service "${service.title}" created`, userId: ctx.auth.session.userId, request: ctx.request,
  })

  return created(service)
}, { auth: true, admin: true })
