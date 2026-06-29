import { NextResponse } from "next/server"
import { getLeadById, updateLead, deleteLead } from "@/lib/leads/queries"
import { leadSchema } from "@/lib/validations/leads"
import { getSession } from "@/lib/auth/session"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const lead = await getLeadById(Number(id))
  if (!lead) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(lead)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  if (body._action === "status") {
    const { updateLeadStatus } = await import("@/lib/leads/queries")
    const updated = await updateLeadStatus(Number(id), body.status, session.userId)
    return NextResponse.json(updated)
  }
  if (body._action === "assign") {
    const { assignLead } = await import("@/lib/leads/queries")
    const updated = await assignLead(Number(id), body.assignedToId ?? null, session.userId)
    return NextResponse.json(updated)
  }
  const parsed = leadSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateLead(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  await deleteLead(Number(id))
  return NextResponse.json({ success: true })
}
