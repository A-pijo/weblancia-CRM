// Environment validation script
// Run: node .env.validation.mjs

const requiredVars = [
  "SITE_URL",
  "DATABASE_URL",
  "JWT_SECRET",
]

const optionalVars = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "AI_PROVIDER",
  "AI_LANGUAGE",
  "GEMINI_API_KEY",
  "OPENAI_API_KEY",
  "CRON_SECRET",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASS",
  "SMTP_FROM",
  "NOTIFICATION_EMAIL",
  "WHATSAPP_NUMBER",
  "WHATSAPP_ENABLED",
  "GA_MEASUREMENT_ID",
  "GSC_VERIFICATION",
  "CLARITY_ID",
]

const missing = requiredVars.filter((v) => !process.env[v])

if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(", ")}`)
  console.error("   Copy .env.example to .env.local and fill in the values.")
  process.exit(1)
}

console.log("✅ All required environment variables are set.")
console.log(`ℹ️  ${optionalVars.filter((v) => !process.env[v]).length} optional variables not set (will use defaults).`)
process.exit(0)