import { prisma } from "@/lib/database/prisma"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"
import { z } from "zod"

export const GET = apiRoute(
  async (ctx) => {
    const { searchParams } = ctx.request.nextUrl
    const page = Math.max(1, Number(searchParams.get("page")) || 1)
    const limit = Math.max(1, Number(searchParams.get("limit")) || 20)
    const isActive = searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined
    const search = searchParams.get("search") ?? undefined

    const where: Record<string, unknown> = {}
    if (isActive !== undefined) where.isActive = isActive
    if (search) where.email = { contains: search }

    const [items, total] = await Promise.all([
      prisma.newsletterSubscriber.findMany({ where, orderBy: { subscribedAt: "desc" }, skip: (page - 1) * limit, take: limit }),
      prisma.newsletterSubscriber.count({ where }),
    ])

    return success({ items, total, page, totalPages: Math.ceil(total / limit) })
  },
  { auth: true, admin: true },
)

export const DELETE = apiRoute(
  async (ctx) => {
    const { searchParams } = ctx.request.nextUrl
    if (searchParams.has("id")) {
      await prisma.newsletterSubscriber.delete({ where: { id: Number(searchParams.get("id")) } })
    } else {
      const body = await apiBody(z.object({ ids: z.array(z.number()) }))(ctx.request)
      if (body.error) return body.error
      await Promise.all(body.data.ids.map((id: number) => prisma.newsletterSubscriber.delete({ where: { id } })))
    }
    return success({ message: "Abonné(s) supprimé(s)" })
  },
  { auth: true, admin: true },
)
