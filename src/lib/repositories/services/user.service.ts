import { userRepository } from "@/lib/repositories/user.repository"
import { NotFoundError, ConflictError } from "@/lib/errors"
import { hashPassword } from "@/lib/auth/password"
import type { Prisma } from "@/generated/prisma/client"

export interface CreateUserDTO {
  name: string
  email: string
  password?: string
  roleId: number
  isActive?: boolean
}

export interface UpdateUserDTO {
  name?: string
  email?: string
  password?: string
  roleId?: number
  isActive?: boolean
  _action?: "toggle"
}

export class UserService {
  async list(params: { page?: number; limit?: number; search?: string }) {
    const where: Prisma.UserWhereInput = {}
    if (params.search) where.OR = [{ name: { contains: params.search, mode: "insensitive" } }, { email: { contains: params.search, mode: "insensitive" } }]
    return userRepository.findPaginated({ where, orderBy: { createdAt: "desc" }, page: params.page, limit: params.limit, include: { role: true } })
  }

  async getById(id: number) {
    const user = await userRepository.findWithRole(id)
    if (!user) throw new NotFoundError("Utilisateur introuvable")
    return user
  }

  async create(data: CreateUserDTO) {
    const existing = await userRepository.findByEmail(data.email)
    if (existing) throw new ConflictError("Cet email est deja utilise")
    if (!data.password) throw new Error("Password is required")
    const hashed = await hashPassword(data.password)
    return userRepository.create({
      name: data.name,
      email: data.email,
      password: hashed,
      isActive: data.isActive ?? true,
      role: { connect: { id: data.roleId } },
    } satisfies Prisma.UserCreateInput & { password: string })
  }

  async update(id: number, data: UpdateUserDTO) {
    await this.getById(id)
    const prismaData: Prisma.UserUpdateInput = {}
    if (data.name !== undefined) prismaData.name = data.name
    if (data.email !== undefined) prismaData.email = data.email
    if (data.isActive !== undefined) prismaData.isActive = data.isActive
    if (data.password) prismaData.password = await hashPassword(data.password)
    if (data.roleId !== undefined) prismaData.role = { connect: { id: data.roleId } }
    return userRepository.update(id, prismaData)
  }

  async delete(id: number) { await this.getById(id); return userRepository.delete(id) }
  async toggleStatus(id: number) { const user = await this.getById(id); return userRepository.toggleStatus(id, !user.isActive) }
  async getRoles() { return userRepository.getRoles() }
  async findByEmail(email: string) { return userRepository.findByEmail(email) }
}

export const userService = new UserService()
