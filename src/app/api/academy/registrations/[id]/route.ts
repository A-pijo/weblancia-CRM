import { NextResponse } from "next/server"
import { deleteRegistration } from "@/lib/academy/registrations/queries"

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const registrationId = Number(id)
    if (isNaN(registrationId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    await deleteRegistration(registrationId)
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
