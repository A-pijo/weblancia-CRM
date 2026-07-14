import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success } from "@/lib/security/response"
import { getAllSettings, upsertSettings } from "@/lib/settings"
import { createAuditLog } from "@/lib/security/audit"
import { z } from "zod"

export const GET = apiRoute(async (_ctx) => {
  const settings = await getAllSettings()
  return success(settings)
}, { auth: true, admin: true })

// Settings use passthrough intentionally: site settings are dynamic key-value pairs
// stored as Setting rows. upsertSettings() only persists keys matching the SiteSettings
// interface — unknown keys are silently ignored. Route is admin-only with auth.
export const PUT = apiRoute(async (ctx) => {
  const body = await apiBody(z.object({}).passthrough())(ctx.request)
  if (body.error) return body.error
  const settings = await upsertSettings(body.data)

  createAuditLog({
    action: "SETTINGS_UPDATE", entity: "SETTING",
    description: "Paramètres généraux mis à jour", userId: ctx.auth.session?.userId, request: ctx.request,
  })

  return success(settings)
}, { auth: true, admin: true })
