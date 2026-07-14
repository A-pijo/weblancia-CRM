import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { certificateSchema } from "@/lib/validation/academy"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  return success(await academyService.listCertificates({
    search: searchParams.get("search") ?? undefined, category: searchParams.get("category") ?? undefined,
    published: searchParams.has("isPublished") ? searchParams.get("isPublished") === "true" : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  }))
})
export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(certificateSchema)(ctx.request)
  if (body.error) return body.error
  return created(await academyService.createCertificate(body.data))
}, { auth: true, admin: true })
