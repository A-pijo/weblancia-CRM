import { NextResponse } from "next/server"
import { getTestimonials, createTestimonial } from "@/lib/testimonials/queries"
import { testimonialSchema } from "@/lib/validations/testimonials"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const result = await getTestimonials({
    search: searchParams.get("search") ?? undefined,
    isActive: searchParams.has("isActive") ? searchParams.get("isActive") === "true" : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = testimonialSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const testimonial = await createTestimonial(parsed.data as unknown as Record<string, unknown>)
    return NextResponse.json(testimonial, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
