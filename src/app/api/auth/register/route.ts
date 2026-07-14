import { prisma } from "@/lib/database/prisma"
import { hashPassword } from "@/lib/auth/password"
import { registerSchema } from "@/lib/validation/auth"
import { apiRoute, apiBody } from "@/lib/security/api-handler"
import { created, conflict, serverError } from "@/lib/security/response"

export const POST = apiRoute(async (ctx) => {
  const body = await apiBody(registerSchema)(ctx.request)
  if (body.error) return body.error
  const { name, email, password } = body.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return conflict("Email déjà enregistré")

  const editorRole = await prisma.role.findUnique({ where: { name: "Editor" } })
  if (!editorRole) return serverError()

  await prisma.user.create({ data: { name, email, password: await hashPassword(password), roleId: editorRole.id, isActive: false } })
  return created({ message: "Compte créé. En attente d'activation par un administrateur." })
}, { rateLimit: { max: 5, by: "ip" } })
