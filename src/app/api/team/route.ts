import { teamMemberService } from "@/lib/repositories/services/team.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { z } from "zod"

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  bio: z.string().optional(),
  image: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  github: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  const result = await teamMemberService.list({
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })
  return success(result)
})

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(teamMemberSchema)(ctx.request)
  if (body.error) return body.error
  const member = await teamMemberService.create(body.data)
  return created(member)
}, { auth: true, admin: true })
