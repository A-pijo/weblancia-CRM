import { NextResponse } from "next/server"
import { getMediaList, uploadFile, createMediaRecord, MEDIA_CATEGORIES } from "@/lib/media/upload"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const result = await getMediaList({
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    mimeType: searchParams.get("mimeType") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    order: (searchParams.get("order") as "asc" | "desc") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
  })

  return NextResponse.json(result)
}

export async function POST(req: Request) {
  const formData = await req.formData()
  const files = formData.getAll("files") as File[]
  const category = (formData.get("category") as string) || "general"

  if (!files.length) {
    return NextResponse.json({ error: "Aucun fichier fourni." }, { status: 400 })
  }

  const results = []
  const errors: { filename: string; error: string }[] = []

  for (const file of files) {
    try {
      const uploadResult = await uploadFile(file, category)
      const record = await createMediaRecord(uploadResult)
      results.push(record)
    } catch (e) {
      errors.push({ filename: file.name, error: e instanceof Error ? e.message : "Erreur inconnue" })
    }
  }

  return NextResponse.json({ items: results, errors })
}
