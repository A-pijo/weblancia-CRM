import { NextResponse } from "next/server"
import { z } from "zod"
import { createRegistration } from "@/lib/academy/registrations/queries"

const registrationSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("Invalid email").max(255),
  phone: z.string().max(50).optional(),
  country: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  company: z.string().max(200).optional(),
  currentLevel: z.string().max(100).optional(),
  preferredSession: z.string().max(200).optional(),
  message: z.string().optional(),
})

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const courseId = Number(id)
    if (isNaN(courseId)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 })
    }

    const body = await req.json()
    const parsed = registrationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const registration = await createRegistration({
      ...parsed.data,
      courseId,
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
