import { z } from "zod"
import { apiRoute } from "@/lib/security/api-handler"
import { success, notFound, badRequest } from "@/lib/security/response"
import { createAuditLog } from "@/lib/security/audit"
import { prisma } from "@/lib/database/prisma"

const updateFolderSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  parentId: z.number().int().positive().nullable().optional(),
}).strict()

export const GET = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const folder = await prisma.mediaFolder.findUnique({
    where: { id },
    include: { _count: { select: { media: true, children: true } } },
  })
  if (!folder) return notFound()
  return success({
    ...folder,
    fileCount: (folder as unknown as { _count: { media: number; children: number } })._count.media,
    childFolderCount: (folder as unknown as { _count: { media: number; children: number } })._count.children,
  })
})

export const PATCH = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const existing = await prisma.mediaFolder.findUnique({ where: { id } })
  if (!existing) return notFound()

  const raw = await ctx.request.json()
  const parsed = updateFolderSchema.safeParse(raw)
  if (!parsed.success) return badRequest(parsed.error.message)

  const data = parsed.data
  if (data.parentId === id) return badRequest("Un dossier ne peut pas être son propre parent.")

  const updateData: Record<string, unknown> = {}
  if (data.name !== undefined) {
    const slug = data.name
      .toLowerCase()
      .replace(/[^a-z0-9-\s]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
    if (!slug) return badRequest("Impossible de générer un slug.")
    const dup = await prisma.mediaFolder.findFirst({ where: { slug, id: { not: id } } })
    if (dup) return badRequest("Un dossier avec ce nom existe déjà.")
    updateData.name = data.name
    updateData.slug = slug
  }
  if (data.parentId !== undefined) {
    updateData.parentId = data.parentId
  }

  const folder = await prisma.mediaFolder.update({ where: { id }, data: updateData })

  createAuditLog({
    action: "UPDATE", entity: "MEDIA", entityId: id,
    description: `Dossier "${folder.name}" modifié`,
    userId: ctx.auth.session?.userId, request: ctx.request,
  })

  return success(folder)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const existing = await prisma.mediaFolder.findUnique({ where: { id } })
  if (!existing) return notFound()

  const mediaCount = await prisma.media.count({ where: { folderId: id } })
  if (mediaCount > 0) {
    await prisma.media.updateMany({ where: { folderId: id }, data: { folderId: null } })
  }
  await prisma.mediaFolder.deleteMany({ where: { parentId: id } })
  await prisma.mediaFolder.delete({ where: { id } })

  createAuditLog({
    action: "DELETE", entity: "MEDIA", entityId: id,
    description: `Dossier "${existing.name}" supprimé (${mediaCount} fichiers déplacés)`,
    userId: ctx.auth.session?.userId, request: ctx.request,
  })

  return success({ success: true })
}, { auth: true, admin: true })
