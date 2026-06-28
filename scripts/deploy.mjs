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
console.log("=== Build: Prisma Client Setup ===")
console.log("")

// 1. Validate DB env vars
const missing = REQUIRED.filter((k) => !readEnv(k))

const hostVal = readEnv("HOST")
if (missing.length > 0) {
  log("env", false, `DB_HOST, DB_USER, DB_NAME not set in environment`)
  console.error("  Set these in Hostinger Node.js env panel for production.")
  console.error("  Local builds use the client from postinstall -- continuing.\n")
}

// 2. Construct DATABASE_URL if not set
if (missing.length === 0) {
  log("env", true, `DB_HOST=${hostVal}, DB_USER=${readEnv("USER")}, DB_NAME=${readEnv("NAME")}`)
  if (!process.env.DATABASE_URL) {
    process.env.DATABASE_URL = constructURL()
    log("DATABASE_URL", true, "constructed from DB_* vars")
  } else {
    log("DATABASE_URL", true, "already set")
  }
}

// 3. prisma generate (non-fatal -- postinstall already ran it)
try {
  log("prisma generate", true, "running...")
  execSync("npx prisma generate", { stdio: "inherit", env: process.env })
  log("prisma generate", true, "ok")
} catch (e) {
  log("prisma generate", false, "engine not available -- using existing client from postinstall")
}

console.log("")
console.log("=== Build: Ready for next build ===")
console.log("")
