import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

const REQUIRED_KEYS = ["HOST", "USER", "PASSWORD", "NAME"] as const

function readVar(key: string): string {
  return process.env[`DB_${key}`] || process.env[`DATABASE_${key}`] || ""
}

function getConfig() {
  const missing: string[] = []
  for (const k of REQUIRED_KEYS) {
    if (!readVar(k)) missing.push(`DB_${k}`)
  }
  if (missing.length > 0) {
    throw new Error(
      `[DB-POOL] Missing required environment variables: ${missing.join(", ")}. ` +
      "Set them in Hostinger Node.js environment panel before deploying.",
    )
  }
  return {
    host: readVar("HOST"),
    user: readVar("USER"),
    password: readVar("PASSWORD"),
    database: readVar("NAME"),
    port: Number(readVar("PORT") || "3306"),
  }
}

export function getPool(): mysql.Pool {
  if (pool) return pool
  const cfg = getConfig()
  pool = mysql.createPool({
    ...cfg,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  })
  return pool
}

export async function testConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const p = getPool()
    await p.execute("SELECT 1 AS alive")
    return { ok: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[DB-POOL] Connection test failed:", message)
    return { ok: false, error: message }
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
