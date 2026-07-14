import { z } from "zod"

export const blogPostSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caracteres"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caracteres").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug invalide"),
  excerpt: z.string().min(10, "L extrait doit contenir au moins 10 caracteres"),
  content: z.string().min(50, "Le contenu doit contenir au moins 50 caracteres"),
  categoryId: z.number().positive("Categorie requise"),
  author: z.string().min(2, "L auteur est requis"),
  tags: z.array(z.string()).optional().default([]),
  readingTime: z.number().optional(),
  isPublished: z.boolean().optional().default(false),
  isFeatured: z.boolean().optional().default(false),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  coverImage: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
})

export type BlogPostDTO = z.infer<typeof blogPostSchema> & { id: number; createdAt: string; updatedAt: string; category?: { id: number; slug: string; title: string } }

export const blogPostUpdateSchema = blogPostSchema.partial().extend({ _action: z.enum(["duplicate", "toggle"]).optional() })

export const blogQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  category: z.string().optional(),
  published: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
})
