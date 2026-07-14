import { revalidatePath } from "next/cache"
import { blogService } from "@/lib/repositories/services/blog.service"
import { blogPostSchema } from "@/lib/repositories/dto/blog.dto"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { createAuditLog } from "@/lib/security/audit"

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = new URL(ctx.request.url)

  const result = await blogService.list({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    published: searchParams.has("isPublished") ? searchParams.get("isPublished") === "true" : undefined,
    featured: searchParams.has("isFeatured") ? searchParams.get("isFeatured") === "true" : undefined,
    sort: (searchParams.get("sort") as "asc" | "desc") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })

  return success(result)
}, { rateLimit: { max: 30 } })

export const POST = apiRoute(async (ctx) => {
  const bodyResult = await apiBody(blogPostSchema)(ctx.request)
  if (bodyResult.error) return bodyResult.error

  const post = await blogService.create(bodyResult.data)

  createAuditLog({
    action: "CREATE",
    entity: "BLOG_POST",
    entityId: post.id,
    description: `Creation de l'article de blog : ${bodyResult.data.title}`,
    userId: ctx.auth.session.userId,
    request: ctx.request,
  })

  try { revalidatePath("/insights"); revalidatePath("/sitemap.xml") } catch {}

  return created(post)
}, { auth: true, admin: true, rateLimit: { max: 20 } })
