import { NextResponse } from "next/server"
import { getCourseById, updateCourse, softDeleteCourse, permanentlyDeleteCourse, duplicateCourse, toggleCourseStatus } from "@/lib/academy/courses/queries"
import { courseSchema } from "@/lib/validations/academy"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getCourseById(Number(id))
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if (body._action === "duplicate") {
    const dup = await duplicateCourse(Number(id))
    return NextResponse.json(dup)
  }

  if (body._action === "toggle") {
    const updated = await toggleCourseStatus(Number(id), body.isPublished)
    return NextResponse.json(updated)
  }

  const parsed = courseSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateCourse(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.permanent) {
    await permanentlyDeleteCourse(Number(id))
  } else {
    await softDeleteCourse(Number(id))
  }
  return NextResponse.json({ success: true })
}
