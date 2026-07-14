import { getPool, testConnection, dbDiagnostics } from "@/lib/db-pool"
import { apiRoute } from "@/lib/security/api-handler"
import { success, serverError } from "@/lib/security/response"

export const GET = apiRoute(async () => {
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

  return success({ app, database: db, databaseName, tableCount, userCount })
})

export const POST = apiRoute(async () => {
  const p = getPool()
  const dbRes = await p.query("SELECT CURRENT_DATABASE() AS db")
  const dbName = dbRes.rows[0]?.db ?? "unknown"
  const tablesRes = await p.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = CURRENT_SCHEMA()",
  )
  const tableList = tablesRes.rows.map((r) => r.table_name)
  const usersRes = await p.query('SELECT COUNT(*)::int AS c FROM "User"')
  const userCount = usersRes.rows[0]?.c ?? 0

  return success({
    database: dbName,
    tables: tableList,
    tableCount: tableList.length,
    userCount,
  })
})
