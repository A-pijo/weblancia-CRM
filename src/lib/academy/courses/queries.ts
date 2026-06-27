import { db } from "@/lib/db"

export type CourseWithCategory = Awaited<ReturnType<typeof getCourseById>>

export async function getCourses(params: {
  search?: string
  academyCategoryId?: number
  level?: string
  isPublished?: boolean
  isFeatured?: boolean
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
    isFeatured,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 20,
  } = params

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { shortDescription: { contains: search } },
      { instructor: { contains: search } },
    ]
  }
  if (academyCategoryId !== undefined) where.academyCategoryId = academyCategoryId
  if (level !== undefined) where.level = level
  if (isPublished !== undefined) where.isPublished = isPublished
  if (isFeatured !== undefined) where.isFeatured = isFeatured

  const skip = (page - 1) * limit
  const orderBy = sort === "createdAt" ? { createdAt: order } : { [sort]: order }

  const [items, total] = await Promise.all([
    db.course.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: true },
    }),
    db.course.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getCourseBySlug(slug: string) {
  return db.course.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getCourseById(id: number) {
  return db.course.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function getPublishedCourses(limit = 10) {
  return db.course.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getFeaturedCourses(limit = 3) {
  return db.course.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getRelatedCourses(currentId: number, academyCategoryId: number, limit = 3) {
  return db.course.findMany({
    where: { id: { not: currentId }, isPublished: true, academyCategoryId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function createCourse(data: Record<string, unknown>) {
  return db.course.create({
    data: {
      title: data.title as string,
      slug: data.slug as string,
      shortDescription: (data.shortDescription as string) ?? null,
      fullDescription: (data.fullDescription as string) ?? null,
      instructor: (data.instructor as string) ?? null,
      academyCategoryId: data.academyCategoryId as number,
      level: (data.level as string) ?? null,
      duration: (data.duration as string) ?? null,
      language: (data.language as string) ?? null,
      price: (data.price as number) ?? null,
      discountPrice: (data.discountPrice as number) ?? null,
      isFeatured: (data.isFeatured as boolean) ?? false,
      isPublished: (data.isPublished as boolean) ?? false,
      thumbnail: (data.thumbnail as string) ?? null,
      gallery: (data.gallery ?? null) as any,
      curriculum: (data.curriculum ?? null) as any,
      requirements: (data.requirements ?? null) as any,
      learningOutcomes: (data.learningOutcomes ?? null) as any,
      certificateIncluded: (data.certificateIncluded as boolean) ?? false,
      downloadableResources: (data.downloadableResources ?? null) as any,
      faqs: (data.faqs ?? null) as any,
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

export async function updateCourse(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = [
    "title", "slug", "shortDescription", "fullDescription", "instructor",
    "academyCategoryId", "level", "duration", "language", "price", "discountPrice",
    "isFeatured", "isPublished", "thumbnail", "gallery", "curriculum",
    "requirements", "learningOutcomes", "certificateIncluded", "downloadableResources",
    "faqs", "focusKeyword", "canonicalUrl", "robots", "ogTitle", "ogDescription",
    "ogImage", "twitterCard",
  ]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  return db.course.update({ where: { id }, data: updateData })
}

export async function duplicateCourse(id: number) {
  const original = await db.course.findUnique({ where: { id } })
  if (!original) throw new Error("Course not found")

  return db.course.create({
    data: {
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      shortDescription: original.shortDescription,
      fullDescription: original.fullDescription,
      instructor: original.instructor,
      academyCategoryId: original.academyCategoryId,
      level: original.level,
      duration: original.duration,
      language: original.language,
      price: original.price,
      discountPrice: original.discountPrice,
      isFeatured: false,
      isPublished: false,
      thumbnail: original.thumbnail,
      gallery: original.gallery as any,
      curriculum: original.curriculum as any,
      requirements: original.requirements as any,
      learningOutcomes: original.learningOutcomes as any,
      certificateIncluded: original.certificateIncluded,
      downloadableResources: original.downloadableResources as any,
      faqs: original.faqs as any,
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

export async function softDeleteCourse(id: number) {
  return db.course.update({ where: { id }, data: { isPublished: false } })
}

export async function permanentlyDeleteCourse(id: number) {
  return db.course.delete({ where: { id } })
}

export async function toggleCourseStatus(id: number, isPublished: boolean) {
  return db.course.update({
    where: { id },
    data: { isPublished },
  })
}

export async function bulkUpdateCourses(ids: number[], data: Record<string, unknown>) {
  return db.course.updateMany({ where: { id: { in: ids } }, data })
}
