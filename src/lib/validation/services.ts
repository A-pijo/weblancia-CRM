import { z } from "zod"

export const serviceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  fullDescription: z.string().optional(),
  icon: z.string().max(50).optional(),
  categoryId: z.number({ required_error: "Category is required" }),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),

  startingPrice: z.number().positive().optional().nullable(),
  currency: z.string().max(10).optional(),
  ctaText: z.string().max(100).optional(),

  deliverables: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  process: z.array(z.object({ title: z.string(), description: z.string() })).optional(),
  technologies: z.array(z.string()).optional(),
  faqs: z.array(z.object({ question: z.string(), answer: z.string() })).optional(),
  relatedServices: z.array(z.string()).optional(),

  featuredImage: z.string().max(500).optional(),
  galleryImages: z.array(z.string()).optional(),

  clientCount: z.number().int().optional().nullable(),
  projectCount: z.number().int().optional().nullable(),
  satisfactionRate: z.number().min(0).max(100).optional().nullable(),

  outcome: z.string().optional(),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
