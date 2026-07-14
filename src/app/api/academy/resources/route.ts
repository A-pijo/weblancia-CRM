import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { resourceSchema } from "@/lib/validation/academy"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  return success(await academyService.listResources({
    search: searchParams.get("search") ?? undefined, category: searchParams.get("category") ?? undefined,
    free: searchParams.has("isFree") ? searchParams.get("isFree") === "true" : undefined,
    published: searchParams.has("isPublished") ? searchParams.get("isPublished") === "true" : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  }))
})
export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(resourceSchema)(ctx.request)
  if (body.error) return body.error
  return created(await academyService.createResource(body.data))
}, { auth: true, admin: true })
