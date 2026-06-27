import { NextResponse } from "next/server"
import { testConnection } from "@/lib/db-pool"

export async function GET() {
  const app = { ok: true, timestamp: new Date().toISOString() }
  const db = await testConnection()

  return NextResponse.json(
    { app, database: db },
    { status: db.ok ? 200 : 503 },
  )
}
