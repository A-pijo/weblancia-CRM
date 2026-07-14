import { z } from "zod"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, badRequest, notFound } from "@/lib/security/response"
import { projectService } from "@/lib/repositories/services"
import { projectSchema } from "@/lib/validation/project"
import { createAuditLog } from "@/lib/security/audit"

const workUpdateSchema = projectSchema.partial().extend({
  _action: z.enum(["duplicate", "toggle"]).optional(),
}).strict()

const workDeleteSchema = z.object({ permanent: z.literal(true).optional() }).strict()

export const GET = apiRoute(async (ctx) => {
  const id = ctx.params.id
  if (!id) return notFound()

  try {
    const project = await projectService.getById(Number(id))
    return success(project)
  } catch {
    return notFound()
  }
})

export const PATCH = apiRoute(async (ctx) => {
  const id = ctx.params.id
  if (!id) return notFound()

  const body = await apiBody(workUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "duplicate") {
    const dup = await projectService.duplicate(Number(id))
    return success(dup)
  }

  if (body.data._action === "toggle") {
    const updated = await projectService.toggleStatus(Number(id))
    return success(updated)
  }

  const updated = await projectService.update(Number(id), body.data)

  createAuditLog({
    action: "UPDATE",
    entity: "PROJECT",
    entityId: Number(id),
    description: `Projet #${id} modifié`,
    userId: ctx.auth.session?.userId,
    request: ctx.request,
  })

  return success(updated)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const id = ctx.params.id
  if (!id) return notFound()

  const raw = await ctx.request.json().catch(() => ({}))
  const parsed = workDeleteSchema.safeParse(raw)
  if (!parsed.success) return badRequest("Données invalides", parsed.error.flatten().fieldErrors)

  if (parsed.data.permanent) {
    await projectService.permanentlyDelete(Number(id))
  } else {
    await projectService.delete(Number(id))
  }

  createAuditLog({
    action: "DELETE",
    entity: "PROJECT",
    entityId: Number(id),
    description: `Projet #${id} supprimé`,
    userId: ctx.auth.session?.userId,
    request: ctx.request,
  })

  return success({ success: true })
}, { auth: true, admin: true })
