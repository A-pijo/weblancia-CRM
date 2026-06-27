import { NextResponse } from "next/server"
import { z } from "zod"
import { getRegistrations, updateRegistrationStatus } from "@/lib/academy/registrations/queries"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const result = await getRegistrations({
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    courseId: searchParams.get("courseId") ? Number(searchParams.get("courseId")) : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })

  return NextResponse.json(result)
}

const statusSchema = z.object({
  id: z.number().int().positive(),
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
})

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const parsed = statusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const updated = await updateRegistrationStatus(parsed.data.id, parsed.data.status)
    return NextResponse.json(updated)
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
