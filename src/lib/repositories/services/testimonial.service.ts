import { testimonialRepository } from "@/lib/repositories/testimonial.repository"
import { NotFoundError } from "@/lib/errors"
import type { Prisma } from "@/generated/prisma/client"

export class TestimonialService {
  async list(params: { page?: number; limit?: number; search?: string }) {
    const where: Prisma.TestimonialWhereInput = {}
    if (params.search) where.OR = [{ name: { contains: params.search, mode: "insensitive" } }, { content: { contains: params.search, mode: "insensitive" } }]
    return testimonialRepository.findPaginated({ where, orderBy: { displayOrder: "asc" }, page: params.page, limit: params.limit })
  }
  async getById(id: number) { const item = await testimonialRepository.findById(id); if (!item) throw new NotFoundError("Temoignage introuvable"); return item }
  async create(data: Prisma.TestimonialCreateInput) { return testimonialRepository.create(data) }
  async update(id: number, data: Prisma.TestimonialUpdateInput) { await this.getById(id); return testimonialRepository.update(id, data) }
  async delete(id: number) { await this.getById(id); return testimonialRepository.delete(id) }
  async toggleStatus(id: number) { const item = await this.getById(id); return testimonialRepository.toggleStatus(id, !item.isActive) }
}

export const testimonialService = new TestimonialService()
