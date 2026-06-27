import { NextResponse } from "next/server"
import {
  getProjectRequests,
  getProjectRequestsCount,
  markProjectRead,
  deleteProjectRequest,
} from "@/lib/forms/queries"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || 20)

  const items = await getProjectRequests({
    search: searchParams.get("search") ?? undefined,
    isRead: searchParams.has("isRead") ? searchParams.get("isRead") === "true" : undefined,
    page,
    limit,
  })
  const total = await getProjectRequestsCount({
    search: searchParams.get("search") ?? undefined,
    isRead: searchParams.has("isRead") ? searchParams.get("isRead") === "true" : undefined,
  })

  return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit) })
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    if (body.action !== "read") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
    await markProjectRead(Number(body.id))
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    if (searchParams.has("id")) {
      await deleteProjectRequest(Number(searchParams.get("id")))
    } else {
      const body = await req.json()
      await Promise.all(body.ids.map((id: number) => deleteProjectRequest(id)))
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
