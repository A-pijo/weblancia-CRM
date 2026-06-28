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

export async function dbDiagnostics(): Promise<Record<string, unknown>> {
  try {
    const p = getPool()
    const [dbRes] = await p.execute("SELECT DATABASE() AS db")
    const dbName = (dbRes as Record<string, unknown>[])[0]?.db ?? "unknown"
    const [tablesRes] = await p.execute("SHOW TABLES")
    const tables = (tablesRes as Record<string, unknown>[]).map((r) => Object.values(r)[0])
    const [userCount] = await p.execute("SELECT COUNT(*) AS c FROM User")
    const userCnt = (userCount as Record<string, unknown>[])[0]?.c ?? 0
    return { database: dbName, tables, tableCount: tables.length, userCount: userCnt }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return { error: message }
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
