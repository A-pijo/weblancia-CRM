import { db } from "@/lib/db"
import type { Prisma } from "@/generated/prisma/client"

export type ProjectWithImages = Prisma.ProjectGetPayload<{ include: { images: { orderBy: { displayOrder: "asc" } } } }>

export async function getProjects(params: {
  search?: string
  industry?: string
  isActive?: boolean
  isFeatured?: boolean
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const { search, industry, isActive, isFeatured, sort = "displayOrder", order = "asc", page = 1, limit = 20 } = params

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { client: { contains: search } },
    ]
  }
  if (industry !== undefined) where.industry = industry
  if (isActive !== undefined) where.isActive = isActive
  if (isFeatured !== undefined) where.isFeatured = isFeatured

  const skip = (page - 1) * limit
  const orderBy = { [sort]: order }

  const [items, total] = await Promise.all([
    db.project.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { images: { orderBy: { displayOrder: "asc" } } },
    }),
    db.project.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getProjectBySlug(slug: string) {
  return db.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { displayOrder: "asc" } } },
  })
}

export async function getProjectById(id: number) {
  return db.project.findUnique({
    where: { id },
    include: { images: { orderBy: { displayOrder: "asc" } } },
  })
}

export async function getFeaturedProjects(limit = 6) {
  return db.project.findMany({
    where: { isFeatured: true, isActive: true },
    orderBy: { displayOrder: "asc" },
    take: limit,
    include: { images: { orderBy: { displayOrder: "asc" } } },
  })
}

export async function getRelatedProjects(currentId: number, limit = 3) {
  const current = await db.project.findUnique({ where: { id: currentId }, select: { industry: true } })
  if (!current?.industry) {
    return db.project.findMany({
      where: { id: { not: currentId }, isActive: true },
      orderBy: { displayOrder: "asc" },
      take: limit,
      include: { images: { orderBy: { displayOrder: "asc" } } },
    })
  }
  return db.project.findMany({
    where: { id: { not: currentId }, isActive: true, industry: current.industry },
    orderBy: { displayOrder: "asc" },
    take: limit,
    include: { images: { orderBy: { displayOrder: "asc" } } },
  })
}

export async function getAdjacentProjects(currentId: number) {
  const current = await db.project.findUnique({ where: { id: currentId }, select: { displayOrder: true } })
  if (!current) return { prev: null, next: null }

  const [prev, next] = await Promise.all([
    db.project.findFirst({
      where: { displayOrder: { lt: current.displayOrder }, isActive: true },
      orderBy: { displayOrder: "desc" },
    }),
    db.project.findFirst({
      where: { displayOrder: { gt: current.displayOrder }, isActive: true },
      orderBy: { displayOrder: "asc" },
    }),
  ])

  return { prev, next }
}

export async function createProject(data: Record<string, unknown>) {
  return db.project.create({
    data: {
      title: data.title as string,
      slug: data.slug as string,
      description: (data.description as string) ?? null,
      client: (data.client as string) ?? null,
      clientLogo: (data.clientLogo as string) ?? null,
      clientWebsite: (data.clientWebsite as string) ?? null,
      industry: (data.industry as string) ?? null,
      country: (data.country as string) ?? null,
      date: data.date ? new Date(data.date as string) : null,
      duration: (data.duration as string) ?? null,
      url: (data.url as string) ?? null,
      isFeatured: (data.isFeatured as boolean) ?? false,
      isActive: (data.isActive as boolean) ?? true,
      displayOrder: (data.displayOrder as number) ?? 0,
      status: (data.status as string) ?? null,
      fullCaseStudy: (data.fullCaseStudy as string) ?? null,
      challenge: (data.challenge as string) ?? null,
      solution: (data.solution as string) ?? null,
      results: (data.results ?? null) as any,
      technologies: (data.technologies ?? null) as any,
      servicesProvided: (data.servicesProvided ?? null) as any,
      teamMembers: (data.teamMembers ?? null) as any,
      clientTestimonial: (data.clientTestimonial ?? null) as any,
      featuredImage: (data.featuredImage as string) ?? null,
      desktopScreenshot: (data.desktopScreenshot as string) ?? null,
      tabletScreenshot: (data.tabletScreenshot as string) ?? null,
      mobileScreenshot: (data.mobileScreenshot as string) ?? null,
      videoUrl: (data.videoUrl as string) ?? null,
    },
  })
}

export async function updateProject(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = [
    "title", "slug", "description", "client", "clientLogo", "clientWebsite",
    "industry", "country", "date", "duration", "url",
    "isFeatured", "isActive", "displayOrder", "status",
    "fullCaseStudy", "challenge", "solution",
    "results", "technologies", "servicesProvided", "teamMembers", "clientTestimonial",
    "featuredImage", "desktopScreenshot", "tabletScreenshot", "mobileScreenshot", "videoUrl",
  ]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  return db.project.update({ where: { id }, data: updateData })
}

export async function duplicateProject(id: number) {
  const original = await db.project.findUnique({ where: { id } })
  if (!original) throw new Error("Project not found")

  return db.project.create({
    data: {
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      description: original.description,
      client: original.client,
      clientLogo: original.clientLogo,
      clientWebsite: original.clientWebsite,
      industry: original.industry,
      country: original.country,
      date: original.date,
      duration: original.duration,
      url: original.url,
      isFeatured: false,
      isActive: false,
      displayOrder: original.displayOrder + 1,
      status: original.status,
      fullCaseStudy: original.fullCaseStudy,
      challenge: original.challenge,
      solution: original.solution,
      results: original.results as Prisma.JsonArray | undefined,
      technologies: original.technologies as Prisma.JsonArray | undefined,
      servicesProvided: original.servicesProvided as Prisma.JsonArray | undefined,
      teamMembers: original.teamMembers as Prisma.JsonArray | undefined,
      clientTestimonial: original.clientTestimonial as Prisma.JsonObject | undefined,
      featuredImage: original.featuredImage,
      desktopScreenshot: original.desktopScreenshot,
      tabletScreenshot: original.tabletScreenshot,
      mobileScreenshot: original.mobileScreenshot,
      videoUrl: original.videoUrl,
    },
  })
}

export async function softDeleteProject(id: number) {
  return db.project.update({ where: { id }, data: { isActive: false } })
}

export async function permanentlyDeleteProject(id: number) {
  return db.project.delete({ where: { id } })
}

export async function toggleProjectStatus(id: number, isActive: boolean) {
  return db.project.update({ where: { id }, data: { isActive } })
}

export async function bulkUpdateProjects(ids: number[], data: Record<string, unknown>) {
  return db.project.updateMany({ where: { id: { in: ids } }, data })
}

export async function getProjectIndustries() {
  const result = await db.project.findMany({
    where: { industry: { not: null } },
    select: { industry: true },
    distinct: ["industry"],
    orderBy: { industry: "asc" },
  })
  return result.map((r) => r.industry).filter(Boolean) as string[]
}
