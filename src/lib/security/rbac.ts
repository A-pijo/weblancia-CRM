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

export type Permission =
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "users:manage"
  | "content:read"
  | "content:create"
  | "content:update"
  | "content:delete"
  | "content:publish"
  | "media:read"
  | "media:upload"
  | "media:delete"
  | "settings:read"
  | "settings:update"
  | "leads:read"
  | "leads:update"
  | "leads:delete"
  | "academy:read"
  | "academy:create"
  | "academy:update"
  | "academy:delete"
  | "seo:read"
  | "seo:update"
  | "audit:read"
  | "admin:access"

const rolePermissions: Record<Role, Permission[]> = {
  [Role.SuperAdmin]: [
    "users:read", "users:create", "users:update", "users:delete", "users:manage",
    "content:read", "content:create", "content:update", "content:delete", "content:publish",
    "media:read", "media:upload", "media:delete",
    "settings:read", "settings:update",
    "leads:read", "leads:update", "leads:delete",
    "academy:read", "academy:create", "academy:update", "academy:delete",
    "seo:read", "seo:update",
    "audit:read",
    "admin:access",
  ],
  [Role.Admin]: [
    "users:read", "users:create", "users:update",
    "content:read", "content:create", "content:update", "content:delete", "content:publish",
    "media:read", "media:upload", "media:delete",
    "settings:read",
    "leads:read", "leads:update", "leads:delete",
    "academy:read", "academy:create", "academy:update", "academy:delete",
    "seo:read", "seo:update",
    "audit:read",
    "admin:access",
  ],
  [Role.Editor]: [
    "content:read", "content:create", "content:update", "content:delete",
    "media:read", "media:upload",
    "leads:read",
    "academy:read",
    "admin:access",
  ],
  [Role.Author]: [
    "content:read", "content:create", "content:update",
    "media:read", "media:upload",
    "admin:access",
  ],
  [Role.Support]: [
    "leads:read", "leads:update",
    "admin:access",
  ],
  [Role.Instructor]: [
    "academy:read", "academy:create", "academy:update",
    "media:read", "media:upload",
    "admin:access",
  ],
  [Role.Client]: [],
  [Role.Guest]: [],
}

export function getPermissions(role: Role): Permission[] {
  return rolePermissions[role] ?? []
}

export function hasPermission(role: Role, permission: Permission): boolean {
  return getPermissions(role).includes(permission)
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

export function isAdmin(role: Role): boolean {
  return role === Role.SuperAdmin || role === Role.Admin
}

export function isStaff(role: Role): boolean {
  return [Role.SuperAdmin, Role.Admin, Role.Editor, Role.Author, Role.Support, Role.Instructor].includes(role)
}
