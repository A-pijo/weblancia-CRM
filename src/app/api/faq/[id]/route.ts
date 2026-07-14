import { z } from "zod"
import { faqService } from "@/lib/repositories/services/faq.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"

const faqUpdateSchema = z.object({
  question: z.string().min(1).optional(),
  answer: z.string().min(1).optional(),
  category: z.string().max(100).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  _action: z.literal("toggle").optional(),
}).strict()

export const GET = apiRoute(async (ctx) => {
  try {
    const faq = await faqService.getById(Number(ctx.params.id))
    return success(faq)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound()
    throw error
  }
})

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(faqUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "toggle") {
    const updated = await faqService.update(Number(ctx.params.id), { isActive: body.data.isActive ?? true })
    return success(updated)
  }

  const updated = await faqService.update(Number(ctx.params.id), body.data)
  return success(updated)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  await faqService.delete(Number(ctx.params.id))
  return success({ message: "FAQ supprimée" })
}, { auth: true, admin: true })
