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
  const o = readEnv("PORT") || "5432"
  return `postgresql://${encodeURIComponent(u)}:${encodeURIComponent(p)}@${h}:${o}/${encodeURIComponent(d)}`
}

console.log("")
console.log("=== Build: Prisma Client Setup ===")
console.log("")

// 1. Set DATABASE_URL (prefer existing, fall back to DB_* construction)
const hasDbUrl = !!process.env.DATABASE_URL
if (!hasDbUrl) {
  const missing = REQUIRED.filter((k) => !readEnv(k))
  if (missing.length === 0) {
    process.env.DATABASE_URL = constructURL()
    log("DATABASE_URL", true, "constructed from DB_* vars")
  } else {
    log("DATABASE_URL", false, "not set — prisma generate will use postinstall client")
  }
} else {
  log("DATABASE_URL", true, "already set")
}

// 2. prisma generate (non-fatal — postinstall already ran it)
try {
  log("prisma generate", true, "running...")
  execSync("npx prisma generate", { stdio: "inherit", env: process.env })
  log("prisma generate", true, "ok")
} catch (e) {
  log("prisma generate", false, "engine not available — using existing client from postinstall")
}

console.log("")
console.log("=== Build: Ready for next build ===")
console.log("")
