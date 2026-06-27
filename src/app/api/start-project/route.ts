import { NextResponse } from "next/server"
import { startProjectSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { env } from "@/lib/env"
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/rate-limiter"

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

    const { name, email, phone, company, projectType, budget, timeline, description, source } = parsed.data

    await db.startProject.create({
      data: { name, email, phone, company, projectType, budget, timeline, description, source },
    })

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
      `Source: ${source || "Non renseignée"}`,
      `Description: ${description}`,
      "---",
      `Envoyé depuis weblancia.ma`,
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