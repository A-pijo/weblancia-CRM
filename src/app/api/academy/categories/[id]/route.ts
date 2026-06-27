import { NextResponse } from "next/server"
import { getAcademyCategoryById, updateAcademyCategory, deleteAcademyCategory, permanentlyDeleteAcademyCategory } from "@/lib/academy/categories/queries"
import { academyCategorySchema } from "@/lib/validations/academy"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const item = await getAcademyCategoryById(Number(id))
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(item)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const parsed = academyCategorySchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateAcademyCategory(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.permanent) {
    await permanentlyDeleteAcademyCategory(Number(id))
  } else {
    await deleteAcademyCategory(Number(id))
  }
  return NextResponse.json({ success: true })
}
