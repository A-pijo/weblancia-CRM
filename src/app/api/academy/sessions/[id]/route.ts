import { z } from "zod"
import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"
import { created } from "@/lib/security/response"

const sessionUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  meetingLink: z.string().max(500).optional(),
  meetingPassword: z.string().max(100).optional(),
  trainer: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  timezone: z.string().max(50).optional(),
  maxParticipants: z.number().int().optional(),
}).strict()

export const GET = apiRoute(async (ctx) => {
  try { return success(await academyService.getSessionById(Number(ctx.params.id))) }
  catch (e) { if (e instanceof NotFoundError) return notFound(); throw e }
})

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(sessionUpdateSchema)(ctx.request)
  if (body.error) return body.error

  return success(await academyService.updateSession(Number(ctx.params.id), body.data))
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  await academyService.deleteSession(Number(ctx.params.id))
  return success({ message: "Session supprimée" })
}, { auth: true, admin: true })
