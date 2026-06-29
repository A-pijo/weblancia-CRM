import { NextResponse } from "next/server"
import { updateLeadStatus } from "@/lib/leads/queries"
import { leadStatusSchema } from "@/lib/validations/leads"
import { getSession } from "@/lib/auth/session"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const parsed = leadStatusSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateLeadStatus(Number(id), parsed.data.status, session.userId)
  return NextResponse.json(updated)
}
