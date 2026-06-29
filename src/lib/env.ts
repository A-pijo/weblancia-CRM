function getEnv(key: string, fallback = ""): string {
  return (typeof process !== "undefined" ? process.env[key] : undefined) ?? fallback
}

export const env = {
  SMTP_HOST: getEnv("SMTP_HOST"),
  SMTP_PORT: getEnv("SMTP_PORT", "587"),
  SMTP_USER: getEnv("SMTP_USER"),
  SMTP_PASS: getEnv("SMTP_PASS"),
  SMTP_FROM: getEnv("SMTP_FROM", "hello@weblancia.ma"),
  NOTIFICATION_EMAIL: getEnv("NOTIFICATION_EMAIL", "hello@weblancia.ma"),
  WHATSAPP_NUMBER: getEnv("WHATSAPP_NUMBER", "+212XXXXXXXXX"),
  WHATSAPP_ENABLED: getEnv("WHATSAPP_ENABLED", "false") === "true",
  GA_MEASUREMENT_ID: getEnv("GA_MEASUREMENT_ID"),
  GSC_VERIFICATION: getEnv("GSC_VERIFICATION"),
  CLARITY_ID: getEnv("CLARITY_ID"),
  SITE_URL: getEnv("SITE_URL", "https://app.weblancia.com"),
  AI_PROVIDER: getEnv("AI_PROVIDER", "gemini"),
  AI_LANGUAGE: getEnv("AI_LANGUAGE", "fr"),
  isDevelopment: typeof process !== "undefined" && process.env.NODE_ENV !== "production",
  isProduction: typeof process !== "undefined" && process.env.NODE_ENV === "production",
}

export function validateEnv(): string[] {
  const warnings: string[] = []
  if (!env.SMTP_HOST) warnings.push("SMTP_HOST not configured — emails will be logged to console only")
  if (!env.WHATSAPP_NUMBER.includes("@") && env.WHATSAPP_NUMBER === "+212XXXXXXXXX") warnings.push("WHATSAPP_NUMBER not configured")
  return warnings
}