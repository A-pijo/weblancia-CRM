import { db } from "@/lib/db"

export type CertificateWithCategory = Awaited<ReturnType<typeof getCertificateById>>

export async function getCertificates(params: {
  search?: string
  academyCategoryId?: number
  level?: string
  isPublished?: boolean
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const {
    search,
    academyCategoryId,
    level,
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
  if (level !== undefined) where.level = level
  if (isPublished !== undefined) where.isPublished = isPublished

  const skip = (page - 1) * limit
  const orderBy = sort === "createdAt" ? { createdAt: order } : { [sort]: order }

  const [items, total] = await Promise.all([
    db.certificate.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: true },
    }),
    db.certificate.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getCertificateBySlug(slug: string) {
  return db.certificate.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getCertificateById(id: number) {
  return db.certificate.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function getPublishedCertificates(limit = 10) {
  return db.certificate.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getRelatedCertificates(currentId: number, academyCategoryId: number, limit = 3) {
  return db.certificate.findMany({
    where: { id: { not: currentId }, isPublished: true, academyCategoryId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function createCertificate(data: Record<string, unknown>) {
  return db.certificate.create({
    data: {
      title: data.title as string,
      slug: data.slug as string,
      description: (data.description as string) ?? null,
      requirements: (data.requirements ?? null) as any,
      badge: (data.badge as string) ?? null,
      duration: (data.duration as string) ?? null,
      level: (data.level as string) ?? null,
      academyCategoryId: data.academyCategoryId as number,
      isPublished: (data.isPublished as boolean) ?? false,
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

export async function updateCertificate(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = [
    "title", "slug", "description", "requirements", "badge", "duration",
    "level", "academyCategoryId", "isPublished",
    "focusKeyword", "canonicalUrl", "robots", "ogTitle", "ogDescription",
    "ogImage", "twitterCard",
  ]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  return db.certificate.update({ where: { id }, data: updateData })
}

export async function duplicateCertificate(id: number) {
  const original = await db.certificate.findUnique({ where: { id } })
  if (!original) throw new Error("Certificate not found")

  return db.certificate.create({
    data: {
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      description: original.description,
      requirements: original.requirements as any,
      badge: original.badge,
      duration: original.duration,
      level: original.level,
      academyCategoryId: original.academyCategoryId,
      isPublished: false,
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

export async function softDeleteCertificate(id: number) {
  return db.certificate.update({ where: { id }, data: { isPublished: false } })
}

export async function permanentlyDeleteCertificate(id: number) {
  return db.certificate.delete({ where: { id } })
}

export async function toggleCertificateStatus(id: number, isPublished: boolean) {
  return db.certificate.update({
    where: { id },
    data: { isPublished },
  })
}

export async function bulkUpdateCertificates(ids: number[], data: Record<string, unknown>) {
  return db.certificate.updateMany({ where: { id: { in: ids } }, data })
}
