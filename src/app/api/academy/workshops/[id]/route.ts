import { z } from "zod"
import { academyService } from "@/lib/repositories/services/academy.service"
import { workshopSchema } from "@/lib/validation/academy"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"

const workshopUpdateSchema = workshopSchema.partial().extend({
  _action: z.enum(["duplicate", "toggle"]).optional(),
}).strict()

const workshopDeleteSchema = z.object({ permanent: z.literal(true).optional() }).strict()

export const GET = apiRoute(async (ctx) => {
  try { return success(await academyService.getWorkshopById(Number(ctx.params.id))) }
  catch (e) { if (e instanceof NotFoundError) return notFound(); throw e }
})

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(workshopUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "duplicate") return success(await academyService.duplicateWorkshop(Number(ctx.params.id)))
  if (body.data._action === "toggle") return success(await academyService.toggleWorkshopStatus(Number(ctx.params.id)))

  return success(await academyService.updateWorkshop(Number(ctx.params.id), body.data))
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const raw = await ctx.request.json().catch(() => ({}))
  const parsed = workshopDeleteSchema.safeParse(raw)
  if (!parsed.success) return badRequest("Données invalides", parsed.error.flatten().fieldErrors)

  if (parsed.data.permanent) { await academyService.permanentlyDeleteWorkshop(Number(ctx.params.id)) }
  else { await academyService.deleteWorkshop(Number(ctx.params.id)) }
  return success({ message: "Atelier supprimé" })
}, { auth: true, admin: true })
