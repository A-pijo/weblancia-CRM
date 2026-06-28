// Production database diagnostic
// Run on Hostinger: node scripts/db-diag.mjs

function mask(s) {
  if (!s || s.length === 0) return "(empty)"
  if (s.length <= 4) return "****"
  return s.slice(0, 2) + "****" + s.slice(-2)
}

// 1. Read ALL env var sources
console.log("=== Environment Variables ===")
const vars = ["DATABASE_URL", "DATABASE_HOST", "DATABASE_PORT", "DATABASE_NAME", "DATABASE_USER",
  "DATABASE_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME", "DB_USER", "DB_PASSWORD"]
for (const v of vars) {
  const val = process.env[v] || "(not set)"
  const display = v.toLowerCase().includes("password") ? mask(val) : val
  console.log(`  ${v} = ${display}`)
}

// 2. Decode DATABASE_URL
console.log("\n=== DATABASE_URL Decoded ===")
const rawUrl = process.env.DATABASE_URL || process.env.DB_URL || "(not set)"
if (rawUrl !== "(not set)") {
  try {
    const m = rawUrl.match(/^mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/)
    if (m) {
      console.log(`  Protocol: mysql`)
      console.log(`  User:     ${m[1]}`)
      console.log(`  Password: ${mask(m[2])}`)
      console.log(`  Host:     ${m[3]}`)
      console.log(`  Port:     ${m[4]}`)
      console.log(`  Database: ${m[5]}`)
    } else {
      console.log("  (unable to parse)")
    }
  } catch (e) {
    console.log(`  Error: ${e.message}`)
  }
}

// 3. What the runtime code actually reads
console.log("\n=== Runtime Read (src/lib/db.ts) ===")
function readEnv(key) {
  return process.env[`DB_${key}`] || process.env[`DATABASE_${key}`] || ""
}
const runtime = {
  HOST: readEnv("HOST") || "(empty — will fail validation)",
  USER: readEnv("USER") || "(empty — will fail validation)",
  PASSWORD: readEnv("PASSWORD"),
  NAME: readEnv("NAME") || "(empty — will fail validation)",
  PORT: Number(readEnv("PORT") || "3306"),
}
console.log(`  host:     ${runtime.HOST}`)
console.log(`  user:     ${runtime.USER}`)
console.log(`  password: ${mask(runtime.PASSWORD)}`)
console.log(`  database: ${runtime.NAME}`)
console.log(`  port:     ${runtime.PORT}`)

// 4. Test connection
console.log("\n=== Connection Test ===")
import mysql from "mysql2/promise"

const hosts = [runtime.HOST, "127.0.0.1", "localhost", "::1"]
const tested = new Set()
for (const host of hosts) {
  if (!host || tested.has(host)) continue
  tested.add(host)
  try {
    const c = await mysql.createConnection({
      host,
      user: runtime.USER,
      password: runtime.PASSWORD,
      database: runtime.NAME,
      port: runtime.PORT,
      connectTimeout: 5000,
    })
    const [r] = await c.execute("SELECT 1 AS alive")
    const [u] = await c.execute("SELECT COUNT(*) AS c FROM User")
    console.log(`  ${host} -> OK | SELECT 1: ${r[0].alive} | Users: ${u[0].c}`)
    await c.end()
  } catch (e) {
    console.log(`  ${host} -> FAIL: ${e.message}`)
  }
}

console.log("\n=== Hosts NOT tested (would be helpful on Hostinger) ===")
console.log("  If all above fail, try running this script ON the Hostinger")
console.log("  server to test the actual production env vars.")
