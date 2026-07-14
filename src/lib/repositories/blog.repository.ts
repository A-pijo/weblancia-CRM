import { BaseRepository } from "@/lib/repositories/base.repository"
import { prisma } from "@/lib/database/prisma"
import type { Prisma } from "@/generated/prisma/client"

type BlogDelegate = typeof prisma.blogPost

export class BlogRepository extends BaseRepository<BlogDelegate> {
  constructor() {
    super(prisma.blogPost, "blogPost")
  }

  async findBySlug(slug: string) {
    return this.model.findUnique({ where: { slug }, include: { category: true } })
  }

  async findPublished(limit = 10) {
    return this.model.findMany({ where: { isPublished: true }, include: { category: true }, orderBy: { publishedAt: "desc" }, take: limit })
  }

  async findFeatured(limit = 10) {
    return this.model.findMany({ where: { isPublished: true, isFeatured: true }, include: { category: true }, orderBy: { publishedAt: "desc" }, take: limit })
  }

  async findRelated(postId: number, categoryId: number, limit = 3) {
    return this.model.findMany({ where: { isPublished: true, categoryId, id: { not: postId } }, include: { category: true }, orderBy: { publishedAt: "desc" }, take: limit })
  }

  async findByCategorySlug(slug: string) {
    return prisma.blogCategory.findUnique({ where: { slug } })
  }

  async toggleStatus(id: number, isPublished: boolean) {
    return this.model.update({ where: { id }, data: { isPublished, publishedAt: isPublished ? new Date() : undefined } })
  }

  async softDelete(id: number) {
    return this.model.update({ where: { id }, data: { isPublished: false } })
  }

  async duplicate(id: number) {
    const original = await this.model.findUnique({ where: { id } })
    if (!original) return null
    const { id: _id, createdAt: _c, updatedAt: _u, publishedAt: _p, ...data } = original
    return this.model.create({ data: { ...data, title: `${data.title} (copie)`, slug: `${data.slug}-copy-${Date.now()}`, isPublished: false } as any })
  }
}

export const blogRepository = new BlogRepository()
