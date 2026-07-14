import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { academyCategorySchema } from "@/lib/validation/academy"

export const GET = apiRoute(async () => {
  const items = await academyService.listCategories({})
  return success({ items, total: items.total, page: 1, totalPages: 1 })
})

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(academyCategorySchema)(ctx.request)
  if (body.error) return body.error
  const item = await academyService.createCategory(body.data)
  return created(item)
}, { auth: true, admin: true })
