import { NextResponse } from "next/server"
import { getLeadStats, getLeadSources, getLeadStatusDistribution } from "@/lib/leads/queries"
import { getSession } from "@/lib/auth/session"

export async function GET(_req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const [stats, sources, statusDist] = await Promise.all([
    getLeadStats(),
    getLeadSources(),
    getLeadStatusDistribution(),
  ])
  return NextResponse.json({ ...stats, sources, statusDistribution: statusDist })
}
