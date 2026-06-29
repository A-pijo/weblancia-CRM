import { NextResponse } from "next/server"
import { getUsers, createUser, getRoles } from "@/lib/users/queries"
import { userSchema } from "@/lib/validations/users"
import { getSession } from "@/lib/auth/session"
import { Role } from "@/lib/auth/config"

export async function GET(req: Request) {
  const session = await getSession()
  if (!session || session.role !== Role.SuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const { searchParams } = new URL(req.url)
  if (searchParams.get("roles")) {
    const roles = await getRoles()
    return NextResponse.json(roles)
  }
  const result = await getUsers({
    search: searchParams.get("search") ?? undefined,
    isActive: searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const session = await getSession()
  if (!session || session.role !== Role.SuperAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const parsed = userSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const user = await createUser(parsed.data as unknown as Record<string, unknown>)
    return NextResponse.json(user, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
