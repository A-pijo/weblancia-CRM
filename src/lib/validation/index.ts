import { z } from "zod"

export const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Nom trop long"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Veuillez sélectionner un sujet"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères").max(5000, "Message trop long"),
  consent: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter d'être contacté" }) }),
  honeypot: z.string().max(0, "Bot détecté").optional(),
})

export const startProjectSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  company: z.string().optional(),
  projectType: z.string().min(1, "Veuillez sélectionner un type de projet"),
  budget: z.string().optional(),
  timeline: z.string().min(1, "Veuillez sélectionner un délai"),
  description: z.string().min(20, "Décrivez votre projet en au moins 20 caractères").max(10000),
  source: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Vous devez accepter les conditions de confidentialité" }) }),
  honeypot: z.string().max(0).optional(),
})

export const bookCallSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").max(100),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Le téléphone doit contenir au moins 8 chiffres"),
  company: z.string().optional(),
  consultationType: z.string().min(1, "Veuillez sélectionner un type de consultation"),
  date: z.string().min(1, "Veuillez sélectionner une date"),
  time: z.string().min(1, "Veuillez sélectionner un créneau"),
  notes: z.string().max(2000).optional(),
  honeypot: z.string().max(0).optional(),
})

export const newsletterSchema = z.object({
  email: z.string().email("Email invalide"),
  honeypot: z.string().max(0).optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
export type StartProjectFormData = z.infer<typeof startProjectSchema>
export type BookCallFormData = z.infer<typeof bookCallSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>