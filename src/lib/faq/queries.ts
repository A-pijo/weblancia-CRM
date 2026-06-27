import { db } from "@/lib/db"
import type { FAQ } from "@/types/common"

export interface FAQRow {
  id: number
  question: string
  answer: string
  category: string | null
  displayOrder: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export async function getActiveFAQs(): Promise<FAQ[]> {
  const rows = await db.fAQ.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  })
  return rows.map((r) => ({ question: r.question, answer: r.answer }))
}

export async function getActiveFAQWithIds(): Promise<{ id: number; question: string; answer: string }[]> {
  const rows = await db.fAQ.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
  })
  return rows.map((r) => ({ id: r.id, question: r.question, answer: r.answer }))
}

export async function getFAQs(params?: {
  search?: string
  isActive?: boolean
  sort?: string
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  const { search, isActive, sort = "displayOrder", order = "asc", page = 1, limit = 50 } = params ?? {}

  const where: Record<string, unknown> = {}
  if (isActive !== undefined) where.isActive = isActive
  if (search) {
    where.OR = [
      { question: { contains: search } },
      { answer: { contains: search } },
    ]
  }

  const skip = (page - 1) * limit
  const orderBy = { [sort]: order }

  const [items, total] = await Promise.all([
    db.fAQ.findMany({ where, orderBy, skip, take: limit }),
    db.fAQ.count({ where }),
  ])

  return { items: items as FAQRow[], total, page, totalPages: Math.ceil(total / limit) }
}

export async function getFAQById(id: number) {
  const row = await db.fAQ.findUnique({ where: { id } })
  return row as FAQRow | null
}

export async function createFAQ(data: Record<string, unknown>) {
  const row = await db.fAQ.create({
    data: {
      question: data.question as string,
      answer: data.answer as string,
      category: (data.category as string) ?? null,
      displayOrder: (data.displayOrder as number) ?? 0,
      isActive: (data.isActive as boolean) ?? true,
    },
  })
  return row as FAQRow
}

export async function updateFAQ(id: number, data: Record<string, unknown>) {
  const updateData: Record<string, unknown> = {}
  const allowed = ["question", "answer", "category", "displayOrder", "isActive"]
  for (const key of allowed) {
    if (data[key] !== undefined) updateData[key] = data[key]
  }
  const row = await db.fAQ.update({ where: { id }, data: updateData })
  return row as FAQRow
}

export async function deleteFAQ(id: number) {
  await db.fAQ.delete({ where: { id } })
}
