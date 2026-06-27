import { NextResponse } from "next/server"
import { getTeamMembers, createTeamMember } from "@/lib/team/queries"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const result = await getTeamMembers({
    isActive: searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined,
    search: searchParams.get("search") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    order: (searchParams.get("order") as "asc" | "desc") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })

  return NextResponse.json(result)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const member = await createTeamMember(body)
    return NextResponse.json(member, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
