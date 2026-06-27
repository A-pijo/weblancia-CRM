import { NextResponse } from "next/server"
import { getAcademyCategories, createAcademyCategory } from "@/lib/academy/categories/queries"
import { academyCategorySchema } from "@/lib/validations/academy"

export async function GET() {
  const items = await getAcademyCategories()
  return NextResponse.json({ items, total: items.length, page: 1, totalPages: 1 })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = academyCategorySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const item = await createAcademyCategory(parsed.data as unknown as Record<string, unknown>)
    return NextResponse.json(item, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
