import { NextResponse } from "next/server"
import { getWorkshopById, updateWorkshop, softDeleteWorkshop, permanentlyDeleteWorkshop, duplicateWorkshop, toggleWorkshopStatus } from "@/lib/academy/workshops/queries"
import { workshopSchema } from "@/lib/validations/academy"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getWorkshopById(Number(id))
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if (body._action === "duplicate") {
    const dup = await duplicateWorkshop(Number(id))
    return NextResponse.json(dup)
  }

  if (body._action === "toggle") {
    const updated = await toggleWorkshopStatus(Number(id), body.isPublished)
    return NextResponse.json(updated)
  }

  const parsed = workshopSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateWorkshop(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.permanent) {
    await permanentlyDeleteWorkshop(Number(id))
  } else {
    await softDeleteWorkshop(Number(id))
  }
  return NextResponse.json({ success: true })
}
