import { BaseRepository } from "@/lib/repositories/base.repository"
import { prisma } from "@/lib/database/prisma"

type Delegate = typeof prisma.academyCategory
export class AcademyCategoryRepository extends BaseRepository<Delegate> {
  constructor() { super(prisma.academyCategory, "academyCategory") }
  async findBySlug(slug: string) { return this.model.findUnique({ where: { slug } }) }
}

type CourseDelegate = typeof prisma.course
export class CourseRepository extends BaseRepository<CourseDelegate> {
  constructor() { super(prisma.course, "course") }
  async findBySlug(slug: string) { return this.model.findUnique({ where: { slug }, include: { category: true } }) }
  async findPublished(limit = 10) { return this.model.findMany({ where: { isPublished: true }, include: { category: true }, orderBy: { createdAt: "desc" }, take: limit }) }
  async findFeatured(limit = 10) { return this.model.findMany({ where: { isPublished: true, isFeatured: true }, include: { category: true }, orderBy: { createdAt: "desc" }, take: limit }) }
  async findRelated(courseId: number, categoryId: number, limit = 3) {
    return this.model.findMany({ where: { isPublished: true, academyCategoryId: categoryId, id: { not: courseId } }, include: { category: true }, orderBy: { createdAt: "desc" }, take: limit })
  }
  async toggleStatus(id: number, isPublished: boolean) { return this.model.update({ where: { id }, data: { isPublished } }) }
  async softDelete(id: number) { return this.model.update({ where: { id }, data: { isPublished: false } }) }
  async duplicate(id: number) {
    const original = await this.model.findUnique({ where: { id } })
    if (!original) return null
    const { id: _id, createdAt: _c, updatedAt: _u, ...data } = original
    const rest = data as Record<string, unknown>
    return this.model.create({ data: { ...rest, title: `${String(rest.title)} (copie)`, slug: `${String(rest.slug)}-copy-${Date.now()}`, isPublished: false } })
  }
}

type WorkshopDelegate = typeof prisma.workshop
export class WorkshopRepository extends BaseRepository<WorkshopDelegate> {
  constructor() { super(prisma.workshop, "workshop") }
  async findBySlug(slug: string) { return this.model.findUnique({ where: { slug }, include: { category: true } }) }
  async findUpcoming(limit = 10) { return this.model.findMany({ where: { status: "Upcoming", isPublished: true }, include: { category: true }, orderBy: { date: "asc" }, take: limit }) }
  async toggleStatus(id: number, isPublished: boolean) { return this.model.update({ where: { id }, data: { isPublished } }) }
  async softDelete(id: number) { return this.model.update({ where: { id }, data: { isPublished: false } }) }
  async duplicate(id: number) {
    const original = await this.model.findUnique({ where: { id } })
    if (!original) return null
    const { id: _id, createdAt: _c, updatedAt: _u, ...data } = original
    const rest = data as Record<string, unknown>
    return this.model.create({ data: { ...rest, title: `${String(rest.title)} (copie)`, slug: `${String(rest.slug)}-copy-${Date.now()}`, isPublished: false } })
  }
}

type SessionDelegate = typeof prisma.courseSession
export class SessionRepository extends BaseRepository<SessionDelegate> {
  constructor() { super(prisma.courseSession, "courseSession") }
  async findByCourse(courseId: number) { return this.model.findMany({ where: { courseId }, orderBy: { startDate: "asc" } }) }
}

type ResourceDelegate = typeof prisma.resource
export class ResourceRepository extends BaseRepository<ResourceDelegate> {
  constructor() { super(prisma.resource, "resource") }
  async findBySlug(slug: string) { return this.model.findUnique({ where: { slug }, include: { category: true } }) }
  async findFree(limit = 10) { return this.model.findMany({ where: { isFree: true, isPublished: true }, include: { category: true }, orderBy: { createdAt: "desc" }, take: limit }) }
  async toggleStatus(id: number, isPublished: boolean) { return this.model.update({ where: { id }, data: { isPublished } }) }
  async softDelete(id: number) { return this.model.update({ where: { id }, data: { isPublished: false } }) }
  async incrementDownloads(id: number) { return this.model.update({ where: { id }, data: { downloads: { increment: 1 } } }) }
  async duplicate(id: number) {
    const original = await this.model.findUnique({ where: { id } })
    if (!original) return null
    const { id: _id, createdAt: _c, updatedAt: _u, ...data } = original
    const rest = data as Record<string, unknown>
    return this.model.create({ data: { ...rest, title: `${String(rest.title)} (copie)`, slug: `${String(rest.slug)}-copy-${Date.now()}`, isPublished: false } })
  }
}

type CertificateDelegate = typeof prisma.certificate
export class CertificateRepository extends BaseRepository<CertificateDelegate> {
  constructor() { super(prisma.certificate, "certificate") }
  async findBySlug(slug: string) { return this.model.findUnique({ where: { slug }, include: { category: true } }) }
  async toggleStatus(id: number, isPublished: boolean) { return this.model.update({ where: { id }, data: { isPublished } }) }
  async softDelete(id: number) { return this.model.update({ where: { id }, data: { isPublished: false } }) }
  async duplicate(id: number) {
    const original = await this.model.findUnique({ where: { id } })
    if (!original) return null
    const { id: _id, createdAt: _c, updatedAt: _u, ...data } = original
    const rest = data as Record<string, unknown>
    return this.model.create({ data: { ...rest, title: `${String(rest.title)} (copie)`, slug: `${String(rest.slug)}-copy-${Date.now()}`, isPublished: false } })
  }
}

type RegistrationDelegate = typeof prisma.courseRegistration
export class RegistrationRepository extends BaseRepository<RegistrationDelegate> {
  constructor() { super(prisma.courseRegistration, "courseRegistration") }
  async updateStatus(id: number, status: string) { return this.model.update({ where: { id }, data: { status } }) }
}
