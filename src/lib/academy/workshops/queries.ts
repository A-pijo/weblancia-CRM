import { db } from "@/lib/db"

export type WorkshopWithCategory = Awaited<ReturnType<typeof getWorkshopById>>

export async function getWorkshops(params: {
  search?: string
  academyCategoryId?: number
  status?: string
  isPublished?: boolean
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const {
    search,
    academyCategoryId,
    status,
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
      { instructor: { contains: search } },
    ]
  }
  if (academyCategoryId !== undefined) where.academyCategoryId = academyCategoryId
  if (status !== undefined) where.status = status
  if (isPublished !== undefined) where.isPublished = isPublished

  const skip = (page - 1) * limit
  const orderBy = sort === "createdAt" ? { createdAt: order } : { [sort]: order }

  const [items, total] = await Promise.all([
    db.workshop.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: true },
    }),
    db.workshop.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getWorkshopBySlug(slug: string) {
  return db.workshop.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getWorkshopById(id: number) {
  return db.workshop.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function getPublishedWorkshops(limit = 10) {
  return db.workshop.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getUpcomingWorkshops(limit = 3) {
  return db.workshop.findMany({
    where: { isPublished: true, date: { gte: new Date() } },
    orderBy: { date: "asc" },
    take: limit,
    include: { category: true },
  })
}

export async function getRelatedWorkshops(currentId: number, academyCategoryId: number, limit = 3) {
  return db.workshop.findMany({
    where: { id: { not: currentId }, isPublished: true, academyCategoryId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function createWorkshop(data: Record<string, unknown>) {
  return db.workshop.create({
    data: {
      title: data.title as string,
      slug: data.slug as string,
      description: (data.description as string) ?? null,
      instructor: (data.instructor as string) ?? null,
      academyCategoryId: data.academyCategoryId as number,
      date: data.date ? new Date(data.date as string) : null,
      time: (data.time as string) ?? null,
      duration: (data.duration as string) ?? null,
      seats: (data.seats as number) ?? null,
      location: (data.location as string) ?? null,
      type: (data.type as string) ?? null,
      price: (data.price as number) ?? null,
      registrationDeadline: data.registrationDeadline
        ? new Date(data.registrationDeadline as string)
        : null,
      status: (data.status as string) ?? null,
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

export async function updateWorkshop(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = [
    "title", "slug", "description", "instructor", "academyCategoryId",
    "date", "time", "duration", "seats", "location", "type", "price",
    "registrationDeadline", "status", "isPublished",
    "focusKeyword", "canonicalUrl", "robots", "ogTitle", "ogDescription",
    "ogImage", "twitterCard",
  ]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  if (updateData.date) {
    updateData.date = new Date(updateData.date as string)
  }
  if (updateData.registrationDeadline) {
    updateData.registrationDeadline = new Date(updateData.registrationDeadline as string)
  }
  return db.workshop.update({ where: { id }, data: updateData })
}

export async function duplicateWorkshop(id: number) {
  const original = await db.workshop.findUnique({ where: { id } })
  if (!original) throw new Error("Workshop not found")

  return db.workshop.create({
    data: {
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      description: original.description,
      instructor: original.instructor,
      academyCategoryId: original.academyCategoryId,
      date: null,
      time: original.time,
      duration: original.duration,
      seats: original.seats,
      location: original.location,
      type: original.type,
      price: original.price,
      registrationDeadline: null,
      status: original.status,
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

export async function softDeleteWorkshop(id: number) {
  return db.workshop.update({ where: { id }, data: { isPublished: false } })
}

export async function permanentlyDeleteWorkshop(id: number) {
  return db.workshop.delete({ where: { id } })
}

export async function toggleWorkshopStatus(id: number, isPublished: boolean) {
  return db.workshop.update({
    where: { id },
    data: { isPublished },
  })
}

export async function bulkUpdateWorkshops(ids: number[], data: Record<string, unknown>) {
  return db.workshop.updateMany({ where: { id: { in: ids } }, data })
}
