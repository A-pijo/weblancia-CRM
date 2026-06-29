import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth/password"
import type { Prisma } from "@/generated/prisma/client"

export type UserWithRole = Prisma.UserGetPayload<{ include: { role: true } }>

export async function getUsers(params: {
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
}) {
  const { search, isActive, page = 1, limit = 20 } = params
  const where: Record<string, unknown> = {}
  if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }]
  if (isActive !== undefined) where.isActive = isActive
  const skip = (page - 1) * limit
  const [items, total] = await Promise.all([
    db.user.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit, include: { role: true } }),
    db.user.count({ where }),
  ])
  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getUserById(id: number) {
  return db.user.findUnique({ where: { id }, include: { role: true } })
}

export async function createUser(data: Record<string, unknown>) {
  const password = data.password ? await hashPassword(data.password as string) : ""
  return db.user.create({
    data: {
      name: data.name as string,
      email: data.email as string,
      password,
      roleId: data.roleId as number,
      isActive: (data.isActive as boolean) ?? true,
    },
  })
}

export async function updateUser(id: number, data: Record<string, unknown>) {
  const allowed = ["name", "email", "roleId", "isActive"]
  const updateData: Record<string, unknown> = {}
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  if (data.password && typeof data.password === "string" && data.password.length > 0) {
    updateData.password = await hashPassword(data.password as string)
  }
  return db.user.update({ where: { id }, data: updateData })
}

export async function toggleUserStatus(id: number, isActive: boolean) {
  return db.user.update({ where: { id }, data: { isActive } })
}

export async function deleteUser(id: number) {
  return db.user.delete({ where: { id } })
}

export async function getRoles() {
  return db.role.findMany({ orderBy: { id: "asc" } })
}
