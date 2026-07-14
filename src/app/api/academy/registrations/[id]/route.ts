import { academyService } from "@/lib/repositories/services/academy.service"
import { apiRoute } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"

export const DELETE = apiRoute(async (ctx) => {
  await academyService.deleteRegistration(Number(ctx.params.id))
  return success({ message: "Inscription supprimée" })
}, { auth: true, admin: true })
