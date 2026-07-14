import { z } from "zod"

export const academyCategorySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  icon: z.string().max(50).optional(),
  displayOrder: z.number().int().default(0),
})

export type AcademyCategoryFormData = z.infer<typeof academyCategorySchema>

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  instructor: z.string().max(100).optional(),
  academyCategoryId: z.number().int().optional().nullable(),
  level: z.string().max(50).optional(),
  duration: z.string().max(50).optional(),
  language: z.string().max(50).optional(),
  price: z.number().optional().nullable(),
  discountPrice: z.number().optional().nullable(),
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
  thumbnail: z.string().max(500).optional(),
  gallery: z.array(z.string()).optional(),
  curriculum: z.array(z.object({
    title: z.string(),
    items: z.array(z.string()),
  })).optional(),
  requirements: z.array(z.string()).optional(),
  learningOutcomes: z.array(z.string()).optional(),
  certificateIncluded: z.boolean().default(false),
  downloadableResources: z.array(z.string()).optional(),
  faqs: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional(),
  focusKeyword: z.string().max(200).optional(),
  canonicalUrl: z.string().max(500).optional(),
  robots: z.string().max(100).optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().max(500).optional(),
  twitterCard: z.string().max(100).optional(),
})

export type CourseFormData = z.infer<typeof courseSchema>

export const workshopSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  instructor: z.string().max(100).optional(),
  academyCategoryId: z.number().int().optional().nullable(),
  date: z.string().optional(),
  time: z.string().max(20).optional(),
  duration: z.string().max(50).optional(),
  seats: z.number().int().optional().nullable(),
  location: z.string().max(200).optional(),
  type: z.string().max(50).optional(),
  price: z.number().optional().nullable(),
  registrationDeadline: z.string().optional(),
  status: z.string().max(50).optional(),
  isPublished: z.boolean().default(false),
  focusKeyword: z.string().max(200).optional(),
  canonicalUrl: z.string().max(500).optional(),
  robots: z.string().max(100).optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().max(500).optional(),
  twitterCard: z.string().max(100).optional(),
})

export type WorkshopFormData = z.infer<typeof workshopSchema>

export const resourceSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  academyCategoryId: z.number().int().optional().nullable(),
  type: z.string().max(50).optional(),
  file: z.string().max(500).optional(),
  thumbnail: z.string().max(500).optional(),
  image: z.string().max(500).optional(),
  isFree: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  focusKeyword: z.string().max(200).optional(),
  canonicalUrl: z.string().max(500).optional(),
  robots: z.string().max(100).optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().max(500).optional(),
  twitterCard: z.string().max(100).optional(),
})

export type ResourceFormData = z.infer<typeof resourceSchema>

export const certificateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  requirements: z.array(z.string()).optional(),
  badge: z.string().max(500).optional(),
  duration: z.string().max(50).optional(),
  level: z.string().max(50).optional(),
  academyCategoryId: z.number().int().optional().nullable(),
  isPublished: z.boolean().default(false),
  focusKeyword: z.string().max(200).optional(),
  canonicalUrl: z.string().max(500).optional(),
  robots: z.string().max(100).optional(),
  ogTitle: z.string().max(200).optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().max(500).optional(),
  twitterCard: z.string().max(100).optional(),
})

export type CertificateFormData = z.infer<typeof certificateSchema>
