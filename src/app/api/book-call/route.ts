import { NextResponse } from "next/server"
import { bookCallSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { env } from "@/lib/env"
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/rate-limiter"
import { createLead } from "@/lib/leads/queries"
import { extractLeadInfo } from "@/lib/leads/tracker"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const { allowed, remaining } = rateLimit(`book-call:${ip}`)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Trop de requêtes. Veuillez réessayer dans quelques minutes." },
        { status: 429, headers: { "Retry-After": "300", "X-RateLimit-Remaining": "0" } },
      )
    }

    const body = await request.json()
    const parsed = bookCallSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { name, email, phone, company, consultationType, date, time, notes } = parsed.data

    const bookCall = await db.bookCall.create({
      data: { name, email, phone, company, consultationType, date, time, notes },
    })

    const info = extractLeadInfo(request)
    await createLead({ ...info, name, email, phone, company, source: "consultation", service: consultationType, message: `Date: ${date}, Time: ${time}. ${notes ?? ""}`, originalId: bookCall.id })

    const emailBody = [
      "Nouvelle demande de consultation",
      "---",
      `Nom: ${name}`,
      `Email: ${email}`,
      `Téléphone: ${phone}`,
      `Entreprise: ${company || "Non renseignée"}`,
      `Type de consultation: ${consultationType}`,
      `Date: ${date}`,
      `Créneau: ${time}`,
      `Notes: ${notes || "Aucune"}`,
      "---",
      `Envoyé depuis app.weblancia.com`,
    ].join("\n")

    await sendEmail({
      to: env.NOTIFICATION_EMAIL,
      subject: `[Consultation] ${consultationType} - ${name} - ${date}`,
      body: emailBody,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Book call API error:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}