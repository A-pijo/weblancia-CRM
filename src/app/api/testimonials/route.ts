import { testimonialService } from "@/lib/repositories/services/testimonial.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { testimonialSchema } from "@/lib/validation/testimonials"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  const result = await testimonialService.list({
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })
  return success(result)
})

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(testimonialSchema)(ctx.request)
  if (body.error) return body.error
  const testimonial = await testimonialService.create(body.data)
  return created(testimonial)
}, { auth: true, admin: true })
