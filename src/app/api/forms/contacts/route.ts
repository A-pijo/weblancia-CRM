import { prisma } from "@/lib/database/prisma"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, badRequest } from "@/lib/security/response"
import { z } from "zod"

export const GET = apiRoute(
  async (ctx) => {
    const { searchParams } = ctx.request.nextUrl
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limit = Math.max(1, Number(searchParams.get("limit")) || 20)
    const isRead = searchParams.has("isRead") ? searchParams.get("isRead") === "true" : undefined
    const search = searchParams.get("search") ?? undefined

    const where: Record<string, unknown> = {}
    if (isRead !== undefined) where.isRead = isRead
    if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }, { message: { contains: search } }]

    const [items, total] = await Promise.all([
      prisma.contactRequest.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.contactRequest.count({ where }),
    ])

    return success({ items, total, page, totalPages: Math.ceil(total / limit) })
  },
  { auth: true, admin: true },
)

export const PATCH = apiRoute(
  async (ctx) => {
    const body = await apiBody(z.object({ action: z.literal("read"), id: z.number() }))(ctx.request)
    if (body.error) return body.error
    await prisma.contactRequest.update({ where: { id: body.data.id }, data: { isRead: true } })
    return success({ message: "Contact marqué comme lu" })
  },
  { auth: true, admin: true },
)

export const DELETE = apiRoute(
  async (ctx) => {
    const { searchParams } = ctx.request.nextUrl
    if (searchParams.has("id")) {
      await prisma.contactRequest.delete({ where: { id: Number(searchParams.get("id")) } })
    } else {
      const body = await apiBody(z.object({ ids: z.array(z.number()) }))(ctx.request)
      if (body.error) return body.error
      await Promise.all(body.data.ids.map((id: number) => prisma.contactRequest.delete({ where: { id } })))
    }
    return success({ message: "Contact(s) supprimé(s)" })
  },
  { auth: true, admin: true },
)
