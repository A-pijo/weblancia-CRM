import { teamMemberRepository } from "@/lib/repositories/team.repository"
import { NotFoundError } from "@/lib/errors"
import type { Prisma } from "@/generated/prisma/client"

export class TeamMemberService {
  async list(params: { page?: number; limit?: number; search?: string }) {
    const where: Prisma.TeamMemberWhereInput = {}
    if (params.search) where.OR = [{ name: { contains: params.search, mode: "insensitive" } }, { role: { contains: params.search, mode: "insensitive" } }]
    return teamMemberRepository.findPaginated({ where, orderBy: { displayOrder: "asc" }, page: params.page, limit: params.limit })
  }
  async getById(id: number) { const item = await teamMemberRepository.findById(id); if (!item) throw new NotFoundError("Membre introuvable"); return item }
  async create(data: Prisma.TeamMemberCreateInput) { return teamMemberRepository.create(data) }
  async update(id: number, data: Prisma.TeamMemberUpdateInput) { await this.getById(id); return teamMemberRepository.update(id, data) }
  async delete(id: number) { await this.getById(id); return teamMemberRepository.delete(id) }
  async getActive() { return teamMemberRepository.findActive() }
}

export const teamMemberService = new TeamMemberService()
