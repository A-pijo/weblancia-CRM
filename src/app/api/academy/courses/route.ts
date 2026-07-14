import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { courseSchema } from "@/lib/validation/academy"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  const result = await academyService.listCourses({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    level: searchParams.get("level") ?? undefined,
    published: searchParams.has("isPublished") ? searchParams.get("isPublished") === "true" : undefined,
    featured: searchParams.has("isFeatured") ? searchParams.get("isFeatured") === "true" : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })
  return success(result)
})

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(courseSchema)(ctx.request)
  if (body.error) return body.error
  const item = await academyService.createCourse(body.data)
  return created(item)
}, { auth: true, admin: true })
