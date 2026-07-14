import { z } from "zod"
import { academyService } from "@/lib/repositories/services/academy.service"
import { academyCategorySchema } from "@/lib/validation/academy"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"

const categoryUpdateSchema = academyCategorySchema.partial().strict()

const categoryDeleteSchema = z.object({ permanent: z.literal(true).optional() }).strict()

export const GET = apiRoute(async (ctx) => {
  try { return success(await academyService.getCategoryById(Number(ctx.params.id))) }
  catch (e) { if (e instanceof NotFoundError) return notFound(); throw e }
})

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(categoryUpdateSchema)(ctx.request)
  if (body.error) return body.error

  const updated = await academyService.updateCategory(Number(ctx.params.id), body.data)
  return success(updated)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const raw = await ctx.request.json().catch(() => ({}))
  const parsed = categoryDeleteSchema.safeParse(raw)
  if (!parsed.success) return badRequest("Données invalides", parsed.error.flatten().fieldErrors)

  if (parsed.data.permanent) { await academyService.permanentlyDeleteCategory(Number(ctx.params.id)) }
  else { await academyService.softDeleteCategory(Number(ctx.params.id)) }
  return success({ message: "Catégorie supprimée" })
}, { auth: true, admin: true })
