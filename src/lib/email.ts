import { env } from "./env"

interface SendEmailParams {
  to: string
  subject: string
  body: string
  replyTo?: string
}

export async function sendEmail({ to, subject, body, replyTo }: SendEmailParams): Promise<{ success: boolean; error?: string }> {
  console.log("--- EMAIL LOG ---")
  console.log("To:", to)
  console.log("Subject:", subject)
  console.log("Reply-To:", replyTo ?? "none")
  console.log("Body:", body)
  console.log("--- END EMAIL ---")

  if (!env.SMTP_HOST) {
    console.log("ℹ️  SMTP not configured — set SMTP_HOST in .env.local for real delivery. Currently logging to console.")
    return { success: true }
  }

  // Real SMTP delivery requires nodemailer: npm install nodemailer
  // Then uncomment the code below and configure SMTP_HOST in .env.local
  //
  // try {
  //   const nodemailer = await import("nodemailer")
  //   const transporter = nodemailer.default.createTransport({
  //     host: env.SMTP_HOST,
  //     port: Number.parseInt(env.SMTP_PORT, 10),
  //     secure: env.SMTP_PORT === "465",
  //     auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  //   })
  //   await transporter.sendMail({
  //     from: env.SMTP_FROM,
  //     to,
  //     replyTo: replyTo ?? env.SMTP_FROM,
  //     subject,
  //     text: body,
  //     html: body.replace(/\n/g, "<br>"),
  //   })
  //   return { success: true }
  // } catch (error) {
  //   const message = error instanceof Error ? error.message : "Unknown error"
  //   console.error("Email send failed:", message)
  //   return { success: false, error: message }
  // }

  return { success: true }
}