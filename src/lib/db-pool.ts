import mysql from "mysql2/promise"

let pool: mysql.Pool | null = null

function getConfig() {
  return {
    host: process.env.DB_HOST || process.env.DATABASE_HOST || "localhost",
    user: process.env.DB_USER || process.env.DATABASE_USER || "root",
    password: process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || "",
    database: process.env.DB_NAME || process.env.DATABASE_NAME || "weblancia",
    port: Number(process.env.DB_PORT || process.env.DATABASE_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
  }
}

export function getPool(): mysql.Pool {
  if (pool) return pool
  pool = mysql.createPool(getConfig())
  return pool
}

export async function testConnection(): Promise<boolean> {
  try {
    const p = getPool()
    await p.execute("SELECT 1")
    return true
  } catch {
    return false
  }
}

export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end()
    pool = null
  }
}
