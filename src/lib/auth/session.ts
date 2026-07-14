import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { prisma } from "@/lib/database/prisma"
import { AUTH, type SessionPayload } from "./config"

function getSecret(): Uint8Array {
  return new TextEncoder().encode(AUTH.jwtSecret)
}

export async function signToken(payload: SessionPayload, rememberMe: boolean): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: AUTH.jwtAlgorithm })
    .setIssuedAt()
    .setIssuer(AUTH.jwtIssuer)
    .setAudience(AUTH.jwtAudience)
    .setExpirationTime(rememberMe ? AUTH.expiresLong : AUTH.expiresShort)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: AUTH.jwtIssuer,
      audience: AUTH.jwtAudience,
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function verifyTokenWithRevocationCheck(token: string): Promise<SessionPayload | null> {
  const payload = await verifyToken(token)
  if (!payload) return null

  if (payload.version !== undefined) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { tokenVersion: true, isActive: true },
      })
      if (!user || !user.isActive) return null
      if (user.tokenVersion !== payload.version) return null
    } catch {
      return null
    }
  }

  return payload
}

export async function setSessionCookie(token: string, rememberMe: boolean): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH.sessionCookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: rememberMe ? AUTH.expiresLongMs / 1000 : AUTH.expiresShortMs / 1000,
    path: "/",
  })
}

export async function removeSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(AUTH.sessionCookieName, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH.sessionCookieName)?.value
  if (!token) return null
  return verifyTokenWithRevocationCheck(token)
}
