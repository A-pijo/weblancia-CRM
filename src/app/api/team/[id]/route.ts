import { z } from "zod"
import { teamMemberService } from "@/lib/repositories/services/team.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"

const teamUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  role: z.string().min(1).max(200).optional(),
  bio: z.string().optional(),
  image: z.string().max(500).optional(),
  linkedin: z.string().max(500).optional(),
  twitter: z.string().max(500).optional(),
  github: z.string().max(500).optional(),
  email: z.string().max(200).optional(),
  phone: z.string().max(50).optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
  _action: z.literal("toggle").optional(),
}).strict()

export const GET = apiRoute(async (ctx) => {
  try {
    const member = await teamMemberService.getById(Number(ctx.params.id))
    return success(member)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound()
    throw error
  }
})

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(teamUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "toggle") {
    const updated = await teamMemberService.update(Number(ctx.params.id), { isActive: body.data.isActive ?? true })
    return success(updated)
  }

  const updated = await teamMemberService.update(Number(ctx.params.id), body.data)
  return success(updated)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  await teamMemberService.delete(Number(ctx.params.id))
  return success({ message: "Membre supprimé" })
}, { auth: true, admin: true })
