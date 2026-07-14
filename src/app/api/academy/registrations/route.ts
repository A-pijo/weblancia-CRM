import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"
import { z } from "zod"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  return success(await academyService.listRegistrations({
    courseId: searchParams.get("courseId") ? Number(searchParams.get("courseId")) : undefined,
    status: searchParams.get("status") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  }))
}, { auth: true, admin: true })

export const PATCH = apiRoute(async (ctx) => {
  const body = await apiBody(z.object({ id: z.number(), status: z.string() }))(ctx.request)
  if (body.error) return body.error
  return success(await academyService.updateRegistrationStatus(body.data.id, body.data.status))
}, { auth: true, admin: true })
