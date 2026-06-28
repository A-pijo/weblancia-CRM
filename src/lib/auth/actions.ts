"use server"

import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { loginSchema } from "@/lib/validations/auth"
import { verifyPassword } from "./password"
import { signToken, setSessionCookie, removeSessionCookie } from "./session"
import { Role } from "./config"

export async function login(_prev: unknown, formData: FormData) {
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

  const user = await db.user.findUnique({
    where: { email },
    include: { role: true },
  })

  if (!user) {
    return { error: !(process.env.DB_HOST || process.env.DATABASE_HOST) ? "Service de connexion indisponible. Réessayez plus tard." : "Email ou mot de passe incorrect." }
  }
  if (!user.isActive) {
    return { error: "Email ou mot de passe incorrect." }
  }

  const valid = await verifyPassword(password, user.password)
  if (!valid) {
    return { error: "Email ou mot de passe incorrect." }
  }

  const token = await signToken(
    { userId: user.id, email: user.email, name: user.name, role: user.role.name as Role },
    rememberMe,
  )

  await setSessionCookie(token, rememberMe)

  redirect("/admin")
}

export async function logout() {
  await removeSessionCookie()
  redirect("/admin/login")
}
