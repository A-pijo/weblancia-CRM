import { PrismaClient } from "@/generated/prisma/client"
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function readEnv(key: string): string {
  return process.env[`DB_${key}`] || process.env[`DATABASE_${key}`] || ""
}

const REQUIRED_VARS = ["HOST", "USER", "PASSWORD", "NAME"] as const

function validateDbEnv(): boolean {
  const missing = REQUIRED_VARS.filter((k) => !readEnv(k))
  if (missing.length > 0) {
    if (typeof window === "undefined") {
      console.error(
        `[DB] Missing required env vars: ${missing.map((k) => `DB_${k}`).join(", ")}. ` +
        "Database will be unavailable.",
      )
    }
    return false
  }
  return true
}

function createClient(): PrismaClient | undefined {
  if (!validateDbEnv()) return undefined

  try {
    const adapter = new PrismaMariaDb({
      host: readEnv("HOST"),
      user: readEnv("USER"),
      password: readEnv("PASSWORD"),
      database: readEnv("NAME"),
      port: Number(readEnv("PORT") || "3306"),
      connectionLimit: 5,
      connectTimeout: 10000,
      acquireTimeout: 10000,
      idleTimeout: 30000,
    }, {
      onConnectionError(err) {
        console.error("[DB] MariaDB connection error:", err)
      },
    })
    return new PrismaClient({ adapter })
  } catch (err) {
    console.error("[DB] Failed to create PrismaClient:", err)
    return undefined
  }
}

function isConnectionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const name = error.name ?? ""
  const message = error.message ?? ""
  return (
    name === "DriverAdapterError" ||
    message.includes("pool timeout") ||
    message.includes("get a connection from pool") ||
    message.includes("Can't reach database server") ||
    message.includes("Connection refused")
  )
}

const NOOP_FALLBACKS: Record<string, unknown> = {
  findMany: [],
  findFirstOrThrow: [],
  findUnique: null,
  findFirst: null,
  count: 0,
  aggregate: {},
}

function buildDb(client: PrismaClient | undefined): PrismaClient {
  if (!client) {
    return new Proxy({} as PrismaClient, {
      get(_, prop) {
        if (prop === "then" || prop === Symbol.toPrimitive) return undefined
        if (typeof prop === "string" && prop.startsWith("$")) {
          return async () => {}
        }
        return new Proxy(
          {},
          {
            get(_, method) {
              if (method === "then") return undefined
              const fallback = NOOP_FALLBACKS[method as string]
              return async () => fallback ?? null
            },
          }
        )
      },
    })
  }

  return new Proxy(client, {
    get(target, prop) {
      const value = (target as unknown as Record<string, unknown>)[prop as string]
      if (value && typeof value === "object" && typeof prop === "string" && !prop.startsWith("$")) {
        return new Proxy(value as unknown as Record<string, unknown>, {
          get(target2, method) {
            const fn = target2[method as string]
            if (typeof fn !== "function") return fn
            return async (...args: unknown[]) => {
              try {
                return await fn(...args)
              } catch (error) {
                if (isConnectionError(error)) {
                  console.error(`[DB] ${prop}.${String(method)}() failed —`, error)
                  return NOOP_FALLBACKS[method as string] ?? null
                }
                throw error
              }
            }
          },
        })
      }
      if (typeof value === "function") {
        return (...args: unknown[]) => {
          try {
            return value(...args)
          } catch (error) {
            if (isConnectionError(error)) {
              console.error(`[DB] ${String(prop)}() failed —`, error)
              return undefined
            }
            throw error
          }
        }
      }
      return value
    },
  })
}

const client = globalForPrisma.prisma ?? createClient()
export const db = buildDb(client)

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = client
}

export function isDbAvailable(): boolean {
  return REQUIRED_VARS.every((k) => !!readEnv(k))
}

export default db
