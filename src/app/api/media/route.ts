import { apiRoute } from "@/lib/security/api-handler"
import { success, created, badRequest } from "@/lib/security/response"
import { createAuditLog } from "@/lib/security/audit"
import { validateFileUpload, sanitizeFilename } from "@/lib/security/file-upload"
import { getMediaList, uploadFile, createMediaRecord } from "@/lib/media/upload"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  const folderIdParam = searchParams.get("folderId")
  const result = await getMediaList({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    mimeType: searchParams.get("mimeType") ?? undefined,
    folderId: folderIdParam ? (folderIdParam === "null" ? null : Number(folderIdParam)) : undefined,
    sort: searchParams.get("sort") ?? undefined,
    order: (searchParams.get("order") as "asc" | "desc") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })
  return success(result)
})

export const POST = apiRoute(async (ctx) => {
  const formData = await ctx.request.formData()
  const files = formData.getAll("files") as File[]
  const category = (formData.get("category") as string) || "general"
  const folderIdParam = formData.get("folderId")
  const folderId = folderIdParam ? Number(folderIdParam) : undefined

  if (!files.length) return badRequest("Aucun fichier fourni.")

  const results: Array<Record<string, unknown>> = []
  const errors: { filename: string; error: string }[] = []

  for (const file of files) {
    try {
      const validation = validateFileUpload(file.type, file.name, file.size)
      if (!validation.valid) { errors.push({ filename: file.name, error: validation.error! }); continue }

      const safeName = sanitizeFilename(file.name)
      const uploadResult = await uploadFile(file, category, folderId)
      const record = await createMediaRecord(uploadResult)

      createAuditLog({
        action: "MEDIA_UPLOAD", entity: "MEDIA", entityId: record.id,
        description: `Fichier "${safeName}" téléversé`, userId: ctx.auth.session?.userId, request: ctx.request,
      })
      results.push(record)
    } catch (e) {
      errors.push({ filename: file.name, error: e instanceof Error ? e.message : "Erreur inconnue" })
    }
  }

  return created({ items: results, errors })
}, { auth: true, admin: true })
