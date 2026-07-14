function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret || secret === "dev-secret-change-in-production-32chars") {
    throw new Error(
      "JWT_SECRET is not set or is the insecure fallback. " +
      "Generate a 64+ char secret with: openssl rand -hex 64"
    )
  }
  return secret
}

export const AUTH = {
  jwtSecret: getJwtSecret(),
  jwtIssuer: "weblancia",
  jwtAudience: "weblancia-admin",
  jwtAlgorithm: "HS256" as const,
  sessionCookieName: "session",
  expiresShort: "24h",
  expiresLong: "7d",
  expiresShortMs: 86_400_000,
  expiresLongMs: 604_800_000,
} as const

export enum Role {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  Editor = "Editor",
  Author = "Author",
  Support = "Support",
  Instructor = "Instructor",
  Client = "Client",
  Guest = "Guest",
}

export const ROLE_HIERARCHY: Record<string, number> = {
  SuperAdmin: 100,
  Admin: 50,
  Editor: 10,
  Author: 5,
  Support: 5,
  Instructor: 5,
  Client: 1,
  Guest: 0,
}

export interface SessionPayload {
  userId: number
  email: string
  name: string
  role: Role
  version?: number
  iat?: number
  exp?: number
  iss?: string
  aud?: string
}
