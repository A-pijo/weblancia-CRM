// Production database diagnostic
// Run: node scripts/db-diag.mjs

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
    const m = rawUrl.match(/^postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)$/)
    if (m) {
      console.log(`  Protocol: postgresql`)
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

// 3. Connection info for runtime
console.log("\n=== Connection Info ===")
let connHost = "(not set)"
let connPort = 5432
let connUser = "(not set)"
let connPass = ""
let connDb = "(not set)"

if (process.env.DATABASE_URL) {
  try {
    const u = new URL(process.env.DATABASE_URL)
    connHost = u.hostname
    connPort = Number(u.port || "5432")
    connUser = decodeURIComponent(u.username)
    connPass = decodeURIComponent(u.password)
    connDb = u.pathname.replace(/^\//, "")
  } catch (e) {
    console.log(`  (failed to parse DATABASE_URL: ${e.message})`)
  }
} else {
  function readEnv(key) {
    return process.env[`DB_${key}`] || process.env[`DATABASE_${key}`] || ""
  }
  connHost = readEnv("HOST") || "(empty)"
  connUser = readEnv("USER") || "(empty)"
  connPass = readEnv("PASSWORD")
  connDb = readEnv("NAME") || "(empty)"
  connPort = Number(readEnv("PORT") || "5432")
}

console.log(`  host:     ${connHost}`)
console.log(`  user:     ${connUser}`)
console.log(`  password: ${mask(connPass)}`)
console.log(`  database: ${connDb}`)
console.log(`  port:     ${connPort}`)

// 4. Test connection
console.log("\n=== Connection Test ===")
import pg from "pg"

const { Pool } = pg
const hosts = [connHost, "127.0.0.1", "localhost", "::1"]
const tested = new Set()
for (const host of hosts) {
  if (!host || tested.has(host) || host.startsWith("(")) continue
  tested.add(host)
  try {
    const pool = new Pool({
      host,
      user: connUser,
      password: connPass,
      database: connDb,
      port: connPort,
      connectionTimeoutMillis: 5000,
    })
    const r = await pool.query("SELECT 1 AS alive")
    const u = await pool.query('SELECT COUNT(*)::int AS c FROM "User"')
    console.log(`  ${host} -> OK | SELECT 1: ${r.rows[0].alive} | Users: ${u.rows[0].c}`)
    await pool.end()
  } catch (e) {
    console.log(`  ${host} -> FAIL: ${e.message}`)
  }
}

console.log("\n=== Hosts NOT tested (would be helpful on production) ===")
console.log("  If all above fail, try running this script ON the production")
console.log("  server to test the actual production env vars.")
