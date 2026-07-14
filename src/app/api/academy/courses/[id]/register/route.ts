import { z } from "zod"
import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { created, badRequest } from "@/lib/security/response"

const registrationSchema = z.object({
  firstName: z.string().min(1).max(100), lastName: z.string().min(1).max(100),
  email: z.string().email().max(255), phone: z.string().max(50).optional(),
  country: z.string().max(100).optional(), city: z.string().max(100).optional(),
  company: z.string().max(200).optional(), currentLevel: z.string().max(100).optional(),
  preferredSession: z.string().max(200).optional(), message: z.string().optional(),
}).strict()

export const POST = apiRoute(async (ctx) => {
  const courseId = Number(ctx.params.id)
  if (isNaN(courseId)) return badRequest("ID de cours invalide")

  const body = await apiBody(registrationSchema)(ctx.request)
  if (body.error) return body.error

  return created(await academyService.createRegistration({ ...body.data, courseId }))
}, { rateLimit: { max: 10, by: "ip" } })
