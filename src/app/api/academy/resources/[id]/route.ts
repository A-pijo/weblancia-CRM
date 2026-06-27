import { NextResponse } from "next/server"
import { getResourceById, updateResource, softDeleteResource, permanentlyDeleteResource, duplicateResource, toggleResourceStatus } from "@/lib/academy/resources/queries"
import { resourceSchema } from "@/lib/validations/academy"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getResourceById(Number(id))
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if (body._action === "duplicate") {
    const dup = await duplicateResource(Number(id))
    return NextResponse.json(dup)
  }

  if (body._action === "toggle") {
    const updated = await toggleResourceStatus(Number(id), body.isPublished)
    return NextResponse.json(updated)
  }

  const parsed = resourceSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateResource(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.permanent) {
    await permanentlyDeleteResource(Number(id))
  } else {
    await softDeleteResource(Number(id))
  }
  return NextResponse.json({ success: true })
}
