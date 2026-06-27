import { NextResponse } from "next/server"
import {
  getNewsletterSubscribers,
  getNewsletterSubscribersCount,
  deleteNewsletterSubscriber,
} from "@/lib/forms/queries"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = Math.max(1, Number(searchParams.get("limit")) || 20)

  const items = await getNewsletterSubscribers({
    search: searchParams.get("search") ?? undefined,
    isActive: searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined,
    page,
    limit,
  })
  const total = await getNewsletterSubscribersCount({
    search: searchParams.get("search") ?? undefined,
    isActive: searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined,
  })

  return NextResponse.json({ items, total, page, totalPages: Math.ceil(total / limit) })
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    if (searchParams.has("id")) {
      await deleteNewsletterSubscriber(Number(searchParams.get("id")))
    } else {
      const body = await req.json()
      await Promise.all(body.ids.map((id: number) => deleteNewsletterSubscriber(id)))
    }
    return NextResponse.json({ success: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
