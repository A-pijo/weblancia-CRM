import { NextResponse } from "next/server"
import { getLeads, createLead } from "@/lib/leads/queries"
import { leadSchema } from "@/lib/validations/leads"
import { getSession } from "@/lib/auth/session"
import { extractLeadInfo } from "@/lib/leads/tracker"
import { sendEmail } from "@/lib/email"
import { env } from "@/lib/env"

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { searchParams } = new URL(req.url)
  const result = await getLeads({
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    source: searchParams.get("source") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    assignedToId: searchParams.get("assignedToId") ? Number(searchParams.get("assignedToId")) : undefined,
    service: searchParams.get("service") ?? undefined,
    dateFrom: searchParams.get("dateFrom") ?? undefined,
    dateTo: searchParams.get("dateTo") ?? undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    sort: searchParams.get("sort") ?? undefined,
    order: (searchParams.get("order") as "asc" | "desc") ?? undefined,
  })
  return NextResponse.json(result)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const info = extractLeadInfo(req)
    const parsed = leadSchema.safeParse({ ...body, ...info })
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }
    const lead = await createLead(parsed.data as unknown as Record<string, unknown>)
    await sendEmail({ to: env.NOTIFICATION_EMAIL, subject: `[New Lead] ${lead.name} - ${lead.source}`, body: `New lead received:\nName: ${lead.name}\nEmail: ${lead.email}\nSource: ${lead.source}\nMessage: ${lead.message ?? "N/A"}` }).catch(() => {})
    return NextResponse.json(lead, { status: 201 })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
