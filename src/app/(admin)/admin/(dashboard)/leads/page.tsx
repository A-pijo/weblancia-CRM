"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { AdminErrorState } from "@/components/admin/error-state"
import { cn } from "@/lib/utils/cn"
import { LEAD_STATUSES } from "@/lib/validation/leads"
import { logger } from "@/lib/logger"

interface Lead {
  id: number; name: string; company: string | null; email: string | null; phone: string | null
  source: string; service: string | null; status: string; assignedTo: { id: number; name: string } | null
  country: string | null; createdAt: string
}

interface LeadStats {
  total: number; newLeads: number; contacted: number; won: number; lost: number
  conversionRate: number; thisMonth: number; recent: { id: number; name: string; email: string | null; source: string; status: string; createdAt: string }[]
}

export default function AdminLeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState<Lead[]>([])
  const [stats, setStats] = useState<LeadStats | null>(null)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [sourceFilter, setSourceFilter] = useState("")
  const [sort, setSort] = useState("createdAt")
  const [order, setOrder] = useState<"asc" | "desc">("desc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (statusFilter) params.set("status", statusFilter)
    if (sourceFilter) params.set("source", sourceFilter)
    params.set("page", String(page))
    params.set("limit", "20")
    params.set("sort", sort)
    params.set("order", order)
    const res = await fetch(`/api/leads?${params}`)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const msg = body?.error?.message ?? "Impossible de charger les leads."
      logger.error(msg, { status: res.status }, "admin")
      setError(msg)
      setLoading(false)
      return
    }
    const data = await res.json()
    setLeads(data.items ?? [])
    setTotal(data.total ?? 0)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }, [search, statusFilter, sourceFilter, page, sort, order])

  const fetchStats = useCallback(async () => {
    const res = await fetch("/api/leads/stats")
    if (res.ok) setStats(await res.json())
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])
  useEffect(() => { fetchStats() }, [fetchStats])

  const toggleSort = (field: string) => {
    if (sort === field) setOrder(order === "asc" ? "desc" : "asc")
    else { setSort(field); setOrder("desc") }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this lead?")) return
    await fetch(`/api/leads/${id}`, { method: "DELETE" })
    fetchLeads(); fetchStats()
  }

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/leads/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "status", status }) })
    fetchLeads(); fetchStats()
  }

  const statusColors: Record<string, string> = { New: "bg-blue-500/10 text-blue-400", Contacted: "bg-yellow-500/10 text-yellow-400", Qualified: "bg-purple-500/10 text-purple-400", "Proposal Sent": "bg-cyan-500/10 text-cyan-400", Won: "bg-green-500/10 text-green-400", Lost: "bg-red-500/10 text-red-400", Spam: "bg-gray-500/10 text-gray-400" }

  if (loading && leads.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Leads CRM" description="Loading..." />
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-admin-surface/40 rounded-xl p-3 h-16" />
            ))}
          </div>
          <div className="bg-admin-surface/40 rounded-xl h-64" />
        </div>
      </div>
    )
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={fetchLeads} fullPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Leads CRM" description={`${total} total leads`} />

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Total", value: stats.total, color: "text-white" },
            { label: "New", value: stats.newLeads, color: "text-blue-400" },
            { label: "Contacted", value: stats.contacted, color: "text-yellow-400" },
            { label: "Won", value: stats.won, color: "text-green-400" },
            { label: "Lost", value: stats.lost, color: "text-red-400" },
            { label: "Conv. Rate", value: `${stats.conversionRate}%`, color: "text-cyan-400" },
            { label: "This Month", value: stats.thisMonth, color: "text-purple-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#141414] border border-admin-border/30 rounded-xl p-3">
              <p className={cn("text-lg font-bold", s.color)}>{s.value}</p>
              <p className="text-xs text-admin-text-tertiary mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-secondary"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} placeholder="Search name, email, company, phone..." className="w-full h-9 pl-9 pr-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
          <option value="">All Status</option>
          {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sourceFilter} onChange={(e) => { setSourceFilter(e.target.value); setPage(1) }} className="h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
          <option value="">All Sources</option>
          <option value="contact">Contact</option>
          <option value="consultation">Consultation</option>
          <option value="quote">Quote</option>
          <option value="newsletter">Newsletter</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-admin-border/50 bg-[#141414]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border/30">
              {["Name", "Company", "Email", "Phone", "Country", "Source", "Service", "Status", "Assigned", "Date", ""].map((h) => (
                <th key={h} className={cn("text-left font-medium text-admin-text-secondary py-3 px-3", h === "Assigned" || h === "Country" || h === "Service" ? "hidden lg:table-cell" : "", h === "Email" || h === "Phone" ? "hidden md:table-cell" : "")}>
                  {h === "Date" ? (
                    <button onClick={() => toggleSort("createdAt")} className="flex items-center gap-1 hover:text-admin-text-primary transition-colors">
                      Date {sort === "createdAt" && (order === "asc" ? "↑" : "↓")}
                    </button>
                  ) : h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b border-admin-border/20 hover:bg-admin-surface/20 transition-colors">
                <td className="px-3 py-3">
                  <button onClick={() => router.push(`/admin/leads/${lead.id}`)} className="text-admin-text-primary hover:text-admin-accent transition-colors text-left font-medium">{lead.name}</button>
                </td>
                <td className="px-3 py-3 text-admin-text-secondary text-xs">{lead.company ?? "—"}</td>
                <td className="px-3 py-3 hidden md:table-cell text-admin-text-secondary text-xs">{lead.email ?? "—"}</td>
                <td className="px-3 py-3 hidden md:table-cell text-admin-text-secondary text-xs">{lead.phone ?? "—"}</td>
                <td className="px-3 py-3 hidden lg:table-cell text-admin-text-secondary text-xs">{lead.country ?? "—"}</td>
                <td className="px-3 py-3"><span className="text-xs bg-admin-surface px-2 py-0.5 rounded-full text-admin-text-secondary capitalize">{lead.source}</span></td>
                <td className="px-3 py-3 hidden lg:table-cell text-admin-text-secondary text-xs">{lead.service ?? "—"}</td>
                <td className="px-3 py-3">
                  <select value={lead.status} onChange={(e) => handleStatusChange(lead.id, e.target.value)} className={cn("text-xs px-2 py-1 rounded-full border-0 font-medium outline-none cursor-pointer", statusColors[lead.status] ?? "bg-admin-surface text-admin-text-secondary")}>
                    {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-3 py-3 hidden lg:table-cell text-admin-text-secondary text-xs">{lead.assignedTo?.name ?? "—"}</td>
                <td className="px-3 py-3 text-admin-text-tertiary text-xs whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => router.push(`/admin/leads/${lead.id}`)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors" title="View">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>
                    <button type="button" onClick={() => handleDelete(lead.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr><td colSpan={11} className="px-3 py-12 text-center text-admin-text-secondary text-sm">No leads found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-admin-text-tertiary">{total} leads total</p>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Previous</button>
            <span className="text-xs text-admin-text-tertiary px-2">Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
