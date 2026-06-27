import { db } from "@/lib/db"

export type BlogPostWithCategory = Awaited<ReturnType<typeof getBlogPostById>>

export async function getBlogPosts(params: {
  search?: string
  categoryId?: number
  isPublished?: boolean
  isFeatured?: boolean
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const { search, categoryId, isPublished, isFeatured, sort = "publishedAt", order = "desc", page = 1, limit = 20 } = params

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { author: { contains: search } },
    ]
  }
  if (categoryId !== undefined) where.categoryId = categoryId
  if (isPublished !== undefined) where.isPublished = isPublished
  if (isFeatured !== undefined) where.isFeatured = isFeatured

  const skip = (page - 1) * limit
  const orderBy = sort === "publishedAt" ? { publishedAt: order } : { [sort]: order }

  const [items, total] = await Promise.all([
    db.blogPost.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: { category: true },
    }),
    db.blogPost.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getBlogPostBySlug(slug: string) {
  return db.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  })
}

export async function getBlogPostById(id: number) {
  return db.blogPost.findUnique({
    where: { id },
    include: { category: true },
  })
}

export async function getPublishedPosts(limit = 10) {
  return db.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getFeaturedPosts(limit = 3) {
  return db.blogPost.findMany({
    where: { isPublished: true, isFeatured: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getRelatedPosts(currentId: number, categoryId: number, limit = 3) {
  return db.blogPost.findMany({
    where: { id: { not: currentId }, isPublished: true, categoryId },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { category: true },
  })
}

export async function getBlogCategories() {
  return db.blogCategory.findMany({ orderBy: { title: "asc" } })
}

export async function getBlogCategoryBySlug(slug: string) {
  return db.blogCategory.findUnique({ where: { slug } })
}

export async function createBlogPost(data: Record<string, unknown>) {
  return db.blogPost.create({
    data: {
      title: data.title as string,
      slug: data.slug as string,
      excerpt: (data.excerpt as string) ?? null,
      content: (data.content as string) ?? null,
      categoryId: data.categoryId as number,
      author: (data.author as string) ?? null,
      publishedAt: data.publishedAt ? new Date(data.publishedAt as string) : null,
      isPublished: (data.isPublished as boolean) ?? false,
      isFeatured: (data.isFeatured as boolean) ?? false,
      readingTime: (data.readingTime as number) ?? null,
      tags: (data.tags ?? null) as any,
      featuredImage: (data.featuredImage as string) ?? null,
      focusKeyword: (data.focusKeyword as string) ?? null,
      canonicalUrl: (data.canonicalUrl as string) ?? null,
      robots: (data.robots as string) ?? null,
      ogTitle: (data.ogTitle as string) ?? null,
      ogDescription: (data.ogDescription as string) ?? null,
      ogImage: (data.ogImage as string) ?? null,
      twitterCard: (data.twitterCard as string) ?? null,
    },
  })
}

export async function updateBlogPost(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = [
    "title", "slug", "excerpt", "content", "categoryId", "author",
    "publishedAt", "isPublished", "isFeatured", "readingTime",
    "tags", "featuredImage",
    "focusKeyword", "canonicalUrl", "robots",
    "ogTitle", "ogDescription", "ogImage", "twitterCard",
  ]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  if (updateData.publishedAt) {
    updateData.publishedAt = new Date(updateData.publishedAt as string)
  }
  return db.blogPost.update({ where: { id }, data: updateData })
}

export async function duplicateBlogPost(id: number) {
  const original = await db.blogPost.findUnique({ where: { id } })
  if (!original) throw new Error("Blog post not found")

  return db.blogPost.create({
    data: {
      title: `${original.title} (copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      excerpt: original.excerpt,
      content: original.content,
      categoryId: original.categoryId,
      author: original.author,
      publishedAt: null,
      isPublished: false,
      isFeatured: false,
      readingTime: original.readingTime,
      tags: original.tags as any,
      featuredImage: original.featuredImage,
      focusKeyword: original.focusKeyword,
      canonicalUrl: original.canonicalUrl,
      robots: original.robots,
      ogTitle: original.ogTitle,
      ogDescription: original.ogDescription,
      ogImage: original.ogImage,
      twitterCard: original.twitterCard,
    },
  })
}

export async function softDeleteBlogPost(id: number) {
  return db.blogPost.update({ where: { id }, data: { isPublished: false } })
}

export async function permanentlyDeleteBlogPost(id: number) {
  return db.blogPost.delete({ where: { id } })
}

export async function toggleBlogPostStatus(id: number, isPublished: boolean) {
  return db.blogPost.update({
    where: { id },
    data: { isPublished, publishedAt: isPublished ? new Date() : null },
  })
}

export async function bulkUpdateBlogPosts(ids: number[], data: Record<string, unknown>) {
  return db.blogPost.updateMany({ where: { id: { in: ids } }, data })
}
