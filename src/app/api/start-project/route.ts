import { NextResponse } from "next/server"
import { startProjectSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { env } from "@/lib/env"
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/rate-limiter"
import { createLead } from "@/lib/leads/queries"
import { extractLeadInfo } from "@/lib/leads/tracker"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const { allowed, remaining } = rateLimit(`start-project:${ip}`)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Trop de requêtes. Veuillez réessayer dans quelques minutes." },
        { status: 429, headers: { "Retry-After": "300", "X-RateLimit-Remaining": "0" } },
      )
    }

    const body = await request.json()
    const parsed = startProjectSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { name, email, phone, company, projectType, budget, timeline, description, source: formSource } = parsed.data

    const project = await db.startProject.create({
      data: { name, email, phone, company, projectType, budget, timeline, description, source: formSource },
    })

    const info = extractLeadInfo(request)
    await createLead({ ...info, name, email, phone, company, source: formSource ?? "quote", service: projectType, message: description, budget, originalId: project.id })

    const emailBody = [
      "Nouveau projet reçu",
      "---",
      `Nom: ${name}`,
      `Email: ${email}`,
      `Téléphone: ${phone || "Non renseigné"}`,
      `Entreprise: ${company || "Non renseignée"}`,
      `Type de projet: ${projectType}`,
      `Budget: ${budget}`,
      `Délai: ${timeline}`,
      `Source: ${formSource || "Non renseignée"}`,
      `Description: ${description}`,
      "---",
      `Envoyé depuis app.weblancia.com`,
    ].join("\n")

    await sendEmail({
      to: env.NOTIFICATION_EMAIL,
      subject: `[Nouveau Projet] ${projectType} - ${name}`,
      body: emailBody,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Start project API error:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}