import { userService } from "@/lib/repositories/services/user.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created, badRequest } from "@/lib/security/response"
import { userSchema } from "@/lib/validation/users"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  if (searchParams.get("roles")) {
    const roles = await userService.getRoles()
    return success(roles)
  }
  const result = await userService.list({
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })
  return success(result)
}, { auth: true, permission: "users:manage" })

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(userSchema.strict())(ctx.request)
  if (body.error) return body.error
  const user = await userService.create(body.data)
  return created(user)
}, { auth: true, permission: "users:manage" })
