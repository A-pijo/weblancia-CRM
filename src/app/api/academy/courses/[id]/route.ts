import { z } from "zod"
import { academyService } from "@/lib/repositories/services/academy.service"
import { courseSchema } from "@/lib/validation/academy"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"

const courseUpdateSchema = courseSchema.partial().extend({
  _action: z.enum(["duplicate", "toggle"]).optional(),
}).strict()

const courseDeleteSchema = z.object({ permanent: z.literal(true).optional() }).strict()

export const GET = apiRoute(async (ctx) => {
  try { return success(await academyService.getCourseById(Number(ctx.params.id))) }
  catch (e) { if (e instanceof NotFoundError) return notFound(); throw e }
})

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(courseUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "duplicate") return success(await academyService.duplicateCourse(Number(ctx.params.id)))
  if (body.data._action === "toggle") return success(await academyService.toggleCourseStatus(Number(ctx.params.id)))

  return success(await academyService.updateCourse(Number(ctx.params.id), body.data))
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const raw = await ctx.request.json().catch(() => ({}))
  const parsed = courseDeleteSchema.safeParse(raw)
  if (!parsed.success) return badRequest("Données invalides", parsed.error.flatten().fieldErrors)

  if (parsed.data.permanent) { await academyService.permanentlyDeleteCourse(Number(ctx.params.id)) }
  else { await academyService.deleteCourse(Number(ctx.params.id)) }
  return success({ message: "Cours supprimé" })
}, { auth: true, admin: true })
