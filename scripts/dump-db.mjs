import pg from "pg"
import fs from "fs"

const { Pool } = pg

function getConnectionString() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL
  const h = process.env.DB_HOST || process.env.DATABASE_HOST || "localhost"
  const u = process.env.DB_USER || process.env.DATABASE_USER || "postgres"
  const p = process.env.DB_PASSWORD || process.env.DATABASE_PASSWORD || "postgres"
  const d = process.env.DB_NAME || process.env.DATABASE_NAME || "weblancia"
  const o = process.env.DB_PORT || process.env.DATABASE_PORT || "5432"
  return `postgresql://${encodeURIComponent(u)}:${encodeURIComponent(p)}@${h}:${o}/${encodeURIComponent(d)}`
}

async function main() {
  const pool = new Pool({ connectionString: getConnectionString() })

  const tablesRes = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = CURRENT_SCHEMA()",
  )
  const tables = tablesRes.rows.map((r) => r.table_name)

  const lines = [
    "-- Weblancia Production DB Restore",
    "-- Generated: " + new Date().toISOString(),
    "",
    "SET session_replication_role = 'replica';",
    "",
  ]

  for (const name of tables) {
    lines.push(`DROP TABLE IF EXISTS "${name}" CASCADE;`)
    lines.push("")
  }

  lines.push("SET session_replication_role = 'origin';", "")

  for (const name of tables) {
    const countRes = await pool.query(`SELECT COUNT(*)::int AS cnt FROM "${name}"`)
    if (countRes.rows[0].cnt === 0) continue

    const dataRes = await pool.query(`SELECT * FROM "${name}"`)
    const rows = dataRes.rows
    const cols = Object.keys(rows[0])

    for (const row of rows) {
      const vals = cols.map((col) => {
        const v = row[col]
        if (v === null) return "NULL"
        if (v instanceof Date) return "'" + v.toISOString().slice(0, 19).replace("T", " ") + "'"
        if (typeof v === "number") return String(v)
        if (typeof v === "object") return "'" + JSON.stringify(v).replace(/'/g, "''") + "'"
        return "'" + String(v).replace(/'/g, "''") + "'"
      })
      lines.push(
        `INSERT INTO "${name}" ("${cols.join('", "')}") VALUES (${vals.join(", ")});`
      )
    }
    lines.push("")
  }

  fs.writeFileSync("scripts/db-restore.sql", lines.join("\n"), "utf8")
  const kb = (Buffer.byteLength(lines.join("\n"), "utf8") / 1024).toFixed(0)
  console.log("SQL dump created: scripts/db-restore.sql (" + kb + " KB)")
  await pool.end()
}

main().catch((e) => {
  console.error("Dump failed:", e)
  process.exit(1)
})
