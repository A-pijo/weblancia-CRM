import { bookCallSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { env, siteConfig } from "@/lib/config"
import { prisma } from "@/lib/database/prisma"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"
import { leadService } from "@/lib/repositories/services/lead.service"
import { extractLeadInfo } from "@/lib/repositories/services/lead-tracker.service"

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(bookCallSchema)(ctx.request)
  if (body.error) return body.error
  const { name, email, phone, company, consultationType, date, time, notes } = body.data

  const bookCall = await prisma.bookCall.create({ data: { name, email, phone, company, consultationType, date, time, notes } })
  const info = extractLeadInfo(ctx.request)
  await leadService.create({ ...info, name, email, phone, company, source: "consultation", service: consultationType, message: `Date: ${date}, Time: ${time}. ${notes ?? ""}`, originalId: bookCall.id })

  const emailBody = [`Nouvelle demande de consultation`, `---`, `Nom: ${name}`, `Email: ${email}`, `Téléphone: ${phone}`, `Entreprise: ${company || "Non renseignée"}`, `Type de consultation: ${consultationType}`, `Date: ${date}`, `Créneau: ${time}`, `Notes: ${notes || "Aucune"}`, `---`, `Envoyé depuis ${siteConfig.url}`].join("\n")
  await sendEmail({ to: env.NOTIFICATION_EMAIL, subject: `[Consultation] ${consultationType} - ${name} - ${date}`, body: emailBody, replyTo: email })

  return success({ message: "Demande de consultation envoyée avec succès" })
}, { rateLimit: { max: 10, by: "ip" } })
