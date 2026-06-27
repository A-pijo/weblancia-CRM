import { NextResponse } from "next/server"
import { globalSearch } from "@/lib/search/engine"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get("q")

  if (q) {
    const results = await globalSearch(q)
    return NextResponse.json({ items: results })
  }

  return NextResponse.json({ items: [] })
}
