import { z } from "zod"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { deleteFile } from "@/lib/media/upload"
import { createAuditLog } from "@/lib/security/audit"
import { MediaRepository } from "@/lib/repositories/media-settings-forms.repository"

const mediaRepo = new MediaRepository()

const mediaUpdateSchema = z.object({
  alt: z.string().max(200).optional(),
  title: z.string().max(255).optional(),
  caption: z.string().optional(),
  category: z.string().max(100).optional(),
  filename: z.string().max(255).optional(),
  folderId: z.number().int().positive().nullable().optional(),
}).strict()

export const GET = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const item = await mediaRepo.findById(id)
  if (!item) return notFound()
  return success(item)
})

export const PATCH = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const body = await apiBody(mediaUpdateSchema)(ctx.request)
  if (body.error) return body.error

  const item = await mediaRepo.update(id, body.data)
  createAuditLog({
    action: "UPDATE", entity: "MEDIA", entityId: id,
    description: `Media #${id} modifié`, userId: ctx.auth.session?.userId, request: ctx.request,
  })
  return success(item)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const item = await mediaRepo.findById(id)
  if (!item) return notFound()
  await deleteFile(item.url)
  await mediaRepo.delete(id)
  createAuditLog({
    action: "DELETE", entity: "MEDIA", entityId: id,
    description: `Media #${id} supprimé`, userId: ctx.auth.session?.userId, request: ctx.request,
  })
  return success({ success: true })
}, { auth: true, admin: true })
