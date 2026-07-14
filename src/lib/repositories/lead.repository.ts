import { BaseRepository } from "./base.repository"
import { prisma } from "@/lib/database/prisma"

type Delegate = typeof prisma.lead

export class LeadRepository extends BaseRepository<Delegate> {
  constructor() { super(prisma.lead, "lead") }

  async findWithRelations(id: number) {
    return this.model.findUnique({ where: { id }, include: { notes: { orderBy: { createdAt: "desc" } }, timeline: { orderBy: { createdAt: "desc" } }, assignedTo: { select: { id: true, name: true, email: true } } } })
  }

  async updateStatus(id: number, status: string, authorId?: number) {
    return this.model.update({ where: { id }, data: { status } })
  }

  async assign(id: number, assignedToId: number, authorId?: number) {
    return this.model.update({ where: { id }, data: { assignedToId } })
  }

  async addNote(leadId: number, content: string, authorId: number) {
    return prisma.leadNote.create({ data: { leadId, content, authorId } })
  }

  async deleteNote(noteId: number) { return prisma.leadNote.delete({ where: { id: noteId } }) }

  async addTimelineEntry(leadId: number, action: string, description: string, authorId?: number) {
    return prisma.leadTimeline.create({ data: { leadId, action, description, authorId } })
  }

  async getStats() {
    const [total, newLeads, contacted, won] = await Promise.all([
      this.model.count(), this.model.count({ where: { status: "New" } }), this.model.count({ where: { status: "Contacted" } }), this.model.count({ where: { status: "Won" } }),
    ])
    return { total, newLeads, contacted, won }
  }

  async getSources() { return this.model.groupBy({ by: ["source"], _count: true, orderBy: { _count: { source: "desc" } } }) }
  async getStatusDistribution() { return this.model.groupBy({ by: ["status"], _count: true, orderBy: { _count: { status: "desc" } } }) }
}

export const leadRepository = new LeadRepository()
