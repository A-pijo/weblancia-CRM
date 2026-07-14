import { NotFoundError } from "@/lib/errors"
import type { Prisma } from "@/generated/prisma/client"
import {
  AcademyCategoryRepository, CourseRepository, WorkshopRepository, SessionRepository, ResourceRepository, CertificateRepository, RegistrationRepository,
} from "@/lib/repositories/academy.repository"

export const academyCategoryRepo = new AcademyCategoryRepository()
export const courseRepo = new CourseRepository()
export const workshopRepo = new WorkshopRepository()
export const sessionRepo = new SessionRepository()
export const resourceRepo = new ResourceRepository()
export const certificateRepo = new CertificateRepository()
export const registrationRepo = new RegistrationRepository()

export class AcademyService {
  // Categories
  async listCategories(params: { page?: number; limit?: number }) { return academyCategoryRepo.findPaginated({ orderBy: { displayOrder: "asc" }, page: params.page, limit: params.limit }) }
  async getCategoryById(id: number) { const c = await academyCategoryRepo.findById(id); if (!c) throw new NotFoundError("Categorie introuvable"); return c }
  async createCategory(data: Record<string, unknown>) { return academyCategoryRepo.create(data) }
  async updateCategory(id: number, data: Record<string, unknown>) { await this.getCategoryById(id); return academyCategoryRepo.update(id, data) }
  async softDeleteCategory(id: number) { await this.getCategoryById(id); return academyCategoryRepo.update(id, { displayOrder: 9999 }) }
  async permanentlyDeleteCategory(id: number) { await this.getCategoryById(id); return academyCategoryRepo.delete(id) }

  // Courses
  async listCourses(params: { page?: number; limit?: number; search?: string; category?: string; level?: string; published?: boolean; featured?: boolean }) {
    const where: Prisma.CourseWhereInput = {}
    if (params.search) where.OR = [{ title: { contains: params.search, mode: "insensitive" } }, { shortDescription: { contains: params.search, mode: "insensitive" } }]
    if (params.category) where.category = { slug: params.category }
    if (params.level) where.level = params.level
    if (params.published !== undefined) where.isPublished = params.published
    if (params.featured !== undefined) where.isFeatured = params.featured
    return courseRepo.findPaginated({ where, orderBy: { createdAt: "desc" }, page: params.page, limit: params.limit, include: { category: true } })
  }
  async getCourseById(id: number) { const c = await courseRepo.findById(id); if (!c) throw new NotFoundError("Cours introuvable"); return c }
  async createCourse(data: Record<string, unknown>) { return courseRepo.create(data) }
  async updateCourse(id: number, data: Record<string, unknown>) { await this.getCourseById(id); return courseRepo.update(id, data) }
  async deleteCourse(id: number) { await this.getCourseById(id); return courseRepo.softDelete(id) }
  async permanentlyDeleteCourse(id: number) { await this.getCourseById(id); return courseRepo.delete(id) }
  async duplicateCourse(id: number) { const d = await courseRepo.duplicate(id); if (!d) throw new NotFoundError("Cours introuvable"); return d }
  async toggleCourseStatus(id: number) { const c = await this.getCourseById(id); return courseRepo.toggleStatus(id, !c.isPublished) }

  // Workshops
  async listWorkshops(params: { page?: number; limit?: number; search?: string; category?: string; status?: string; published?: boolean }) {
    const where: Prisma.WorkshopWhereInput = {}
    if (params.search) where.OR = [{ title: { contains: params.search, mode: "insensitive" } }, { description: { contains: params.search, mode: "insensitive" } }]
    if (params.category) where.category = { slug: params.category }
    if (params.status) where.status = params.status
    if (params.published !== undefined) where.isPublished = params.published
    return workshopRepo.findPaginated({ where, orderBy: { date: "asc" }, page: params.page, limit: params.limit, include: { category: true } })
  }
  async getWorkshopById(id: number) { const w = await workshopRepo.findById(id); if (!w) throw new NotFoundError("Atelier introuvable"); return w }
  async createWorkshop(data: Record<string, unknown>) { return workshopRepo.create(data) }
  async updateWorkshop(id: number, data: Record<string, unknown>) { await this.getWorkshopById(id); return workshopRepo.update(id, data) }
  async deleteWorkshop(id: number) { await this.getWorkshopById(id); return workshopRepo.softDelete(id) }
  async permanentlyDeleteWorkshop(id: number) { await this.getWorkshopById(id); return workshopRepo.delete(id) }
  async toggleWorkshopStatus(id: number) { const w = await this.getWorkshopById(id); return workshopRepo.toggleStatus(id, !w.isPublished) }
  async duplicateWorkshop(id: number) { const d = await workshopRepo.duplicate(id); if (!d) throw new NotFoundError("Atelier introuvable"); return d }

