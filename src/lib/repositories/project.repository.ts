import { BaseRepository } from "./base.repository"
import { prisma } from "@/lib/database/prisma"

type Delegate = typeof prisma.project

export class ProjectRepository extends BaseRepository<Delegate> {
  constructor() { super(prisma.project, "project") }
  async findBySlug(slug: string) { return this.model.findUnique({ where: { slug } }) }
  async findFeatured(limit = 10) { return this.model.findMany({ where: { isActive: true, isFeatured: true }, orderBy: { displayOrder: "asc" }, take: limit }) }
  async findActive() { return this.model.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }) }
  async findAdjacent(currentId: number) {
    const current = await this.model.findUnique({ where: { id: currentId } })
    if (!current) return { prev: null, next: null }
    const [prev, next] = await Promise.all([
      this.model.findFirst({ where: { displayOrder: { lt: current.displayOrder }, isActive: true }, orderBy: { displayOrder: "desc" } }),
      this.model.findFirst({ where: { displayOrder: { gt: current.displayOrder }, isActive: true }, orderBy: { displayOrder: "asc" } }),
    ])
    return { prev, next }
  }
  async toggleStatus(id: number, isActive: boolean) { return this.model.update({ where: { id }, data: { isActive } }) }
  async softDelete(id: number) { return this.model.update({ where: { id }, data: { isActive: false } }) }
  async duplicate(id: number) {
    const original = await this.model.findUnique({ where: { id } })
    if (!original) return null
    const { id: _id, createdAt: _c, updatedAt: _u, ...data } = original
    return this.model.create({ data: { ...data, slug: `${data.slug}-copy-${Date.now()}`, isActive: false } as any })
  }
  async getIndustries() { return this.model.findMany({ where: { isActive: true }, select: { industry: true }, distinct: ["industry"] }) }
}

export const projectRepository = new ProjectRepository()
