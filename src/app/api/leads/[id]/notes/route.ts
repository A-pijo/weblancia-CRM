import { NextResponse } from "next/server"
import { addLeadNote, deleteLeadNote } from "@/lib/leads/queries"
import { leadNoteSchema } from "@/lib/validations/leads"
import { getSession } from "@/lib/auth/session"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const parsed = leadNoteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const note = await addLeadNote(Number(id), parsed.data.content, session.userId)
  return NextResponse.json(note, { status: 201 })
}

export async function DELETE(req: Request, { params: _params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const noteId = searchParams.get("noteId")
  if (!noteId) return NextResponse.json({ error: "noteId required" }, { status: 400 })
  await deleteLeadNote(Number(noteId))
  return NextResponse.json({ success: true })
}
