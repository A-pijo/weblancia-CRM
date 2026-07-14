import { leadService } from "@/lib/repositories/services/lead.service"
import { leadNoteSchema } from "@/lib/validation/leads"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { success, created, badRequest } from "@/lib/security/response"

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(leadNoteSchema)(ctx.request)
  if (body.error) return body.error
  const note = await leadService.addNote(Number(ctx.params.id), body.data.content, ctx.auth.session.userId)
  return created(note)
}, { auth: true, admin: true })

export const DELETE = apiRoute(async (ctx) => {
  const noteId = ctx.request.nextUrl.searchParams.get("noteId")
  if (!noteId) return badRequest("noteId requis")
  await leadService.deleteNote(Number(noteId))
  return success({ message: "Note supprimée" })
}, { auth: true, admin: true })
