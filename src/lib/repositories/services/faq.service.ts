import { faqRepository } from "@/lib/repositories/faq.repository"
import { NotFoundError } from "@/lib/errors"
import type { Prisma } from "@/generated/prisma/client"

export class FAQService {
  async list(params: { page?: number; limit?: number; search?: string }) {
    const where: Prisma.FAQWhereInput = {}
    if (params.search) where.OR = [{ question: { contains: params.search, mode: "insensitive" } }, { answer: { contains: params.search, mode: "insensitive" } }]
    return faqRepository.findPaginated({ where, orderBy: { displayOrder: "asc" }, page: params.page, limit: params.limit })
  }
  async getById(id: number) { const item = await faqRepository.findById(id); if (!item) throw new NotFoundError("FAQ introuvable"); return item }
  async create(data: Prisma.FAQCreateInput) { return faqRepository.create(data) }
  async update(id: number, data: Prisma.FAQUpdateInput) { await this.getById(id); return faqRepository.update(id, data) }
  async delete(id: number) { await this.getById(id); return faqRepository.delete(id) }
  async getActive() { return faqRepository.findActive() }
}

export const faqService = new FAQService()
