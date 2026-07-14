import { getSession } from "@/lib/auth/session"
import type { SessionPayload } from "@/lib/auth/config"
import { Role, hasPermission, isAdmin, type Permission } from "./rbac"
import { unauthorized, forbidden } from "./response"

export type AuthResult = { session: SessionPayload; error: never } | { session: never; error: Response }

export async function requireAuth(): Promise<AuthResult> {
  const session = await getSession()
  if (!session) {
    return { session: undefined as never, error: unauthorized() }
  }
  return { session, error: undefined as never }
}

export async function requireRole(role: Role): Promise<AuthResult> {
  const result = await requireAuth()
  if (result.error) return result
  if (result.session.role !== role) {
    return { session: undefined as never, error: forbidden() }
  }
  return result
}

export async function requireAdmin(): Promise<AuthResult> {
  const result = await requireAuth()
  if (result.error) return result
  if (!isAdmin(result.session.role as Role)) {
    return { session: undefined as never, error: forbidden() }
  }
  return result
}

export async function requirePermission(permission: Permission): Promise<AuthResult> {
  const result = await requireAuth()
  if (result.error) return result
  if (!hasPermission(result.session.role as Role, permission)) {
    return { session: undefined as never, error: forbidden() }
  }
  return result
}

export async function requireOwnership(
  entityUserId: number,
  requiredPermission?: Permission,
): Promise<AuthResult> {
  const result = await requireAuth()
  if (result.error) return result
  const role = result.session.role as Role
  if (role === Role.SuperAdmin) return result
  if (result.session.userId === entityUserId) return result
  if (requiredPermission && hasPermission(role, requiredPermission)) return result
  return { session: undefined as never, error: forbidden() }
}
