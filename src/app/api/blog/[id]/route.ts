import { revalidatePath } from "next/cache"
import { z } from "zod"
import { blogService } from "@/lib/repositories/services/blog.service"
import { blogPostUpdateSchema } from "@/lib/repositories/dto/blog.dto"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created, notFound, badRequest } from "@/lib/security/response"
import { createAuditLog } from "@/lib/security/audit"
import { NotFoundError } from "@/lib/errors"

const blogDeleteSchema = z.object({ permanent: z.literal(true).optional() }).strict()

export const GET = apiRoute(async (ctx) => {
  try {
    const post = await blogService.getById(Number(ctx.params.id))
    return success(post)
  } catch (error) {
    if (error instanceof NotFoundError) return notFound()
    throw error
  }
})

export const PATCH = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const body = await apiBody(blogPostUpdateSchema)(ctx.request)
  if (body.error) return body.error

  if (body.data._action === "duplicate") {
    const dup = await blogService.duplicate(id)
    createAuditLog({
      action: "CREATE", entity: "BLOG_POST", entityId: dup.id,
      description: `Duplication de l'article de blog #${id}`, userId: ctx.auth.session.userId, request: ctx.request,
    })
    try { revalidatePath("/insights"); revalidatePath("/sitemap.xml") } catch {}
    return created(dup)
  }

  if (body.data._action === "toggle") {
    const updated = await blogService.toggleStatus(id)
    createAuditLog({
      action: "UPDATE", entity: "BLOG_POST", entityId: id,
      description: updated.isPublished ? "Publication de l'article de blog" : "Depubliage de l'article de blog",
      userId: ctx.auth.session.userId, request: ctx.request,
    })
    try { revalidatePath("/insights"); revalidatePath("/sitemap.xml") } catch {}
    return success(updated)
  }

  const updated = await blogService.update(id, body.data)
  createAuditLog({
    action: "UPDATE", entity: "BLOG_POST", entityId: id,
    description: `Mise a jour de l'article de blog #${id}`, userId: ctx.auth.session.userId, request: ctx.request,
  })
  try { revalidatePath("/insights"); revalidatePath("/sitemap.xml") } catch {}
  return success(updated)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const id = Number(ctx.params.id)
  const raw = await ctx.request.json().catch(() => ({}))
  const parsed = blogDeleteSchema.safeParse(raw)
  if (!parsed.success) return badRequest("Données invalides", parsed.error.flatten().fieldErrors)

  if (parsed.data.permanent) {
    await blogService.permanentlyDelete(id)
    createAuditLog({
      action: "DELETE", entity: "BLOG_POST", entityId: id,
      description: `Suppression definitive de l'article de blog #${id}`, userId: ctx.auth.session.userId, request: ctx.request,
    })
  } else {
    await blogService.delete(id)
    createAuditLog({
      action: "DELETE", entity: "BLOG_POST", entityId: id,
      description: `Suppression (soft) de l'article de blog #${id}`, userId: ctx.auth.session.userId, request: ctx.request,
    })
  }

  try { revalidatePath("/insights"); revalidatePath("/sitemap.xml") } catch {}
  return success({ success: true })
}, { auth: true, admin: true })
