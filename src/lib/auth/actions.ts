"use server"

import { redirect } from "next/navigation"
import { headers as getHeaders } from "next/headers"
import { prisma } from "@/lib/database/prisma"
import { loginSchema } from "@/lib/validation/auth"
import { verifyPassword } from "./password"
import { signToken, setSessionCookie, removeSessionCookie } from "./session"
import { Role } from "./config"
import { createAuditLog } from "@/lib/security/audit"
import { rateLimitByIp } from "@/lib/security/rate-limit"

async function getClientInfo() {
  const h = await getHeaders()
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim()
    ?? h.get("cf-connecting-ip")
    ?? "127.0.0.1"
  const userAgent = h.get("user-agent") ?? undefined
  return { ip, userAgent }
}

export async function login(_prev: unknown, formData: FormData) {
  const { ip, userAgent } = await getClientInfo()
  const fakeReq = new Request("http://localhost", {
    headers: { "x-forwarded-for": ip, "user-agent": userAgent ?? "" },
  })

  const rl = await rateLimitByIp(fakeReq, "login", 10)
  if (!rl.allowed) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." }
  }

  const raw = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    rememberMe: formData.get("rememberMe") === "on",
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: "Email ou mot de passe invalide." }
  }

  const { email, password, rememberMe } = parsed.data

  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  })

  if (!user) {
    await createAuditLog({
      action: "LOGIN_FAILED",
      entity: "USER",
      entityId: email,
      description: `Échec de connexion pour ${email} (utilisateur introuvable)`,
      ip, userAgent,
    })
    return { error: "Email ou mot de passe incorrect." }
  }

  if (!user.isActive) {
    await createAuditLog({
      action: "LOGIN_FAILED",
      entity: "USER",
      entityId: user.id,
      description: `Échec de connexion pour ${email} (compte inactif)`,
      userId: user.id,
      ip, userAgent,
    })
    return { error: "Email ou mot de passe incorrect." }
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    await createAuditLog({
      action: "LOGIN_FAILED",
      entity: "USER",
      entityId: user.id,
      description: `Échec de connexion pour ${email} (mot de passe incorrect)`,
      userId: user.id,
      ip, userAgent,
    })
    return { error: "Email ou mot de passe incorrect." }
  }

  const roleName = user.role.name as Role
  const token = await signToken(
    { userId: user.id, email: user.email, name: user.name, role: roleName, version: user.tokenVersion },
    rememberMe,
  )

  await setSessionCookie(token, rememberMe)

  await createAuditLog({
    action: "LOGIN_SUCCESS",
    entity: "USER",
    entityId: user.id,
    description: `Connexion réussie pour ${email}`,
    userId: user.id,
    ip, userAgent,
  })

  redirect("/admin")
}

export async function logout() {
  await removeSessionCookie()
  redirect("/admin/login")
}

export async function revokeAllSessions(userId: number) {
  await prisma.user.update({ where: { id: userId }, data: { tokenVersion: { increment: 1 } } })
  await createAuditLog({ action: "SECURITY_EVENT", entity: "USER", entityId: userId, description: "Toutes les sessions ont été révoquées", userId, ip: "admin", userAgent: "system" })
}
