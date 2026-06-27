import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { deleteFile } from "@/lib/media/upload"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await db.media.findUnique({ where: { id: Number(id) } })
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const allowed = ["alt", "title", "caption", "category", "filename"]
  const data: Record<string, unknown> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) data[key] = body[key]
  }
  const item = await db.media.update({ where: { id: Number(id) }, data })
  return NextResponse.json(item)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await db.media.findUnique({ where: { id: Number(id) } })
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await deleteFile(item.url)
  await db.media.delete({ where: { id: Number(id) } })

  return NextResponse.json({ success: true })
}
