import { NextResponse } from "next/server"
import { z } from "zod"
import { getSessions, createSession } from "@/lib/academy/sessions/queries"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const courseId = searchParams.get("courseId")

  if (!courseId) {
    return NextResponse.json({ error: "courseId query parameter is required" }, { status: 400 })
  }

  const items = await getSessions(Number(courseId))
  return NextResponse.json({ items })
}

const sessionSchema = z.object({
  courseId: z.number().int().positive(),
  title: z.string().min(1, "Title is required").max(200),
  meetingLink: z.string().max(500).optional(),
  meetingPassword: z.string().max(100).optional(),
  trainer: z.string().max(100).optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  timezone: z.string().max(50).optional(),
  maxParticipants: z.number().int().positive().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = sessionSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const data = {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : undefined,
    }

    const session = await createSession(data)
    return NextResponse.json(session, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
