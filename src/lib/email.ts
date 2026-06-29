import { env } from "./env"

interface SendEmailParams {
  to: string
  subject: string
  body: string
  replyTo?: string
}

export async function sendEmail({ to, subject, body, replyTo }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  if (!env.SMTP_HOST || env.SMTP_HOST === "smtp.example.com") {
    console.log("--- EMAIL LOG (SMTP not configured) ---")
    console.log("To:", to)
    console.log("Subject:", subject)
    console.log("Reply-To:", replyTo ?? "none")
    console.log("Body:", body)
    console.log("--- END EMAIL ---")
    console.log("ℹ️  Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env.local for real delivery.")
    return { success: true }
  }

  try {
    const nodemailer = await import("nodemailer")
    const transporter = nodemailer.default.createTransport({
      host: env.SMTP_HOST,
      port: Number.parseInt(env.SMTP_PORT, 10),
      secure: env.SMTP_PORT === "465",
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
    })

    await transporter.verify()
    console.log(`[Email] SMTP connection verified for ${env.SMTP_HOST}`)

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to,
      replyTo: replyTo ?? env.SMTP_FROM,
      subject,
      text: body,
      html: body.replace(/\n/g, "<br>"),
    })

    console.log(`[Email] Sent to ${to} — subject: "${subject}"`)
    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[Email] Send failed:", message)
    if (error instanceof Error && error.stack) {
      console.error("[Email] Stack:", error.stack)
    }
    return { success: false, error: message }
  }
}
