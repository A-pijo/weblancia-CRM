import { db } from "@/lib/db"

export async function getTestimonials(params: {
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
}) {
  const { search, isActive, page = 1, limit = 20 } = params
  const where: Record<string, unknown> = {}
  if (search) where.OR = [{ name: { contains: search } }, { content: { contains: search } }]
  if (isActive !== undefined) where.isActive = isActive
  const skip = (page - 1) * limit
  const [items, total] = await Promise.all([
    db.testimonial.findMany({ where, orderBy: { displayOrder: "asc" }, skip, take: limit }),
    db.testimonial.count({ where }),
  ])
  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getTestimonialById(id: number) {
  return db.testimonial.findUnique({ where: { id } })
}

export async function createTestimonial(data: Record<string, unknown>) {
  return db.testimonial.create({
    data: {
      name: data.name as string,
      role: (data.role as string) ?? null,
      company: (data.company as string) ?? null,
      content: data.content as string,
      rating: (data.rating as number) ?? null,
      avatar: (data.avatar as string) ?? null,
      displayOrder: (data.displayOrder as number) ?? 0,
      isActive: (data.isActive as boolean) ?? true,
    },
  })
}

export async function updateTestimonial(id: number, data: Record<string, unknown>) {
  const allowed = ["name", "role", "company", "content", "rating", "avatar", "displayOrder", "isActive"]
  const updateData: Record<string, unknown> = {}
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  return db.testimonial.update({ where: { id }, data: updateData })
}

export async function toggleTestimonialStatus(id: number, isActive: boolean) {
  return db.testimonial.update({ where: { id }, data: { isActive } })
}

export async function deleteTestimonial(id: number) {
  return db.testimonial.delete({ where: { id } })
}
