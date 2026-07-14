import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { workshopSchema } from "@/lib/validation/academy"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  return success(await academyService.listWorkshops({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    published: searchParams.has("isPublished") ? searchParams.get("isPublished") === "true" : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  }))
})

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(workshopSchema)(ctx.request)
  if (body.error) return body.error
  return created(await academyService.createWorkshop(body.data))
}, { auth: true, admin: true })
