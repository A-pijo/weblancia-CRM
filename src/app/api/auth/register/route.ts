import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth/password"
import { registerSchema } from "@/lib/validations/auth"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const editorRole = await db.role.findUnique({ where: { name: "Editor" } })
    if (!editorRole) {
      return NextResponse.json({ error: "Registration unavailable" }, { status: 500 })
    }

    const hashed = await hashPassword(password)
    const user = await db.user.create({
      data: { name, email, password: hashed, roleId: editorRole.id, isActive: false },
    })

    return NextResponse.json({ success: true, message: "Account created. Awaiting admin activation." }, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
