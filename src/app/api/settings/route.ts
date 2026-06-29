import { NextResponse } from "next/server"
import { getAllSettings, upsertSettings } from "@/lib/settings"

export async function GET() {
  const settings = await getAllSettings()
  return NextResponse.json({ success: true, settings })
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const settings = await upsertSettings(body)
    return NextResponse.json({ success: true, settings })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
