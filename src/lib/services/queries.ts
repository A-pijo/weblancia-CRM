import { db } from "@/lib/db"
import type { Prisma } from "@/generated/prisma/client"

export type ServiceWithCategory = Prisma.ServiceGetPayload<{ include: { category: true } }>

export async function getServices(params: {
  search?: string
  categoryId?: number
  isActive?: boolean
  isFeatured?: boolean
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const { search, categoryId, isActive, isFeatured, sort = "displayOrder", order = "asc", page = 1, limit = 20 } = params

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ]
  }
  if (categoryId !== undefined) where.categoryId = categoryId
  if (isActive !== undefined) where.isActive = isActive
  if (isFeatured !== undefined) where.isFeatured = isFeatured

  const skip = (page - 1) * limit
  const orderBy = { [sort]: order }

  const [items, total] = await Promise.all([
    db.service.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: true },
    }),
    db.service.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getServiceBySlug(slug: string) {
  return db.service.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getServiceById(id: number) {
  return db.service.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function createService(data: Record<string, unknown>) {
  return db.service.create({
    data: {
      title: data.title as string,
      slug: data.slug as string,
      description: (data.description as string) ?? null,
      fullDescription: (data.fullDescription as string) ?? null,
      icon: (data.icon as string) ?? null,
      categoryId: data.categoryId as number,
      isFeatured: (data.isFeatured as boolean) ?? false,
      isActive: (data.isActive as boolean) ?? true,
      displayOrder: (data.displayOrder as number) ?? 0,
      startingPrice: (data.startingPrice as number) ?? null,
      currency: (data.currency as string) ?? null,
      ctaText: (data.ctaText as string) ?? null,
      deliverables: (data.deliverables ?? null) as any,
      benefits: (data.benefits ?? null) as any,
      process: (data.process ?? null) as any,
      technologies: (data.technologies ?? null) as any,
      faqs: (data.faqs ?? null) as any,
      relatedServices: (data.relatedServices ?? null) as any,
      featuredImage: (data.featuredImage as string) ?? null,
      galleryImages: (data.galleryImages ?? null) as any,
      clientCount: (data.clientCount as number) ?? null,
      projectCount: (data.projectCount as number) ?? null,
      satisfactionRate: (data.satisfactionRate as number) ?? null,
      outcome: (data.outcome as string) ?? null,
    },
  })
}

export async function updateService(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = [
    "title", "slug", "description", "fullDescription", "icon", "categoryId",
    "isFeatured", "isActive", "displayOrder",
    "startingPrice", "currency", "ctaText",
    "deliverables", "benefits", "process", "technologies", "faqs", "relatedServices",
    "featuredImage", "galleryImages",
    "clientCount", "projectCount", "satisfactionRate",
    "outcome",
  ]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  return db.service.update({ where: { id }, data: updateData })
}

export async function duplicateService(id: number) {
  const original = await db.service.findUnique({ where: { id } })
  if (!original) throw new Error("Service not found")

  return db.service.create({
    data: {
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      description: original.description,
      fullDescription: original.fullDescription,
      icon: original.icon,
      categoryId: original.categoryId,
      isFeatured: false,
      isActive: false,
      displayOrder: original.displayOrder + 1,
      startingPrice: original.startingPrice,
      currency: original.currency,
      ctaText: original.ctaText,
      deliverables: original.deliverables as Prisma.JsonArray | undefined,
      benefits: original.benefits as Prisma.JsonArray | undefined,
      process: original.process as Prisma.JsonArray | undefined,
      technologies: original.technologies as Prisma.JsonArray | undefined,
      faqs: original.faqs as Prisma.JsonArray | undefined,
      relatedServices: original.relatedServices as Prisma.JsonArray | undefined,
      featuredImage: original.featuredImage,
      galleryImages: original.galleryImages as Prisma.JsonArray | undefined,
      clientCount: original.clientCount,
      projectCount: original.projectCount,
      satisfactionRate: original.satisfactionRate,
      outcome: original.outcome,
    },
  })
}

export async function softDeleteService(id: number) {
  return db.service.update({ where: { id }, data: { isActive: false } })
}

export async function permanentlyDeleteService(id: number) {
  return db.service.delete({ where: { id } })
}

export async function toggleServiceStatus(id: number, isActive: boolean) {
  return db.service.update({ where: { id }, data: { isActive } })
}

export async function bulkUpdateServices(ids: number[], data: Record<string, unknown>) {
  return db.service.updateMany({ where: { id: { in: ids } }, data })
}

export async function getServiceCategories() {
  return db.serviceCategory.findMany({ orderBy: { displayOrder: "asc" } })
}

export async function getServiceCategoryBySlug(slug: string) {
  return db.serviceCategory.findUnique({ where: { slug } })
}
