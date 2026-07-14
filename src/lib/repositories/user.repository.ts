import { BaseRepository } from "./base.repository"
import { prisma } from "@/lib/database/prisma"

type Delegate = typeof prisma.user

export class UserRepository extends BaseRepository<Delegate> {
  constructor() { super(prisma.user, "user") }

  async findByEmail(email: string) {
    return this.model.findUnique({ where: { email }, include: { role: true } })
  }

  async findWithRole(id: number) {
    return this.model.findUnique({ where: { id }, include: { role: true } })
  }

  async toggleStatus(id: number, isActive: boolean) {
    return this.model.update({ where: { id }, data: { isActive } })
  }

  async getRoles() {
    return prisma.role.findMany({ orderBy: { name: "asc" } })
  }
}

export const userRepository = new UserRepository()
