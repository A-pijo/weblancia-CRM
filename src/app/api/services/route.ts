import { NextResponse } from "next/server"
import { getServices, createService, getServiceCategories } from "@/lib/services/queries"
import { serviceSchema } from "@/lib/validations/services"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const result = await getServices({
    search: searchParams.get("search") ?? undefined,
    categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
    isActive: searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined,
    isFeatured: searchParams.has("isFeatured") ? searchParams.get("isFeatured") === "true" : undefined,
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
    const parsed = serviceSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const service = await createService(parsed.data as unknown as Record<string, unknown>)
    return NextResponse.json(service, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
