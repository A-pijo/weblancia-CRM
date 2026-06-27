import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

function getConfig() {
  const host = process.env.DB_HOST || process.env.DATABASE_HOST || ""
  const user = process.env.DB_USER || process.env.DATABASE_USER || ""
  const password = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || ""
  const database = process.env.DB_NAME || process.env.DATABASE_NAME || ""
  const port = Number(process.env.DB_PORT || process.env.DATABASE_PORT || 3306)

  if (!host) console.error("[DB-POOL] DB_HOST is not set")
  if (!user) console.error("[DB-POOL] DB_USER is not set")
  if (!database) console.error("[DB-POOL] DB_NAME is not set")

  return { host, user, password, database, port }
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
