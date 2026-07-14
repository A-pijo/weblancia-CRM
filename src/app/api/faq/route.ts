import { faqService } from "@/lib/repositories/services/faq.service"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created } from "@/lib/security/response"
import { z } from "zod"

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  category: z.string().optional(),
  displayOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
})

export const GET = apiRoute(async (ctx) => {
  const { searchParams } = ctx.request.nextUrl
  const result = await faqService.list({
    search: searchParams.get("search") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })
  return success(result)
})

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(faqSchema)(ctx.request)
  if (body.error) return body.error
  const faq = await faqService.create(body.data)
  return created(faq)
}, { auth: true, admin: true })
