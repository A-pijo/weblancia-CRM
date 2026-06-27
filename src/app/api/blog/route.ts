import { NextResponse } from "next/server"
import { getBlogPosts, createBlogPost, getBlogCategories } from "@/lib/blog/queries"
import { blogSchema } from "@/lib/validations/blog"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const result = await getBlogPosts({
    search: searchParams.get("search") ?? undefined,
    categoryId: searchParams.get("categoryId") ? Number(searchParams.get("categoryId")) : undefined,
    isPublished: searchParams.has("isPublished") ? searchParams.get("isPublished") === "true" : undefined,
    isFeatured: searchParams.has("isFeatured") ? searchParams.get("isFeatured") === "true" : undefined,
    sort: searchParams.get("sort") ?? undefined,
    order: (searchParams.get("order") as "asc" | "desc") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })

  return NextResponse.json(result)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = blogSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const post = await createBlogPost(parsed.data as unknown as Record<string, unknown>)
    return NextResponse.json(post, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
