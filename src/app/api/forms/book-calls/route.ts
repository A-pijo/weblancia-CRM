import { prisma } from "@/lib/database/prisma"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, badRequest } from "@/lib/security/response"
import { z } from "zod"

export const GET = apiRoute(
  async (ctx) => {
    const { searchParams } = ctx.request.nextUrl
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limit = Math.max(1, Number(searchParams.get("limit")) || 20)
    const isConfirmed = searchParams.has("isConfirmed") ? searchParams.get("isConfirmed") === "true" : undefined
    const search = searchParams.get("search") ?? undefined

    const where: Record<string, unknown> = {}
    if (isConfirmed !== undefined) where.isConfirmed = isConfirmed
    if (search) where.OR = [{ name: { contains: search } }, { email: { contains: search } }]

    const [items, total] = await Promise.all([
      prisma.bookCall.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.bookCall.count({ where }),
    ])

    return success({ items, total, page, totalPages: Math.ceil(total / limit) })
  },
  { auth: true, admin: true },
)

export const PATCH = apiRoute(
  async (ctx) => {
    const body = await apiBody(z.object({ action: z.literal("confirm"), id: z.number() }))(ctx.request)
    if (body.error) return body.error
    await prisma.bookCall.update({ where: { id: body.data.id }, data: { isConfirmed: true } })
    return success({ message: "Consultation confirmée" })
  },
  { auth: true, admin: true },
)

export const DELETE = apiRoute(
  async (ctx) => {
    const { searchParams } = ctx.request.nextUrl
    if (searchParams.has("id")) {
      await prisma.bookCall.delete({ where: { id: Number(searchParams.get("id")) } })
    } else {
      const body = await apiBody(z.object({ ids: z.array(z.number()) }))(ctx.request)
      if (body.error) return body.error
      await Promise.all(body.data.ids.map((id: number) => prisma.bookCall.delete({ where: { id } })))
    }
    return success({ message: "Consultation(s) supprimée(s)" })
  },
  { auth: true, admin: true },
)
