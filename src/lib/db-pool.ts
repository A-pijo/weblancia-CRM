import { Pool } from "pg"

let pool: Pool | null = null

function readVar(key: string): string {
  return process.env[`DB_${key}`] || process.env[`DATABASE_${key}`] || ""
}

function parseDatabaseUrl(url: string) {
  try {
    const u = new URL(url)
    return {
      host: u.hostname,
      port: Number(u.port || "5432"),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ""),
    }
  } catch {
    return null
  }
}

function getConfig() {
  if (process.env.DATABASE_URL) {
    const parsed = parseDatabaseUrl(process.env.DATABASE_URL)
    if (parsed) return parsed
  }

  const missing: string[] = []
  for (const k of ["HOST", "USER", "NAME"] as const) {
    if (!readVar(k)) missing.push(`DB_${k}`)
  }
  if (missing.length > 0) {
    throw new Error(
      `[DB-POOL] Missing DATABASE_URL or ${missing.join(", ")}. ` +
      "Set DATABASE_URL in environment.",
    )
  }

  return {
    host: readVar("HOST"),
    user: readVar("USER"),
    password: readVar("PASSWORD"),
    database: readVar("NAME"),
    port: Number(readVar("PORT") || "5432"),
  }
}

export function getPool(): Pool {
  if (pool) return pool
  const cfg = getConfig()
  pool = new Pool({
    ...cfg,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  })
  return pool
}

export async function testConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const p = getPool()
    await p.query("SELECT 1 AS alive")
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
    const dbRes = await p.query("SELECT CURRENT_DATABASE() AS db")
    const dbName = dbRes.rows[0]?.db ?? "unknown"
    const tablesRes = await p.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = CURRENT_SCHEMA()",
    )
    const tables = tablesRes.rows.map((r) => r.table_name)
    const userRes = await p.query('SELECT COUNT(*)::int AS c FROM "User"')
    const userCnt = userRes.rows[0]?.c ?? 0
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
