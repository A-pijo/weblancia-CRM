import { db } from "@/lib/db"
import { writeFile, mkdir, unlink } from "node:fs/promises"
import { existsSync } from "node:fs"
import path from "node:path"
import sizeOf from "image-size"

const ALLOWED_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
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

function getImageDimensions(buffer: Buffer, mime: string) {
  if (mime === "image/svg+xml") return { width: null, height: null }
  try {
    const dim = sizeOf(buffer)
    return { width: dim.width ?? null, height: dim.height ?? null }
  } catch {
    return { width: null, height: null }
  }
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
}

export async function uploadFile(file: File, category = "general"): Promise<UploadResult> {
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
  const uniqueName = `${Date.now()}-${filename}`
  const filePath = path.join(targetDir, uniqueName)

  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(filePath, buffer)

  const { width, height } = getImageDimensions(buffer, file.type)

  return {
    url: `/uploads/${cat}/${uniqueName}`,
    filename,
    mimeType: file.type,
    size: file.size,
    width,
    height,
    alt: filename,
    category: cat,
  }
}

export async function deleteFile(url: string): Promise<void> {
  const filePath = path.join(process.cwd(), "public", url)
  if (existsSync(filePath)) {
    await unlink(filePath)
  }
}

export function createMediaRecord(data: UploadResult) {
  return db.media.create({ data })
}

export async function getMediaList(params: {
  search?: string
  category?: string
  mimeType?: string
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const { search, category, mimeType, sort = "createdAt", order = "desc", page = 1, limit = 24 } = params

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

  const skip = (page - 1) * limit
  const orderBy = { [sort]: order }

  const [items, total] = await Promise.all([
    db.media.findMany({ where, orderBy, skip, take: limit }),
    db.media.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export const MEDIA_CATEGORIES = VALID_CATEGORIES
