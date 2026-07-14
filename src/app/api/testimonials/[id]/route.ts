import { z } from "zod"
import { testimonialService } from "@/lib/repositories/services/testimonial.service"
import { testimonialSchema } from "@/lib/validation/testimonials"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"

const testimonialUpdateSchema = testimonialSchema.partial().extend({
  _action: z.literal("toggle").optional(),
}).strict()

export const GET = apiRoute(async (ctx) => {
  try {
    const testimonial = await testimonialService.getById(Number(ctx.params.id))
    return success(testimonial)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound()
    throw error
  }
})

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(testimonialUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "toggle") {
    const updated = await testimonialService.toggleStatus(Number(ctx.params.id))
    return success(updated)
  }

  const updated = await testimonialService.update(Number(ctx.params.id), body.data)
  return success(updated)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  await testimonialService.delete(Number(ctx.params.id))
  return success({ message: "Témoignage supprimé" })
}, { auth: true, admin: true })
