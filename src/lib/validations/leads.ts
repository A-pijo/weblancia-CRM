import { z } from "zod"

export const leadSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  company: z.string().max(200).optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  phone: z.string().max(50).optional().nullable(),
  whatsapp: z.string().max(50).optional().nullable(),
  website: z.string().max(500).optional().nullable(),
  country: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  ipAddress: z.string().max(50).optional().nullable(),
  browser: z.string().max(200).optional().nullable(),
  device: z.string().max(100).optional().nullable(),
  preferredLanguage: z.string().max(50).optional().nullable(),
  source: z.string().min(1, "Source is required").max(100),
  service: z.string().max(200).optional().nullable(),
  message: z.string().optional().nullable(),
  budget: z.string().max(100).optional().nullable(),
  status: z.enum(["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost", "Spam"]).default("New"),
  assignedToId: z.number().int().optional().nullable(),
  originalId: z.number().int().optional().nullable(),
})

export const leadNoteSchema = z.object({
  content: z.string().min(1, "Note content is required"),
})

export const leadStatusSchema = z.object({
  status: z.enum(["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost", "Spam"]),
})

export const LEAD_STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Won", "Lost", "Spam"] as const

export type LeadFormData = z.infer<typeof leadSchema>
export type LeadNoteFormData = z.infer<typeof leadNoteSchema>
