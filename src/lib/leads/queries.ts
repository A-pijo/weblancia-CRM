import { db } from "@/lib/db"
import type { Prisma } from "@/generated/prisma/client"

export type LeadWithRelations = Prisma.LeadGetPayload<{
  include: { assignedTo: true; notes: { include: { author: true } }; timeline: { include: { author: true } } }
}>

export async function getLeads(params: {
  search?: string
  status?: string
  source?: string
  country?: string
  assignedToId?: number
  service?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
}) {
  const { search, status, source, country, assignedToId, service, dateFrom, dateTo, page = 1, limit = 20, sort = "createdAt", order = "desc" } = params
  const where: Record<string, unknown> = {}
  const AND: Record<string, unknown>[] = []

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
    ]
  }
  if (status) where.status = status
  if (source) where.source = source
  if (country) where.country = { contains: country, mode: "insensitive" }
  if (assignedToId) where.assignedToId = assignedToId
  if (service) where.service = { contains: service, mode: "insensitive" }
  if (dateFrom) AND.push({ createdAt: { gte: new Date(dateFrom) } })
  if (dateTo) AND.push({ createdAt: { lte: new Date(dateTo) } })
  if (AND.length > 0) where.AND = AND

  const skip = (page - 1) * limit
  const orderBy = { [sort]: order }

  const [items, total] = await Promise.all([
    db.lead.findMany({ where, orderBy, skip, take: limit, include: { assignedTo: true } }),
    db.lead.count({ where }),
  ])

  return { items, total, page, totalPages: Math.ceil(total / limit) }
}

export async function getLeadById(id: number) {
  return db.lead.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      notes: { orderBy: { createdAt: "desc" }, include: { author: true } },
      timeline: { orderBy: { createdAt: "desc" }, include: { author: true } },
    },
  })
}

export async function createLead(data: Record<string, unknown>) {
  const lead = await db.lead.create({
    data: {
      name: data.name as string,
      company: (data.company as string) ?? null,
      email: (data.email as string) ?? null,
      phone: (data.phone as string) ?? null,
      whatsapp: (data.whatsapp as string) ?? null,
      website: (data.website as string) ?? null,
      country: (data.country as string) ?? null,
      city: (data.city as string) ?? null,
      ipAddress: (data.ipAddress as string) ?? null,
      browser: (data.browser as string) ?? null,
      device: (data.device as string) ?? null,
      preferredLanguage: (data.preferredLanguage as string) ?? null,
      source: data.source as string,
      service: (data.service as string) ?? null,
      message: (data.message as string) ?? null,
      budget: (data.budget as string) ?? null,
      status: (data.status as string) ?? "New",
      assignedToId: (data.assignedToId as number) ?? null,
      originalId: (data.originalId as number) ?? null,
    },
  })

  await db.leadTimeline.create({
    data: { leadId: lead.id, action: "created", description: `Lead created via ${data.source}` },
  })

  return lead
}

export async function updateLead(id: number, data: Record<string, unknown>) {
  const allowed = ["name", "company", "email", "phone", "whatsapp", "website", "country", "city", "ipAddress", "browser", "device", "preferredLanguage", "source", "service", "message", "budget", "status", "assignedToId"]
  const updateData: Record<string, unknown> = {}
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  return db.lead.update({ where: { id }, data: updateData })
}

export async function updateLeadStatus(id: number, status: string, authorId?: number) {
  const lead = await db.lead.update({ where: { id }, data: { status } })
  await db.leadTimeline.create({
    data: { leadId: id, action: "status_changed", description: `Status changed to ${status}`, authorId: authorId ?? null },
  })
  return lead
}

export async function assignLead(id: number, assignedToId: number | null, authorId?: number) {
  const lead = await db.lead.update({ where: { id }, data: { assignedToId } })
  const author = authorId ? await db.user.findUnique({ where: { id: authorId } }) : null
  await db.leadTimeline.create({
    data: { leadId: id, action: "assigned", description: assignedToId ? `Assigned to ${author?.name ?? "user"}` : "Unassigned", authorId: authorId ?? null },
  })
  return lead
}

export async function addLeadNote(leadId: number, content: string, authorId: number) {
  const note = await db.leadNote.create({ data: { leadId, content, authorId } })
  await db.leadTimeline.create({
    data: { leadId, action: "note_added", description: "Note added", authorId },
  })
  return db.leadNote.findUnique({ where: { id: note.id }, include: { author: true } })
}

export async function deleteLeadNote(noteId: number) {
  return db.leadNote.delete({ where: { id: noteId } })
}

export async function addLeadTimelineEntry(leadId: number, action: string, description: string, authorId?: number) {
  return db.leadTimeline.create({ data: { leadId, action, description, authorId: authorId ?? null } })
}

export async function deleteLead(id: number) {
  return db.lead.delete({ where: { id } })
}

export async function getLeadStats() {
  const [total, newLeads, contacted, qualified, proposalSent, won, lost, spam, thisMonth, recent] = await Promise.all([
    db.lead.count(),
    db.lead.count({ where: { status: "New" } }),
    db.lead.count({ where: { status: "Contacted" } }),
    db.lead.count({ where: { status: "Qualified" } }),
    db.lead.count({ where: { status: "Proposal Sent" } }),
    db.lead.count({ where: { status: "Won" } }),
    db.lead.count({ where: { status: "Lost" } }),
    db.lead.count({ where: { status: "Spam" } }),
    db.lead.count({ where: { createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } } }),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, name: true, email: true, source: true, status: true, createdAt: true } }),
  ])

  const conversionRate = total > 0 ? Math.round((won / (won + lost)) * 100) : 0

  return { total, newLeads, contacted, qualified, proposalSent, won, lost, spam, thisMonth, conversionRate: isNaN(conversionRate) ? 0 : conversionRate, recent }
}

export async function getLeadSources() {
  return db.lead.groupBy({ by: ["source"], _count: { source: true }, orderBy: { _count: { source: "desc" } } })
}

export async function getLeadStatusDistribution() {
  return db.lead.groupBy({ by: ["status"], _count: { status: true }, orderBy: { _count: { status: "desc" } } })
}

export async function getLeadsByUser() {
  return db.lead.groupBy({ by: ["assignedToId"], _count: { assignedToId: true }, orderBy: { _count: { assignedToId: "desc" } } })
}