  // Sessions
  async listSessions(courseId: number) { return sessionRepo.findByCourse(courseId) }
  async getSessionById(id: number) { const s = await sessionRepo.findById(id); if (!s) throw new NotFoundError("Session introuvable"); return s }
  async createSession(data: Record<string, unknown>) { return sessionRepo.create(data) }
  async updateSession(id: number, data: Record<string, unknown>) { await this.getSessionById(id); return sessionRepo.update(id, data) }
  async deleteSession(id: number) { await this.getSessionById(id); return sessionRepo.delete(id) }

  // Resources
  async listResources(params: { page?: number; limit?: number; search?: string; category?: string; free?: boolean; published?: boolean }) {
    const where: Prisma.ResourceWhereInput = {}
    if (params.search) where.OR = [{ title: { contains: params.search, mode: "insensitive" } }, { description: { contains: params.search, mode: "insensitive" } }]
    if (params.category) where.category = { slug: params.category }
    if (params.free !== undefined) where.isFree = params.free
    if (params.published !== undefined) where.isPublished = params.published
    return resourceRepo.findPaginated({ where, orderBy: { createdAt: "desc" }, page: params.page, limit: params.limit, include: { category: true } })
  }
  async getResourceById(id: number) { const r = await resourceRepo.findById(id); if (!r) throw new NotFoundError("Ressource introuvable"); return r }
  async createResource(data: Record<string, unknown>) { return resourceRepo.create(data) }
  async updateResource(id: number, data: Record<string, unknown>) { await this.getResourceById(id); return resourceRepo.update(id, data) }
  async deleteResource(id: number) { await this.getResourceById(id); return resourceRepo.softDelete(id) }
  async permanentlyDeleteResource(id: number) { await this.getResourceById(id); return resourceRepo.delete(id) }
  async toggleResourceStatus(id: number) { const r = await this.getResourceById(id); return resourceRepo.toggleStatus(id, !r.isPublished) }
  async duplicateResource(id: number) { const d = await resourceRepo.duplicate(id); if (!d) throw new NotFoundError("Ressource introuvable"); return d }

  // Certificates
  async listCertificates(params: { page?: number; limit?: number; search?: string; category?: string; published?: boolean }) {
    const where: Prisma.CertificateWhereInput = {}
    if (params.search) where.OR = [{ title: { contains: params.search, mode: "insensitive" } }, { description: { contains: params.search, mode: "insensitive" } }]
    if (params.category) where.category = { slug: params.category }
    if (params.published !== undefined) where.isPublished = params.published
    return certificateRepo.findPaginated({ where, orderBy: { createdAt: "desc" }, page: params.page, limit: params.limit, include: { category: true } })
  }
  async getCertificateById(id: number) { const c = await certificateRepo.findById(id); if (!c) throw new NotFoundError("Certificat introuvable"); return c }
  async createCertificate(data: Record<string, unknown>) { return certificateRepo.create(data) }
  async updateCertificate(id: number, data: Record<string, unknown>) { await this.getCertificateById(id); return certificateRepo.update(id, data) }
  async deleteCertificate(id: number) { await this.getCertificateById(id); return certificateRepo.softDelete(id) }
  async permanentlyDeleteCertificate(id: number) { await this.getCertificateById(id); return certificateRepo.delete(id) }
  async toggleCertificateStatus(id: number) { const c = await this.getCertificateById(id); return certificateRepo.toggleStatus(id, !c.isPublished) }
  async duplicateCertificate(id: number) { const d = await certificateRepo.duplicate(id); if (!d) throw new NotFoundError("Certificat introuvable"); return d }

  // Registrations
  async listRegistrations(params: { page?: number; limit?: number; courseId?: number; status?: string }) {
    const where: Prisma.CourseRegistrationWhereInput = {}
    if (params.courseId) where.courseId = params.courseId
    if (params.status) where.status = params.status
    return registrationRepo.findPaginated({ where, orderBy: { createdAt: "desc" }, page: params.page, limit: params.limit, include: { course: true } })
  }
  async getRegistrationById(id: number) { const r = await registrationRepo.findById(id); if (!r) throw new NotFoundError("Inscription introuvable"); return r }
  async createRegistration(data: Record<string, unknown>) { return registrationRepo.create(data) }
  async updateRegistrationStatus(id: number, status: string) { await this.getRegistrationById(id); return registrationRepo.updateStatus(id, status) }
  async deleteRegistration(id: number) { await this.getRegistrationById(id); return registrationRepo.delete(id) }
}

export const academyService = new AcademyService()
