import { db } from "@/lib/db"

export type RegistrationWithCourse = Awaited<ReturnType<typeof getRegistrationById>>

export async function getRegistrations(params: {
  search?: string
  status?: string
  courseId?: number
  page?: number
  limit?: number
}) {
  const { search, status, courseId, page = 1, limit = 20 } = params
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { firstName: { contains: search } },
      { lastName: { contains: search } },
      { email: { contains: search } },
      { company: { contains: search } },
    ]
  }
  if (status !== undefined) where.status = status
  if (courseId !== undefined) where.courseId = courseId

  const skip = (page - 1) * limit

  const [items, total] = await Promise.all([
    db.courseRegistration.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { course: { select: { id: true, title: true, slug: true } } },
    }),
    db.courseRegistration.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getRegistrationById(id: number) {
  return db.courseRegistration.findUnique({
    where: { id },
    include: { course: { select: { id: true, title: true, slug: true, price: true } } },
  })
}

export async function getRegistrationsCount(params: {
  status?: string
  courseId?: number
}) {
  const where: Record<string, unknown> = {}
  if (params.status !== undefined) where.status = params.status
  if (params.courseId !== undefined) where.courseId = params.courseId
  return db.courseRegistration.count({ where })
}

export async function createRegistration(data: {
  firstName: string
  lastName: string
  email: string
  phone?: string
  country?: string
  city?: string
  company?: string
  currentLevel?: string
  courseId: number
  preferredSession?: string
  message?: string
}) {
  return db.courseRegistration.create({ data })
}

export async function updateRegistrationStatus(id: number, status: string) {
  return db.courseRegistration.update({
    where: { id },
    data: { status },
  })
}

export async function deleteRegistration(id: number) {
  return db.courseRegistration.delete({ where: { id } })
}
