import { NextResponse } from "next/server"
import { getProjectById, updateProject, softDeleteProject, permanentlyDeleteProject, duplicateProject, toggleProjectStatus } from "@/lib/projects/queries"
import { projectSchema } from "@/lib/validations/project"

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProjectById(Number(id))
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(project)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  if (body._action === "duplicate") {
    const dup = await duplicateProject(Number(id))
    return NextResponse.json(dup)
  }

  if (body._action === "toggle") {
    const updated = await toggleProjectStatus(Number(id), body.isActive)
    return NextResponse.json(updated)
  }

  const parsed = projectSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const updated = await updateProject(Number(id), parsed.data as unknown as Record<string, unknown>)
  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({}))
  if (body.permanent) {
    await permanentlyDeleteProject(Number(id))
  } else {
    await softDeleteProject(Number(id))
  }
  return NextResponse.json({ success: true })
}
