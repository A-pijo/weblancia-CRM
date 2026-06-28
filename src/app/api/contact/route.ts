import { NextResponse } from "next/server"
import { contactSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { env } from "@/lib/env"
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/rate-limiter"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const { allowed, remaining } = rateLimit(`contact:${ip}`)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Trop de requêtes. Veuillez réessayer dans quelques minutes." },
        { status: 429, headers: { "Retry-After": "300", "X-RateLimit-Remaining": "0" } },
      )
    }

    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { name, email, phone, subject, message } = parsed.data

    await db.contactRequest.create({
      data: { name, email, phone, subject, message },
    })

    const emailBody = [
      "Nouveau message de contact",
      "---",
      `Nom: ${name}`,
      `Email: ${email}`,
      `Téléphone: ${phone || "Non renseigné"}`,
      `Sujet: ${subject}`,
      `Message: ${message}`,
      "---",
      `Envoyé depuis app.weblancia.com`,
    ].join("\n")

    await sendEmail({
      to: env.NOTIFICATION_EMAIL,
      subject: `[Contact] ${subject} - ${name}`,
      body: emailBody,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact API error:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}