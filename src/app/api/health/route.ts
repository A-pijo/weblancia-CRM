import { NextResponse } from "next/server"
import { getPool, testConnection, dbDiagnostics } from "@/lib/db-pool"

export async function GET() {
  const app = { ok: true, timestamp: new Date().toISOString() }
  const db = await testConnection()

  let diagnostics: Record<string, unknown> | null = null
  if (db.ok) {
    diagnostics = await dbDiagnostics()
  }

  return NextResponse.json(
    { app, database: db, diagnostics },
    { status: db.ok ? 200 : 503 },
  )
}

export async function POST() {
  const p = getPool()
  const [res] = await p.execute("SELECT DATABASE() AS db")
  const dbName = (res as Record<string, unknown>[])[0]?.db ?? "unknown"
  const [tables] = await p.execute("SHOW TABLES")
  const tableList = (tables as Record<string, unknown>[]).map((r) => Object.values(r)[0])
  const [users] = await p.execute("SELECT COUNT(*) AS c FROM User")
  const userCount = (users as Record<string, unknown>[])[0]?.c ?? 0

  return NextResponse.json({
    database: dbName,
    tables: tableList,
    tableCount: tableList.length,
    userCount,
  })
}
