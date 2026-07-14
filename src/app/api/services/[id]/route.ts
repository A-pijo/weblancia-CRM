import { serviceService } from "@/lib/repositories/services/service.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound } from "@/lib/security/response"
import { createAuditLog } from "@/lib/security/audit"
import { NotFoundError } from "@/lib/errors"
import { serviceSchema } from "@/lib/validation/services"
import { z } from "zod"

const serviceUpdateSchema = serviceSchema
  .partial()
  .extend({ _action: z.enum(["duplicate", "toggle"]).optional() })
  .strict()

const serviceDeleteSchema = z.object({
  permanent: z.literal(true).optional(),
}).strict()

export const GET = apiRoute(async (ctx) => {
  try {
    const service = await serviceService.getById(Number(ctx.params.id))
    return success(service)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound()
    throw error
  }
})

export const PATCH = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const body = await apiBody(serviceUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "duplicate") {
    const dup = await serviceService.duplicate(id)
    createAuditLog({
      action: "CREATE", entity: "SERVICE", entityId: dup.id,
      description: `Service #${id} duplicated as "${dup.title}"`, userId: ctx.auth.session.userId, request: ctx.request,
    })
    return success(dup)
  }

  if (body.data._action === "toggle") {
    const updated = await serviceService.toggleStatus(id)
    createAuditLog({
      action: "UPDATE", entity: "SERVICE", entityId: id,
      description: `Service #${id} status toggled to ${updated.isActive}`, userId: ctx.auth.session.userId, request: ctx.request,
    })
    return success(updated)
  }

  const { _action: _a, ...updateData } = body.data
  const updated = await serviceService.update(id, updateData)
  createAuditLog({
    action: "UPDATE", entity: "SERVICE", entityId: id,
    description: `Service #${id} updated`, userId: ctx.auth.session.userId, request: ctx.request,
  })
  return success(updated)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const body = await apiBody(serviceDeleteSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data.permanent) {
    await serviceService.permanentlyDelete(id)
  } else {
    await serviceService.delete(id)
  }
  createAuditLog({
    action: "DELETE", entity: "SERVICE", entityId: id,
    description: `Service #${id} ${body.data.permanent ? "permanently deleted" : "soft deleted"}`, userId: ctx.auth.session.userId, request: ctx.request,
  })
  return success({ success: true })
}, { auth: true, admin: true })
