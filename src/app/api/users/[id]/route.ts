import { userService } from "@/lib/repositories/services/user.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"
import { userSchema } from "@/lib/validation/users"
import { z } from "zod"

const userUpdateSchema = userSchema
  .partial()
  .extend({ _action: z.literal("toggle").optional() })
  .strict()

export const GET = apiRoute(async (ctx) => {
  try {
    const user = await userService.getById(Number(ctx.params.id))
    const { password: _pw, ...safe } = user
    return success(safe)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound()
    throw error
  }
}, { auth: true, permission: "users:manage" })

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(userUpdateSchema)(ctx.request)
  if (body.error) return body.error
  if (body.data._action === "toggle") {
    const updated = await userService.toggleStatus(Number(ctx.params.id))
    return success(updated)
  }
  const { _action: _a, ...updateData } = body.data
  const updated = await userService.update(Number(ctx.params.id), updateData)
  return success(updated)
}, { auth: true, permission: "users:manage" })

export const DELETE = apiRoute(async (ctx) => {
  await userService.delete(Number(ctx.params.id))
  return success({ message: "Utilisateur supprimé" })
}, { auth: true, permission: "users:manage" })
