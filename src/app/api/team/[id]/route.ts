import { NextResponse } from "next/server"
import { getTeamMemberById, updateTeamMember, deleteTeamMember } from "@/lib/team/queries"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await getTeamMemberById(Number(id))
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(member)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if (body._action === "toggle") {
    const updated = await updateTeamMember(Number(id), { isActive: body.isActive })
    return NextResponse.json(updated)
  }

  const updated = await updateTeamMember(Number(id), body)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteTeamMember(Number(id))
  return NextResponse.json({ success: true })
}
