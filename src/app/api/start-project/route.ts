import { startProjectSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { env, siteConfig } from "@/lib/config"
import { prisma } from "@/lib/database/prisma"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"
import { leadService } from "@/lib/repositories/services/lead.service"
import { extractLeadInfo } from "@/lib/repositories/services/lead-tracker.service"

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(startProjectSchema)(ctx.request)
  if (body.error) return body.error
  const { name, email, phone, company, projectType, budget, timeline, description, source: formSource } = body.data

  const project = await prisma.startProject.create({ data: { name, email, phone, company, projectType, budget, timeline, description, source: formSource } })
  const info = extractLeadInfo(ctx.request)
  await leadService.create({ ...info, name, email, phone, company, source: formSource ?? "quote", service: projectType, message: description, budget, originalId: project.id })

  const emailBody = [`Nouveau projet reçu`, `---`, `Nom: ${name}`, `Email: ${email}`, `Téléphone: ${phone || "Non renseigné"}`, `Entreprise: ${company || "Non renseignée"}`, `Type de projet: ${projectType}`, `Budget: ${budget}`, `Délai: ${timeline}`, `Source: ${formSource || "Non renseignée"}`, `Description: ${description}`, `---`, `Envoyé depuis ${siteConfig.url}`].join("\n")
  await sendEmail({ to: env.NOTIFICATION_EMAIL, subject: `[Nouveau Projet] ${projectType} - ${name}`, body: emailBody, replyTo: email })

  return success({ message: "Projet soumis avec succès" })
}, { rateLimit: { max: 10, by: "ip" } })
