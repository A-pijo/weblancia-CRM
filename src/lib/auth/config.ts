export const AUTH = {
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-in-production-32chars",
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
}

export const ROLE_HIERARCHY: Record<Role, number> = {
  [Role.SuperAdmin]: 100,
  [Role.Admin]: 50,
  [Role.Editor]: 10,
}

export interface SessionPayload {
  userId: number
  email: string
  name: string
  role: Role
}
