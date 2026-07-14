import { serviceRepository } from "@/lib/repositories/service.repository"
import { NotFoundError } from "@/lib/errors"
import { logger } from "@/lib/logger"
import type { Prisma } from "@/generated/prisma/client"

interface BaseServiceDTO {
  title?: string
  slug?: string
  description?: string
  fullDescription?: string
  icon?: string
  categoryId?: number
  isFeatured?: boolean
  isActive?: boolean
  displayOrder?: number
  startingPrice?: number | null
  currency?: string
  ctaText?: string
  deliverables?: string[]
  benefits?: string[]
  process?: { title: string; description: string }[]
  technologies?: string[]
  faqs?: { question: string; answer: string }[]
  relatedServices?: string[]
  featuredImage?: string
  galleryImages?: string[]
  clientCount?: number | null
  projectCount?: number | null
  satisfactionRate?: number | null
  outcome?: string
}

export interface CreateServiceDTO extends BaseServiceDTO {
  title: string
  slug: string
  categoryId: number
}

export interface UpdateServiceDTO extends BaseServiceDTO {
  _action?: "duplicate" | "toggle"
}

function toPrismaCreate(dto: CreateServiceDTO): Prisma.ServiceCreateInput {
  const { categoryId, ...rest } = dto
  return { ...rest, category: { connect: { id: categoryId } } } as Prisma.ServiceCreateInput
}

function toPrismaUpdate(dto: UpdateServiceDTO): Prisma.ServiceUpdateInput {
  const { _action: _a, categoryId, ...rest } = dto
  const data: Prisma.ServiceUpdateInput = { ...rest }
  if (categoryId !== undefined) data.category = { connect: { id: categoryId } }
  return data
}

export class ServiceService {
  async list(params: { page?: number; limit?: number; search?: string; category?: string }) {
    const where: Prisma.ServiceWhereInput = {}
    if (params.search) where.OR = [{ title: { contains: params.search, mode: "insensitive" } }, { description: { contains: params.search, mode: "insensitive" } }]
    if (params.category) where.category = { slug: params.category }
    return serviceRepository.findPaginated({ where, orderBy: { categoryId: "asc" }, page: params.page, limit: params.limit, include: { category: true } })
  }

  async getById(id: number) { const item = await serviceRepository.findById(id); if (!item) throw new NotFoundError("Service introuvable"); return item }
  async getBySlug(slug: string) { const item = await serviceRepository.findBySlug(slug); if (!item) throw new NotFoundError("Service introuvable"); return item }
  async create(data: CreateServiceDTO) { return serviceRepository.create(toPrismaCreate(data)) }
  async update(id: number, data: UpdateServiceDTO) { await this.getById(id); return serviceRepository.update(id, toPrismaUpdate(data)) }
  async delete(id: number) { await this.getById(id); return serviceRepository.softDelete(id) }
  async permanentlyDelete(id: number) { await this.getById(id); return serviceRepository.delete(id) }
  async duplicate(id: number) { const dup = await serviceRepository.duplicate(id); if (!dup) throw new NotFoundError("Service introuvable"); logger.audit("Service duplicated", { originalId: id, newId: dup.id }, "services"); return dup }
  async toggleStatus(id: number) { const item = await this.getById(id); return serviceRepository.toggleStatus(id, !item.isActive) }
}

export const serviceService = new ServiceService()
