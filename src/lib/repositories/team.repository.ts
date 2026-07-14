import { BaseRepository } from "./base.repository"
import { prisma } from "@/lib/database/prisma"

type Delegate = typeof prisma.teamMember

export class TeamMemberRepository extends BaseRepository<Delegate> {
  constructor() { super(prisma.teamMember, "teamMember") }
  async findActive() { return this.model.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }) }
}

export const teamMemberRepository = new TeamMemberRepository()
