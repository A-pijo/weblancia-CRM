import { z } from "zod"
import { academyService } from "@/lib/repositories/services/academy.service"
import { certificateSchema } from "@/lib/validation/academy"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"

const certificateUpdateSchema = certificateSchema.partial().extend({
  _action: z.enum(["duplicate", "toggle"]).optional(),
}).strict()

const certificateDeleteSchema = z.object({ permanent: z.literal(true).optional() }).strict()

export const GET = apiRoute(async (ctx) => {
  try { return success(await academyService.getCertificateById(Number(ctx.params.id))) }
  catch (e) { if (e instanceof NotFoundError) return notFound(); throw e }
})

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(certificateUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "duplicate") return success(await academyService.duplicateCertificate(Number(ctx.params.id)))
  if (body.data._action === "toggle") return success(await academyService.toggleCertificateStatus(Number(ctx.params.id)))

  return success(await academyService.updateCertificate(Number(ctx.params.id), body.data))
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const raw = await ctx.request.json().catch(() => ({}))
  const parsed = certificateDeleteSchema.safeParse(raw)
  if (!parsed.success) return badRequest("Données invalides", parsed.error.flatten().fieldErrors)

  if (parsed.data.permanent) { await academyService.permanentlyDeleteCertificate(Number(ctx.params.id)) }
  else { await academyService.deleteCertificate(Number(ctx.params.id)) }
  return success({ message: "Certificat supprimé" })
}, { auth: true, admin: true })
