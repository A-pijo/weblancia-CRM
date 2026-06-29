import { NextResponse } from "next/server"
import { getUserById, updateUser, deleteUser, toggleUserStatus } from "@/lib/users/queries"
import { userSchema } from "@/lib/validations/users"
import { getSession } from "@/lib/auth/session"
import { Role } from "@/lib/auth/config"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== Role.SuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  const user = await getUserById(Number(id))
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const { password: _pw, ...safe } = user
  return NextResponse.json(safe)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== Role.SuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  const body = await req.json()
  if (body._action === "toggle") {
    const updated = await toggleUserStatus(Number(id), body.isActive)
    return NextResponse.json(updated)
  }
  const parsed = userSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateUser(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || session.role !== Role.SuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { id } = await params
  await deleteUser(Number(id))
  return NextResponse.json({ success: true })
}
