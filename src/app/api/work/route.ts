import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { projectService } from "@/lib/repositories/services"
import { projectSchema } from "@/lib/validation/project"
import { createAuditLog } from "@/lib/security/audit"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl

  const result = await projectService.list({
    search: searchParams.get("search") ?? undefined,
    industry: searchParams.get("industry") ?? undefined,
    featured: searchParams.has("featured") ? searchParams.get("featured") === "true" : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })

  return success(result)
})

export const POST = apiRoute(async (ctx) => {
  const { data, error } = await apiBody(projectSchema)(ctx.request)
  if (error) return error

  const project = await projectService.create(data)

  createAuditLog({
    action: "CREATE",
    entity: "PROJECT",
    entityId: project.id,
    description: `Projet "${data.title}" créé`,
    userId: ctx.auth.session?.userId,
    request: ctx.request,
  })

  return created(project)
}, { auth: true, admin: true })
