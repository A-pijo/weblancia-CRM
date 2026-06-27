import { z } from "zod"

export const blogSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  categoryId: z.number({ required_error: "Category is required" }),
  author: z.string().max(100).optional(),
  publishedAt: z.string().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  readingTime: z.number().int().optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().max(500).optional(),

  focusKeyword: z.string().max(200).optional(),
  canonicalUrl: z.string().max(500).optional(),
  robots: z.string().max(100).optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().max(500).optional(),
  twitterCard: z.string().max(100).optional(),
})

export type BlogFormData = z.infer<typeof blogSchema>

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}
