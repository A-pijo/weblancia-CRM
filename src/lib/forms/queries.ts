import { db } from "@/lib/db"

export function getContacts(params?: {
  search?: string
  isRead?: boolean
  page?: number
  limit?: number
  sort?: string
  order?: "asc" | "desc"
}) {
  const { search, isRead, page = 1, limit = 20, sort = "createdAt", order = "desc" } = params ?? {}
  const where: Record<string, unknown> = {}
  if (isRead !== undefined) where.isRead = isRead
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { message: { contains: search } },
    ]
  }
  return db.contactRequest.findMany({
    where,
    orderBy: { [sort]: order },
    skip: (page - 1) * limit,
    take: limit,
  })
}

export function getContactsCount(params?: { search?: string; isRead?: boolean }) {
  const where: Record<string, unknown> = {}
  if (params?.isRead !== undefined) where.isRead = params.isRead
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search } },
      { email: { contains: params.search } },
    ]
  }
  return db.contactRequest.count({ where })
}

export function getBookCalls(params?: {
  search?: string
  isConfirmed?: boolean
  page?: number
  limit?: number
}) {
  const { search, isConfirmed, page = 1, limit = 20 } = params ?? {}
  const where: Record<string, unknown> = {}
  if (isConfirmed !== undefined) where.isConfirmed = isConfirmed
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ]
  }
  return db.bookCall.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  })
}

export function getBookCallsCount(params?: { search?: string; isConfirmed?: boolean }) {
  const where: Record<string, unknown> = {}
  if (params?.isConfirmed !== undefined) where.isConfirmed = params.isConfirmed
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search } },
      { email: { contains: params.search } },
    ]
  }
  return db.bookCall.count({ where })
}

export function getProjectRequests(params?: {
  search?: string
  isRead?: boolean
  page?: number
  limit?: number
}) {
  const { search, isRead, page = 1, limit = 20 } = params ?? {}
  const where: Record<string, unknown> = {}
  if (isRead !== undefined) where.isRead = isRead
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
    ]
  }
  return db.startProject.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  })
}

export function getProjectRequestsCount(params?: { search?: string; isRead?: boolean }) {
  const where: Record<string, unknown> = {}
  if (params?.isRead !== undefined) where.isRead = params.isRead
  if (params?.search) {
    where.OR = [
      { name: { contains: params.search } },
      { email: { contains: params.search } },
    ]
  }
  return db.startProject.count({ where })
}

export function getNewsletterSubscribers(params?: {
  search?: string
  isActive?: boolean
  page?: number
  limit?: number
}) {
  const { search, isActive, page = 1, limit = 20 } = params ?? {}
  const where: Record<string, unknown> = {}
  if (isActive !== undefined) where.isActive = isActive
  if (search) {
    where.email = { contains: search }
  }
  return db.newsletterSubscriber.findMany({
    where,
    orderBy: { subscribedAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  })
}

export function getNewsletterSubscribersCount(params?: { search?: string; isActive?: boolean }) {
  const where: Record<string, unknown> = {}
  if (params?.isActive !== undefined) where.isActive = params.isActive
  if (params?.search) where.email = { contains: params.search }
  return db.newsletterSubscriber.count({ where })
}

export function markContactRead(id: number) {
  return db.contactRequest.update({ where: { id }, data: { isRead: true } })
}

export function markProjectRead(id: number) {
  return db.startProject.update({ where: { id }, data: { isRead: true } })
}

export function confirmBookCall(id: number) {
  return db.bookCall.update({ where: { id }, data: { isConfirmed: true } })
}

export function deleteContact(id: number) {
  return db.contactRequest.delete({ where: { id } })
}

export function deleteBookCall(id: number) {
  return db.bookCall.delete({ where: { id } })
}

export function deleteProjectRequest(id: number) {
  return db.startProject.delete({ where: { id } })
}

export function deleteNewsletterSubscriber(id: number) {
  return db.newsletterSubscriber.delete({ where: { id } })
}
