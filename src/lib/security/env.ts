const REQUIRED_ENV_VARS = [
  "JWT_SECRET",
  "DATABASE_URL",
  "DIRECT_URL",
] as const

const ENV_PATTERNS: Record<string, { minLength: number; pattern?: RegExp; description: string }> = {
  JWT_SECRET: {
    minLength: 64,
    description: "JWT signing secret (min 64 characters, high entropy)",
  },
  DATABASE_URL: {
    minLength: 20,
    description: "PostgreSQL connection string",
  },
}

function isDev(): boolean {
  return process.env.NODE_ENV === "development" || process.env.NODE_ENV === undefined
}

function hasMinLength(key: string, minLen: number): boolean {
  const val = process.env[key]
  return typeof val === "string" && val.length >= minLen
}

export function validateSecurityEnv(): string[] {
  const errors: string[] = []

  for (const key of REQUIRED_ENV_VARS) {
    if (!process.env[key]) {
      if (key === "JWT_SECRET" && isDev()) continue
      errors.push(`[SECURITY] ${key} is required but not set.`)
    }
  }

  for (const [key, rules] of Object.entries(ENV_PATTERNS)) {
    if (process.env[key] && !hasMinLength(key, rules.minLength)) {
      if (key === "JWT_SECRET" && isDev()) continue
      errors.push(`[SECURITY] ${key} must be at least ${rules.minLength} characters (${rules.description}).`)
    }
  }

  if (process.env.JWT_SECRET === "dev-secret-change-in-production-32chars") {
    errors.push("[SECURITY] JWT_SECRET is still the insecure fallback. Generate a new secret.")
  }

  if (!process.env.SITE_URL && !isDev()) {
    errors.push("[SECURITY] SITE_URL is required in production.")
  }

  return errors
}

export function assertSecureEnv(): void {
  const errors = validateSecurityEnv()
  if (errors.length > 0) {
    if (isDev()) {
      console.warn("⚠  Security environment warnings:\n" + errors.map((e) => `  • ${e}`).join("\n"))
    } else {
      console.error("❌  Security environment validation failed:\n" + errors.map((e) => `  • ${e}`).join("\n"))
      process.exit(1)
    }
  }
}
