import { BaseRepository } from "./base.repository"
import { prisma } from "@/lib/database/prisma"

type Delegate = typeof prisma.service

export class ServiceRepository extends BaseRepository<Delegate> {
  constructor() { super(prisma.service, "service") }
  async findBySlug(slug: string) { return this.model.findUnique({ where: { slug }, include: { category: true } }) }
  async findActive() { return this.model.findMany({ where: { isActive: true }, include: { category: true }, orderBy: { categoryId: "asc" } }) }
  async toggleStatus(id: number, isActive: boolean) { return this.model.update({ where: { id }, data: { isActive } }) }
  async softDelete(id: number) { return this.model.update({ where: { id }, data: { isActive: false } }) }
  async duplicate(id: number) {
    const original = await this.model.findUnique({ where: { id } })
    if (!original) return null
    const { id: _id, createdAt: _c, updatedAt: _u, ...data } = original
    return this.model.create({ data: { ...data, title: `${data.title} (copie)`, slug: `${data.slug}-copy-${Date.now()}`, isActive: false } as any })
  }
}

export const serviceRepository = new ServiceRepository()
