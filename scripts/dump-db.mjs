import mysql from "mysql2/promise"
import fs from "fs"

async function main() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "weblancia",
    multipleStatements: true,
  })

  const [tables] = await c.execute("SHOW TABLES")
  const lines = [
    "-- Weblancia Production DB Restore",
    "-- Generated: " + new Date().toISOString(),
    "",
    "SET FOREIGN_KEY_CHECKS = 0;",
    "",
  ]

  for (const t of tables) {
    const name = Object.values(t)[0]
    const [create] = await c.execute("SHOW CREATE TABLE `" + name + "`")
    lines.push("DROP TABLE IF EXISTS `" + name + "`;")
    lines.push(create[0]["Create Table"] + ";")
    lines.push("")
  }

  lines.push("SET FOREIGN_KEY_CHECKS = 1;", "")

  for (const t of tables) {
    const name = Object.values(t)[0]
    const [rows] = await c.execute("SELECT COUNT(*) as cnt FROM `" + name + "`")
    if (rows[0].cnt === 0) continue

    const [data] = await c.execute("SELECT * FROM `" + name + "`")
    const cols = Object.keys(data[0])

    for (const row of data) {
      const vals = cols.map((col) => {
        const v = row[col]
        if (v === null) return "NULL"
        if (v instanceof Date) return "'" + v.toISOString().slice(0, 19).replace("T", " ") + "'"
        if (typeof v === "number") return String(v)
        if (typeof v === "object") return "'" + JSON.stringify(v).replace(/'/g, "\\'") + "'"
        return "'" + String(v).replace(/'/g, "\\'") + "'"
      })
      lines.push(
        "INSERT INTO `" + name + "` (`" + cols.join("`, `") + "`) VALUES (" + vals.join(", ") + ");"
      )
    }
    lines.push("")
  }

  fs.writeFileSync("scripts/db-restore.sql", lines.join("\n"), "utf8")
  const kb = (Buffer.byteLength(lines.join("\n"), "utf8") / 1024).toFixed(0)
  console.log("SQL dump created: scripts/db-restore.sql (" + kb + " KB)")
  await c.end()
}

main().catch((e) => {
  console.error("Dump failed:", e)
  process.exit(1)
})
