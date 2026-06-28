#!/usr/bin/env node

import { execSync } from "child_process"

function log(step, ok, detail = "") {
  const icon = ok ? "PASS" : "FAIL"
  console.log(`[${icon}] ${step}${detail ? ` -- ${detail}` : ""}`)
}

function readEnv(key) {
  return process.env[`DB_${key}`] || process.env[`DATABASE_${key}`] || ""
}

const REQUIRED = ["HOST", "USER", "NAME"]

function constructURL() {
  const h = readEnv("HOST")
  const u = readEnv("USER")
  const p = readEnv("PASSWORD")
  const d = readEnv("NAME")
  const o = readEnv("PORT") || "3306"
  return `mysql://${encodeURIComponent(u)}:${encodeURIComponent(p)}@${h}:${o}/${encodeURIComponent(d)}`
}

console.log("")
console.log("=== Deploy: Database Setup ===")
console.log("")

// 1. Validate DB env vars
const missing = REQUIRED.filter((k) => !readEnv(k))
if (missing.length > 0) {
  log("env", false, `Missing: ${missing.map((k) => `DB_${k}`).join(", ")}`)
  process.exit(1)
}

const hostVal = readEnv("HOST")
if (hostVal === "localhost") {
  log("env", true, `DB_HOST=localhost -- warning: resolves to IPv6 ::1 on Hostinger; use 127.0.0.1`)
} else {
  log("env", true, `DB_HOST=${hostVal}, DB_USER=${readEnv("USER")}, DB_NAME=${readEnv("NAME")}`)
}

// 2. Construct DATABASE_URL if not set
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = constructURL()
  log("DATABASE_URL", true, "constructed from DB_* vars")
} else {
  log("DATABASE_URL", true, "already set")
}

// 3. prisma generate
try {
  log("prisma generate", true, "running...")
  execSync("npx prisma generate", { stdio: "inherit", env: process.env })
  log("prisma generate", true, "ok")
} catch (e) {
  log("prisma generate", false, e.message)
  process.exit(1)
}

// 4. prisma db push
try {
  log("prisma db push", true, "running...")
  execSync("npx prisma db push", { stdio: "inherit", env: process.env })
  log("prisma db push", true, "ok")
} catch (e) {
  log("prisma db push", false, e.message)
  process.exit(1)
}

// 5. SHOW TABLES verification
try {
  const host = readEnv("HOST")
  const user = readEnv("USER")
  const pass = readEnv("PASSWORD")
  const name = readEnv("NAME")
  const port = readEnv("PORT") || "3306"

  const mysql = await import("mysql2/promise")
  const candidates = [host]
  if (host === "localhost") candidates.push("127.0.0.1")

  let verified = false
  let lastError = ""
  for (const h of candidates) {
    try {
      const conn = await mysql.createConnection({ host: h, user, password: pass, database: name, port: Number(port), connectTimeout: 5000 })
      const [rows] = await conn.execute("SHOW TABLES")
      await conn.end()
      const count = rows.length
      if (count === 0) {
        log("SHOW TABLES", false, `0 tables found via host ${h} -- schema push may have failed`)
        process.exit(1)
      }
      log("SHOW TABLES", true, `${count} tables confirmed via ${h}`)
      verified = true
      break
    } catch (e) {
      lastError = e.message
      log("SHOW TABLES", false, `connection failed via ${h}: ${e.message}`)
    }
  }

  if (!verified) {
    if (host === "localhost" && lastError.includes("Access denied")) {
      console.error("")
      console.error("=== HOST FIX ===")
      console.error("DB_HOST=localhost resolves to IPv6 ::1 on Hostinger.")
      console.error("The MySQL user is not granted access from '::1'.")
      console.error("Set DB_HOST=127.0.0.1 in Hostinger Node.js env panel and redeploy.")
      console.error("")
    }
    process.exit(1)
  }
} catch (e) {
  log("SHOW TABLES", false, e.message)
  process.exit(1)
}

console.log("")
console.log("=== Deploy Complete ===")
console.log("")
