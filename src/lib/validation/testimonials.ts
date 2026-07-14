import { z } from "zod"

export const testimonialSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  role: z.string().max(100).optional().nullable(),
  company: z.string().max(200).optional().nullable(),
  content: z.string().min(1, "Content is required"),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  avatar: z.string().max(500).optional().nullable(),
  displayOrder: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export type TestimonialFormData = z.infer<typeof testimonialSchema>
