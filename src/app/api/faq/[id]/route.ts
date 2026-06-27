import { NextResponse } from "next/server"
import { getFAQById, updateFAQ, deleteFAQ } from "@/lib/faq/queries"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const faq = await getFAQById(Number(id))
  if (!faq) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(faq)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if (body._action === "toggle") {
    const updated = await updateFAQ(Number(id), { isActive: body.isActive })
    return NextResponse.json(updated)
  }

  const updated = await updateFAQ(Number(id), body)
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await deleteFAQ(Number(id))
  return NextResponse.json({ success: true })
}
