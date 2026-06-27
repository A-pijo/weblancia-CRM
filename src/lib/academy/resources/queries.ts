import { db } from "@/lib/db"

export type ResourceWithCategory = Awaited<ReturnType<typeof getResourceById>>

export async function getResources(params: {
  search?: string
  academyCategoryId?: number
  type?: string
  isFree?: boolean
  isPublished?: boolean
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const {
    search,
    academyCategoryId,
    type,
    isFree,
    isPublished,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 20,
  } = params

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ]
  }
  if (academyCategoryId !== undefined) where.academyCategoryId = academyCategoryId
  if (type !== undefined) where.type = type
  if (isFree !== undefined) where.isFree = isFree
  if (isPublished !== undefined) where.isPublished = isPublished

  const skip = (page - 1) * limit
  const orderBy = sort === "createdAt" ? { createdAt: order } : { [sort]: order }

  const [items, total] = await Promise.all([
    db.resource.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: true },
    }),
    db.resource.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getResourceBySlug(slug: string) {
  return db.resource.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getResourceById(id: number) {
  return db.resource.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function getPublishedResources(limit = 10) {
  return db.resource.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getFreeResources(limit = 3) {
  return db.resource.findMany({
    where: { isPublished: true, isFree: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getRelatedResources(currentId: number, academyCategoryId: number, limit = 3) {
  return db.resource.findMany({
    where: { id: { not: currentId }, isPublished: true, academyCategoryId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function createResource(data: Record<string, unknown>) {
  return db.resource.create({
    data: {
      title: data.title as string,
      slug: data.slug as string,
      description: (data.description as string) ?? null,
      academyCategoryId: data.academyCategoryId as number,
      type: (data.type as string) ?? null,
      file: (data.file as string) ?? null,
      thumbnail: (data.thumbnail as string) ?? null,
      image: (data.image as string) ?? null,
      isFree: (data.isFree as boolean) ?? true,
      isPublished: (data.isPublished as boolean) ?? false,
      downloads: (data.downloads as number) ?? 0,
      focusKeyword: (data.focusKeyword as string) ?? null,
      canonicalUrl: (data.canonicalUrl as string) ?? null,
      robots: (data.robots as string) ?? null,
      ogTitle: (data.ogTitle as string) ?? null,
      ogDescription: (data.ogDescription as string) ?? null,
      ogImage: (data.ogImage as string) ?? null,
      twitterCard: (data.twitterCard as string) ?? null,
    },
  })
}

export async function updateResource(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = [
    "title", "slug", "description", "academyCategoryId", "type",
    "file", "thumbnail", "image", "isFree", "isPublished", "downloads",
    "focusKeyword", "canonicalUrl", "robots", "ogTitle", "ogDescription",
    "ogImage", "twitterCard",
  ]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  return db.resource.update({ where: { id }, data: updateData })
}

export async function duplicateResource(id: number) {
  const original = await db.resource.findUnique({ where: { id } })
  if (!original) throw new Error("Resource not found")

  return db.resource.create({
    data: {
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      description: original.description,
      academyCategoryId: original.academyCategoryId,
      type: original.type,
      file: original.file,
      thumbnail: original.thumbnail,
      image: original.image,
      isFree: original.isFree,
      isPublished: false,
      downloads: 0,
      focusKeyword: original.focusKeyword,
      canonicalUrl: original.canonicalUrl,
      robots: original.robots,
      ogTitle: original.ogTitle,
      ogDescription: original.ogDescription,
      ogImage: original.ogImage,
      twitterCard: original.twitterCard,
    },
  })
}

export async function softDeleteResource(id: number) {
  return db.resource.update({ where: { id }, data: { isPublished: false } })
}

export async function permanentlyDeleteResource(id: number) {
  return db.resource.delete({ where: { id } })
}

export async function toggleResourceStatus(id: number, isPublished: boolean) {
  return db.resource.update({
    where: { id },
    data: { isPublished },
  })
}

export async function bulkUpdateResources(ids: number[], data: Record<string, unknown>) {
  return db.resource.updateMany({ where: { id: { in: ids } }, data })
}

export async function incrementDownloads(id: number) {
  return db.resource.update({
    where: { id },
    data: { downloads: { increment: 1 } },
  })
}
