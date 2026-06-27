import { NextResponse } from "next/server"
import { getBlogPostById, updateBlogPost, softDeleteBlogPost, permanentlyDeleteBlogPost, duplicateBlogPost, toggleBlogPostStatus } from "@/lib/blog/queries"
import { blogSchema } from "@/lib/validations/blog"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const post = await getBlogPostById(Number(id))
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(post)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if (body._action === "duplicate") {
    const dup = await duplicateBlogPost(Number(id))
    return NextResponse.json(dup)
  }

  if (body._action === "toggle") {
    const updated = await toggleBlogPostStatus(Number(id), body.isPublished)
    return NextResponse.json(updated)
  }

  const parsed = blogSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateBlogPost(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.permanent) {
    await permanentlyDeleteBlogPost(Number(id))
  } else {
    await softDeleteBlogPost(Number(id))
  }
  return NextResponse.json({ success: true })
}
