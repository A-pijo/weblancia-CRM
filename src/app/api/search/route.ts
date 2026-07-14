import { searchService } from "@/lib/repositories/services/search.service"
import { apiRoute } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"

export const GET = apiRoute(async (ctx) => {
  const q = ctx.request.nextUrl.searchParams.get("q")
  return success({ items: q ? await searchService.globalSearch(q) : [] })
}, { rateLimit: { max: 30, by: "ip" } })
