import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessionById, updateSession, deleteSession } from "@/lib/academy/sessions/queries"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const sessionId = Number(id)
  if (isNaN(sessionId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
  }
  const item = await getSessionById(sessionId)
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

const sessionUpdateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  meetingLink: z.string().max(500).optional(),
  meetingPassword: z.string().max(100).optional(),
  trainer: z.string().max(100).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  timezone: z.string().max(50).optional(),
  maxParticipants: z.number().int().positive().optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sessionId = Number(id)
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const body = await req.json()
    const parsed = sessionUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const data: Record<string, unknown> = { ...parsed.data }
    if (data.startDate) data.startDate = new Date(data.startDate as string)
    if (data.endDate) data.endDate = new Date(data.endDate as string)

    const updated = await updateSession(sessionId, data as any)
    return NextResponse.json(updated)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const sessionId = Number(id)
    if (isNaN(sessionId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }
    await deleteSession(sessionId)
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
