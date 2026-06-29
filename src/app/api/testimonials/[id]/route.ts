import { NextResponse } from "next/server"
import { getTestimonialById, updateTestimonial, deleteTestimonial, toggleTestimonialStatus } from "@/lib/testimonials/queries"
import { testimonialSchema } from "@/lib/validations/testimonials"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const testimonial = await getTestimonialById(Number(id))
  if (!testimonial) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(testimonial)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  if (body._action === "toggle") {
    const updated = await toggleTestimonialStatus(Number(id), body.isActive)
    return NextResponse.json(updated)
  }
  const parsed = testimonialSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateTestimonial(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteTestimonial(Number(id))
  return NextResponse.json({ success: true })
}
