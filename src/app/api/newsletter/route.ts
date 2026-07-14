import { newsletterSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { env } from "@/lib/config"
import { prisma } from "@/lib/database/prisma"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"
import { leadService } from "@/lib/repositories/services/lead.service"
import { extractLeadInfo } from "@/lib/repositories/services/lead-tracker.service"

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(newsletterSchema)(ctx.request)
  if (body.error) return body.error
  const { email } = body.data

  await prisma.newsletterSubscriber.upsert({ where: { email }, update: { isActive: true }, create: { email } })
  const info = extractLeadInfo(ctx.request)
  await leadService.create({ ...info, name: email.split("@")[0], email, source: "newsletter", message: "Newsletter subscription" })
  await sendEmail({ to: env.NOTIFICATION_EMAIL, subject: `[Newsletter] Nouvel abonné - ${email}`, body: `Nouvel abonné à la newsletter : ${email}`, replyTo: email })

  return success({ message: "Inscription à la newsletter réussie" })
}, { rateLimit: { max: 10, by: "ip" } })
