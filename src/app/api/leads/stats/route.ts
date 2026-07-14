import { leadService } from "@/lib/repositories/services/lead.service"
import { apiRoute } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"

export const GET = apiRoute(async () => {
  const [stats, sources, statusDist] = await Promise.all([
    leadService.getStats(),
    leadService.getSources(),
    leadService.getStatusDistribution(),
  ])
  return success({ ...stats, sources, statusDistribution: statusDist })
}, { auth: true, admin: true })
