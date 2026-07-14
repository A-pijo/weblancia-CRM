import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { prisma } from "@/lib/database/prisma"
import { AUTH, type SessionPayload } from "./config"

function getSecret(): Uint8Array {
  const secret = AUTH.jwtSecret
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: SessionPayload, rememberMe: boolean): Promise<string> {
  try {
    const token = await new SignJWT({ ...payload })
      .setProtectedHeader({ alg: AUTH.jwtAlgorithm })
      .setIssuedAt()
      .setIssuer(AUTH.jwtIssuer)
      .setAudience(AUTH.jwtAudience)
      .setExpirationTime(rememberMe ? AUTH.expiresLong : AUTH.expiresShort)
      .sign(getSecret())
    return token
  } catch (err) {
    throw err
  }
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: AUTH.jwtIssuer,
      audience: AUTH.jwtAudience,
    })
    const sp = payload as unknown as SessionPayload
    return sp
  } catch (err) {
    return null
  }
}

export async function verifyTokenWithRevocationCheck(token: string): Promise<SessionPayload | null> {
  const payload = await verifyToken(token)
  if (!payload) {
    return null
  }

  if (payload.version !== undefined) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: { tokenVersion: true, isActive: true },
      })
      if (!user || !user.isActive) {
        return null
      }
      if (user.tokenVersion !== payload.version) {
        return null
      }
    } catch (err) {
      return null
    }
  }

  return payload
}

export async function setSessionCookie(token: string, rememberMe: boolean): Promise<void> {
  try {
    const cookieStore = await cookies()
    const maxAge = rememberMe ? AUTH.expiresLongMs / 1000 : AUTH.expiresShortMs / 1000
    cookieStore.set(AUTH.sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge,
      path: "/",
    })
  } catch (err) {
    throw err
  }
}

export async function removeSessionCookie(): Promise<void> {
  try {
    const cookieStore = await cookies()
    cookieStore.set(AUTH.sessionCookieName, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    })
  } catch (err) {
    throw err
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(AUTH.sessionCookieName)?.value
    if (!token) {
      return null
    }
    const result = await verifyTokenWithRevocationCheck(token)
    return result
  } catch (err) {
    return null
  }
}
