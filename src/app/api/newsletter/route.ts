import { NextResponse } from "next/server"
import { newsletterSchema } from "@/lib/validation"
import { sendEmail } from "@/lib/email"
import { env } from "@/lib/env"
import { db } from "@/lib/db"
import { rateLimit, getClientIp } from "@/lib/rate-limiter"

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const { allowed, remaining } = rateLimit(`newsletter:${ip}`)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Trop de requêtes. Veuillez réessayer dans quelques minutes." },
        { status: 429, headers: { "Retry-After": "300", "X-RateLimit-Remaining": "0" } },
      )
    }

    const body = await request.json()
    const parsed = newsletterSchema.safeParse(body)

    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors
      return NextResponse.json({ success: false, errors }, { status: 400 })
    }

    const { email } = parsed.data

    await db.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true },
      create: { email },
    })

    await sendEmail({
      to: env.NOTIFICATION_EMAIL,
      subject: `[Newsletter] Nouvel abonné - ${email}`,
      body: `Nouvel abonné à la newsletter : ${email}`,
      replyTo: email,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Newsletter API error:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}