import { leadRepository } from "@/lib/repositories/lead.repository"
import { NotFoundError } from "@/lib/errors"
import { logger } from "@/lib/logger"
import type { Prisma } from "@/generated/prisma/client"

export class LeadService {
  async list(params: { page?: number; limit?: number; search?: string; status?: string; source?: string; sort?: "asc" | "desc" }) {
    const where: Prisma.LeadWhereInput = {}
    if (params.search) where.OR = [{ name: { contains: params.search, mode: "insensitive" } }, { email: { contains: params.search, mode: "insensitive" } }, { company: { contains: params.search, mode: "insensitive" } }]
    if (params.status) where.status = params.status
    if (params.source) where.source = params.source
    return leadRepository.findPaginated({ where, orderBy: { createdAt: params.sort === "asc" ? "asc" : "desc" }, page: params.page, limit: params.limit, include: { notes: { orderBy: { createdAt: "desc" }, take: 5 }, assignedTo: { select: { id: true, name: true, email: true } } } })
  }

  async getById(id: number) { const lead = await leadRepository.findWithRelations(id); if (!lead) throw new NotFoundError("Lead introuvable"); return lead }
  async create(data: Prisma.LeadCreateInput) { return leadRepository.create(data) }
  async update(id: number, data: Prisma.LeadUpdateInput) { await this.getById(id); return leadRepository.update(id, data) }
  async delete(id: number) { await this.getById(id); return leadRepository.delete(id) }
  async updateStatus(id: number, status: string, authorId?: number) { await this.getById(id); return leadRepository.updateStatus(id, status, authorId) }
  async assign(id: number, assignedToId: number, authorId?: number) { await this.getById(id); return leadRepository.assign(id, assignedToId, authorId) }
  async addNote(leadId: number, content: string, authorId: number) { await this.getById(leadId); return leadRepository.addNote(leadId, content, authorId) }
  async deleteNote(noteId: number) { return leadRepository.deleteNote(noteId) }
  async getStats() { return leadRepository.getStats() }
  async getSources() { return leadRepository.getSources() }
  async getStatusDistribution() { return leadRepository.getStatusDistribution() }
}

export const leadService = new LeadService()
