import { BaseRepository } from "./base.repository"
import { prisma } from "@/lib/database/prisma"

type Delegate = typeof prisma.fAQ

export class FAQRepository extends BaseRepository<Delegate> {
  constructor() { super(prisma.fAQ, "FAQ") }
  async findActive() { return this.model.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" } }) }
}

export const faqRepository = new FAQRepository()
