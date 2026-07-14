import { contactSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { env, siteConfig } from "@/lib/config"
import { prisma } from "@/lib/database/prisma"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"
import { leadService } from "@/lib/repositories/services/lead.service"
import { extractLeadInfo } from "@/lib/repositories/services/lead-tracker.service"

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(contactSchema)(ctx.request)
  if (body.error) return body.error
  const { name, email, phone, subject, message } = body.data

  const contact = await prisma.contactRequest.create({ data: { name, email, phone, subject, message } })
  const info = extractLeadInfo(ctx.request)
  await leadService.create({ ...info, name, email, phone, message, source: "contact", service: subject, originalId: contact.id })

  const emailBody = [`Nouveau message de contact`, `---`, `Nom: ${name}`, `Email: ${email}`, `Téléphone: ${phone || "Non renseigné"}`, `Sujet: ${subject}`, `Message: ${message}`, `---`, `Envoyé depuis ${siteConfig.url}`].join("\n")
  await sendEmail({ to: env.NOTIFICATION_EMAIL, subject: `[Contact] ${subject} - ${name}`, body: emailBody, replyTo: email })

  return success({ message: "Message envoyé avec succès" })
}, { rateLimit: { max: 10, by: "ip" } })
