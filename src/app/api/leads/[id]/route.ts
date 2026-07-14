import { z } from "zod"
import { leadService } from "@/lib/repositories/services/lead.service"
import { leadSchema } from "@/lib/validation/leads"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { NotFoundError } from "@/lib/errors"

const leadUpdateSchema = leadSchema.partial().extend({
  _action: z.enum(["status", "assign"]).optional(),
  status: z.enum(["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost", "Spam"]).optional(),
  assignedToId: z.number().int().optional(),
}).strict()

export const GET = apiRoute(async (ctx) => {
  try {
    const lead = await leadService.getById(Number(ctx.params.id))
    return success(lead)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound()
    throw error
  }
}, { auth: true, admin: true })

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(leadUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "status" && body.data.status) {
    const updated = await leadService.updateStatus(Number(ctx.params.id), body.data.status, ctx.auth.session.userId)
    return success(updated)
  }

  if (body.data._action === "assign" && body.data.assignedToId) {
    const updated = await leadService.assign(Number(ctx.params.id), body.data.assignedToId, ctx.auth.session.userId)
    return success(updated)
  }

  const updated = await leadService.update(Number(ctx.params.id), body.data)
  return success(updated)
}, {
  auth: true, admin: true,
  audit: { action: "UPDATE", entity: "LEAD", getDescription: (c) => `Lead #${c.params.id} mis à jour`, getEntityId: (c) => c.params.id },
})

export const DELETE = apiRoute(async (ctx) => {
  await leadService.delete(Number(ctx.params.id))
  return success({ message: "Lead supprimé" })
}, {
  auth: true, admin: true,
  audit: { action: "DELETE", entity: "LEAD", getDescription: (c) => `Lead #${c.params.id} supprimé`, getEntityId: (c) => c.params.id },
})
