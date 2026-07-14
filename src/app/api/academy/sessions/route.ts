import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, created } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"
import { z } from "zod"

const sessionSchema = z.object({
  courseId: z.number(),
  title: z.string().min(1, "Title is required"),
  meetingLink: z.string().optional(),
  meetingPassword: z.string().optional(),
  trainer: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  timezone: z.string().optional(),
  maxParticipants: z.number().int().optional(),
}).strict()

const sessionUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  meetingLink: z.string().optional(),
  meetingPassword: z.string().optional(),
  trainer: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  timezone: z.string().optional(),
  maxParticipants: z.number().int().optional(),
}).strict()

export const GET = apiRoute(async (ctx) => {
  const courseId = Number(ctx.params.id)
  return success(await academyService.listSessions(isNaN(courseId) ? 0 : courseId))
})
export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(sessionSchema)(ctx.request)
  if (body.error) return body.error
  return created(await academyService.createSession(body.data))
}, { auth: true, admin: true })
export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(sessionUpdateSchema)(ctx.request)
  if (body.error) return body.error
  return success(await academyService.updateSession(Number(ctx.params.id), body.data))
}, { auth: true, admin: true })
export const DELETE = apiRoute(async (ctx) => {
  await academyService.deleteSession(Number(ctx.params.id))
  return success({ message: "Session supprimée" })
}, { auth: true, admin: true })
