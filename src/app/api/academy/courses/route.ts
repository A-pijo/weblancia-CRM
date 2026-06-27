import { NextResponse } from "next/server"
import { getCourses, createCourse } from "@/lib/academy/courses/queries"
import { courseSchema } from "@/lib/validations/academy"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const result = await getCourses({
    search: searchParams.get("search") ?? undefined,
    academyCategoryId: searchParams.get("academyCategoryId") ? Number(searchParams.get("academyCategoryId")) : undefined,
    level: searchParams.get("level") ?? undefined,
    isPublished: searchParams.has("isPublished") ? searchParams.get("isPublished") === "true" : undefined,
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
    const parsed = courseSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const item = await createCourse(parsed.data as unknown as Record<string, unknown>)
    return NextResponse.json(item, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
