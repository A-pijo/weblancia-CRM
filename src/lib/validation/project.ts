import { z } from "zod"

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z.string().min(1, "Slug is required").max(100).regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  client: z.string().max(200).optional(),
  clientLogo: z.string().max(500).optional(),
  clientWebsite: z.string().max(500).optional(),
  industry: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  date: z.string().optional(),
  duration: z.string().max(50).optional(),
  url: z.string().max(500).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  displayOrder: z.number().int().default(0),
  status: z.string().max(50).optional(),

  fullCaseStudy: z.string().optional(),
  challenge: z.string().optional(),
  solution: z.string().optional(),

  results: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  technologies: z.array(z.string()).optional(),
  servicesProvided: z.array(z.string()).optional(),
  teamMembers: z.array(z.object({ name: z.string(), role: z.string() })).optional(),
  clientTestimonial: z.object({ quote: z.string(), author: z.string(), role: z.string() }).optional(),

  featuredImage: z.string().max(500).optional(),
  desktopScreenshot: z.string().max(500).optional(),
  tabletScreenshot: z.string().max(500).optional(),
  mobileScreenshot: z.string().max(500).optional(),
  videoUrl: z.string().max(500).optional(),
})

export type ProjectFormData = z.infer<typeof projectSchema>
