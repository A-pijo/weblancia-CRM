import { blogRepository } from "@/lib/repositories/blog.repository"
import { NotFoundError } from "@/lib/errors"
import { logger } from "@/lib/logger"
import type { Prisma } from "@/generated/prisma/client"

export class BlogService {
  async list(params: {
    page?: number; limit?: number; search?: string; category?: string; published?: boolean; featured?: boolean; sort?: "asc" | "desc"
  }) {
    const where: Prisma.BlogPostWhereInput = {}
    const orderBy: Prisma.BlogPostOrderByWithRelationInput = { createdAt: params.sort === "asc" ? "asc" : "desc" }

    if (params.search) where.OR = [{ title: { contains: params.search, mode: "insensitive" } }, { excerpt: { contains: params.search, mode: "insensitive" } }]
    if (params.category) where.category = { slug: params.category }
    if (params.published !== undefined) where.isPublished = params.published
    if (params.featured !== undefined) where.isFeatured = params.featured

    return blogRepository.findPaginated({ where, orderBy, page: params.page, limit: params.limit, include: { category: true } })
  }

  async getById(id: number) {
    const post = await blogRepository.findById(id)
    if (!post) throw new NotFoundError("Article introuvable")
    return post
  }

  async getBySlug(slug: string) {
    const post = await blogRepository.findBySlug(slug)
    if (!post) throw new NotFoundError("Article introuvable")
    return post
  }

  async create(data: { title: string; slug?: string; categoryId?: number } & Record<string, unknown>) {
    const slug = data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    const { categoryId, ...rest } = data
    const category = categoryId ? { connect: { id: categoryId } } : undefined
    return blogRepository.create({ ...rest, slug, category })
  }

  async update(id: number, data: Prisma.BlogPostUpdateInput) {
    await this.getById(id)
    return blogRepository.update(id, data)
  }

  async delete(id: number) { await this.getById(id); return blogRepository.softDelete(id) }

  async permanentlyDelete(id: number) { await this.getById(id); return blogRepository.delete(id) }

  async duplicate(id: number) {
    const dup = await blogRepository.duplicate(id)
    if (!dup) throw new NotFoundError("Article introuvable")
    logger.audit(`Blog post duplicated`, { originalId: id, newId: dup.id }, "blog")
    return dup
  }

  async toggleStatus(id: number) {
    const post = await this.getById(id)
    return blogRepository.toggleStatus(id, !post.isPublished)
  }

  async getPublished(limit = 10) { return blogRepository.findPublished(limit) }
  async getFeatured(limit = 10) { return blogRepository.findFeatured(limit) }
  async getRelated(postId: number, categoryId: number, limit = 3) { return blogRepository.findRelated(postId, categoryId, limit) }
}

export const blogService = new BlogService()
