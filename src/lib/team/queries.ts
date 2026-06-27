import { db } from "@/lib/db"
import type { TeamMember, TeamMemberRow } from "@/types/team"

export type { TeamMemberRow }

export async function getTeamMembers(params?: {
  isActive?: boolean
  search?: string
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const { isActive = true, search, sort = "displayOrder", order = "asc", page = 1, limit = 50 } = params ?? {}

  const where: Record<string, unknown> = { isActive }
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { role: { contains: search } },
      { bio: { contains: search } },
    ]
  }

  const skip = (page - 1) * limit
  const orderBy = { [sort]: order }

  const [items, total] = await Promise.all([
    db.teamMember.findMany({ where, orderBy, skip, take: limit }),
    db.teamMember.count({ where }),
  ])

  return { items: items as TeamMemberRow[], total, page, totalPages: Math.ceil(total / limit) }
}

export async function getActiveTeamMembers(): Promise<TeamMember[]> {
  const rows = await db.teamMember.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  })
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    role: r.role,
    bio: r.bio ?? "",
    photo: r.image ?? undefined,
    social: {
      linkedin: r.linkedin ?? undefined,
      twitter: r.twitter ?? undefined,
    },
  }))
}

export async function getTeamMemberById(id: number) {
  const row = await db.teamMember.findUnique({ where: { id } })
  return row as TeamMemberRow | null
}

export async function createTeamMember(data: Record<string, unknown>) {
  const member = await db.teamMember.create({
    data: {
      name: data.name as string,
      role: data.role as string,
      bio: (data.bio as string) ?? null,
      image: (data.image as string) ?? null,
      linkedin: (data.linkedin as string) ?? null,
      twitter: (data.twitter as string) ?? null,
      github: (data.github as string) ?? null,
      email: (data.email as string) ?? null,
      phone: (data.phone as string) ?? null,
      displayOrder: (data.displayOrder as number) ?? 0,
      isActive: (data.isActive as boolean) ?? true,
    },
  })
  return member as TeamMemberRow
}

export async function updateTeamMember(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = ["name", "role", "bio", "image", "linkedin", "twitter", "github", "email", "phone", "displayOrder", "isActive"]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  const member = await db.teamMember.update({ where: { id }, data: updateData })
  return member as TeamMemberRow
}

export async function deleteTeamMember(id: number) {
  await db.teamMember.delete({ where: { id } })
}
