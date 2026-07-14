import { z } from "zod"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created, badRequest, serverError } from "@/lib/security/response"
import { createAuditLog } from "@/lib/security/audit"
import { MediaFolderRepository } from "@/lib/repositories/media-settings-forms.repository"
import { prisma } from "@/lib/database/prisma"

const folderRepo = new MediaFolderRepository()

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

const createFolderSchema = z.object({
  name: z.string().min(1).max(255),
  parentId: z.number().int().positive().optional(),
}).strict()

export const GET = apiRoute(async () => {
  const folders = await folderRepo.findTree()
  return success(folders)
})

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(createFolderSchema)(ctx.request)
  if (body.error) return body.error

  const slug = slugify(body.data.name)
  if (!slug) return badRequest("Impossible de générer un slug à partir de ce nom.")

  const existing = await prisma.mediaFolder.findUnique({ where: { slug } })
  if (existing) return badRequest("Un dossier avec ce nom existe déjà.")

  const folder = await prisma.mediaFolder.create({
    data: {
      name: body.data.name,
      slug,
      parentId: body.data.parentId ?? null,
    },
  })

  createAuditLog({
    action: "CREATE", entity: "MEDIA", entityId: folder.id,
    description: `Dossier "${folder.name}" créé`,
    userId: ctx.auth.session?.userId, request: ctx.request,
  })

  return created(folder)
}, { auth: true, admin: true })
