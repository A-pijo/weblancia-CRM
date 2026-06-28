import { NextResponse } from "next/server"
import { getPool, testConnection, dbDiagnostics } from "@/lib/db-pool"

export async function GET() {
  const app = { ok: true, timestamp: new Date().toISOString() }
  const db = await testConnection()

  let databaseName: string | null = null
  let tableCount = 0
  let userCount = 0

  if (db.ok) {
    const d = await dbDiagnostics()
    databaseName = d.database as string
    tableCount = d.tableCount as number
    userCount = d.userCount as number
  }

  return NextResponse.json(
    { app, database: db, databaseName, tableCount, userCount },
    { status: db.ok ? 200 : 503 },
  )
}

export async function POST() {
  const p = getPool()
  const dbRes = await p.query("SELECT CURRENT_DATABASE() AS db")
  const dbName = dbRes.rows[0]?.db ?? "unknown"
  const tablesRes = await p.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = CURRENT_SCHEMA()",
  )
  const tableList = tablesRes.rows.map((r) => r.table_name)
  const usersRes = await p.query('SELECT COUNT(*)::int AS c FROM "User"')
  const userCount = usersRes.rows[0]?.c ?? 0

  return NextResponse.json({
    database: dbName,
    tables: tableList,
    tableCount: tableList.length,
    userCount,
  })
}
