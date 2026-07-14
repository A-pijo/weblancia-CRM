import { prisma } from "@/lib/database/prisma"
import { writeFile, mkdir, unlink } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import { processImage, getImageDimensions as sharpDimensions } from "./process"

const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]

const MAX_FILE_SIZE = 10 * 1024 * 1024

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

const VALID_CATEGORIES = [
  "projects", "blog", "services", "team", "testimonials", "general",
]

function sanitizeFilename(name: string): string {
  const ext = path.extname(name).toLowerCase()
  let base = path.basename(name, ext)
  base = base
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()
  if (!base) base = "file"
  return `${base}${ext}`
}

export interface UploadResult {
  url: string
  filename: string
  mimeType: string
  size: number
  width: number | null
  height: number | null
  alt: string
  category: string | null
  folderId?: number | null
  thumbnailUrl?: string
}

export async function uploadFile(file: File, category = "general", folderId?: number | null): Promise<UploadResult> {
  if (!ALLOWED_MIMES.includes(file.type)) {
    throw new Error(`Type de fichier non autorisé : ${file.type}`)
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Fichier trop volumineux : ${(file.size / 1024 / 1024).toFixed(1)} Mo (max 10 Mo)`)
  }

  const cat = VALID_CATEGORIES.includes(category) ? category : "general"
  const targetDir = path.join(UPLOAD_DIR, cat)
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true })
  }

  const filename = sanitizeFilename(file.name)
  const baseName = path.basename(filename, path.extname(filename))
  const uniquePrefix = `${Date.now()}`

  const buffer = Buffer.from(await file.arrayBuffer())

  const processed = await processImage(buffer, file.type)
  const webpName = `${uniquePrefix}-${baseName}.webp`
  const thumbName = `${uniquePrefix}-${baseName}-thumb.webp`

  await writeFile(path.join(targetDir, webpName), processed.webp)
  await writeFile(path.join(targetDir, thumbName), processed.thumbnail)

  return {
    url: `/uploads/${cat}/${webpName}`,
    thumbnailUrl: `/uploads/${cat}/${thumbName}`,
    filename: webpName,
    mimeType: "image/webp",
    size: processed.webp.length,
    width: processed.dimensions.width,
    height: processed.dimensions.height,
    alt: baseName,
    category: cat,
    folderId: folderId ?? null,
  }
}

export async function deleteFile(url: string): Promise<void> {
  const filePath = path.join(process.cwd(), "public", url)
  if (existsSync(filePath)) {
    await unlink(filePath)
  }
  const thumbPath = filePath.replace(/\.webp$/, "-thumb.webp")
  if (existsSync(thumbPath)) {
    await unlink(thumbPath)
  }
}

export function createMediaRecord(data: UploadResult) {
  return prisma.media.create({ data })
}

export async function getMediaList(params: {
  search?: string
  category?: string
  mimeType?: string
  folderId?: number | null
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const { search, category, mimeType, folderId, sort = "createdAt", order = "desc", page = 1, limit = 24 } = params

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { filename: { contains: search } },
      { alt: { contains: search } },
      { title: { contains: search } },
    ]
  }
  if (category) where.category = category
  if (mimeType) where.mimeType = { startsWith: mimeType }
  if (folderId !== undefined) {
    where.folderId = folderId ?? null
  }

  const skip = (page - 1) * limit
  const orderBy = { [sort]: order }

  const [items, total] = await Promise.all([
    prisma.media.findMany({ where, orderBy, skip, take: limit }),
    prisma.media.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export const MEDIA_CATEGORIES = VALID_CATEGORIES
