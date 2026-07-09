import { z } from "zod"

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  SITE_URL: z.string().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().optional(),
  DATABASE_URL: z.string().min(20, "DATABASE_URL is required"),
  DIRECT_URL: z.string().optional(),
  JWT_SECRET: z.string().min(64, "JWT_SECRET must be at least 64 characters"),
  CRON_SECRET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional().default("hello@weblancia.ma"),
  NOTIFICATION_EMAIL: z.string().optional().default("hello@weblancia.ma"),
  WHATSAPP_NUMBER: z.string().optional(),
  WHATSAPP_ENABLED: z.coerce.boolean().optional().default(false),
  GA_MEASUREMENT_ID: z.string().optional(),
  GSC_VERIFICATION: z.string().optional(),
  CLARITY_ID: z.string().optional(),
  AI_PROVIDER: z.enum(["gemini", "openai"]).optional().default("gemini"),
  AI_LANGUAGE: z.string().optional().default("fr"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env)
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
    console.error(`FATAL: Invalid environment variables:\n${errors.join("\n")}`)
    process.exit(1)
  }
  return result.data
}

export const env: Env = loadEnv()

export function validateEnv(): { errors: string[]; warnings: string[] } {
  const errors: string[] = []
  const warnings: string[] = []

  if (!env.JWT_SECRET || env.JWT_SECRET.length < 64) {
    errors.push("JWT_SECRET must be at least 64 characters")
  }
  if (!env.DATABASE_URL) {
    errors.push("DATABASE_URL is required")
  }
  if (process.env.NODE_ENV === "production") {
    if (!env.SITE_URL || env.SITE_URL === "http://localhost:3000") {
      warnings.push("SITE_URL should be set to the production URL")
    }
  }

  return { errors, warnings }
}
