import { NextResponse } from "next/server"
import { getServiceById, updateService, softDeleteService, permanentlyDeleteService, duplicateService, toggleServiceStatus } from "@/lib/services/queries"
import { serviceSchema } from "@/lib/validations/services"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await getServiceById(Number(id))
  if (!service) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(service)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if (body._action === "duplicate") {
    const dup = await duplicateService(Number(id))
    return NextResponse.json(dup)
  }

  if (body._action === "toggle") {
    const updated = await toggleServiceStatus(Number(id), body.isActive)
    return NextResponse.json(updated)
  }

  const parsed = serviceSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateService(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.permanent) {
    await permanentlyDeleteService(Number(id))
  } else {
    await softDeleteService(Number(id))
  }
  return NextResponse.json({ success: true })
}
