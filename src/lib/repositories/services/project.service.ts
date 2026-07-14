import { projectRepository } from "@/lib/repositories/project.repository"
import { NotFoundError } from "@/lib/errors"
import type { Prisma } from "@/generated/prisma/client"

export class ProjectService {
  async list(params: { page?: number; limit?: number; search?: string; industry?: string; featured?: boolean }) {
    const where: Prisma.ProjectWhereInput = {}
    if (params.search) where.OR = [{ title: { contains: params.search, mode: "insensitive" } }, { description: { contains: params.search, mode: "insensitive" } }]
    if (params.industry) where.industry = params.industry
    if (params.featured) where.isFeatured = true
    where.isActive = true
    return projectRepository.findPaginated({ where, orderBy: { displayOrder: "asc" }, page: params.page, limit: params.limit })
  }

  async getById(id: number) { const item = await projectRepository.findById(id); if (!item) throw new NotFoundError("Projet introuvable"); return item }
  async getBySlug(slug: string) { const item = await projectRepository.findBySlug(slug); if (!item) throw new NotFoundError("Projet introuvable"); return item }
  async create(data: Prisma.ProjectCreateInput) { return projectRepository.create(data) }
  async update(id: number, data: Prisma.ProjectUpdateInput) { await this.getById(id); return projectRepository.update(id, data) }
  async delete(id: number) { await this.getById(id); return projectRepository.softDelete(id) }
  async permanentlyDelete(id: number) { await this.getById(id); return projectRepository.delete(id) }
  async duplicate(id: number) { const dup = await projectRepository.duplicate(id); if (!dup) throw new NotFoundError("Projet introuvable"); return dup }
  async toggleStatus(id: number) { const item = await this.getById(id); return projectRepository.toggleStatus(id, !item.isActive) }
  async getAdjacent(currentId: number) { return projectRepository.findAdjacent(currentId) }
  async getIndustries() { return projectRepository.getIndustries() }
}

export const projectService = new ProjectService()
