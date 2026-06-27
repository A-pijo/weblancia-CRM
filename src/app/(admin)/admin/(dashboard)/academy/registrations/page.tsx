"use client"

import { useState, useEffect, useCallback } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { cn } from "@/lib/utils/cn"

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-admin-warning/10 text-admin-warning",
  confirmed: "bg-admin-success/10 text-admin-success",
  cancelled: "bg-admin-danger/10 text-admin-danger",
  completed: "bg-blue-500/10 text-blue-400",
}

export default function AdminRegistrationsPage() {
  const [items, setItems] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (status) params.set("status", status)
    params.set("page", String(page))
    params.set("limit", "20")
    const res = await fetch(`/api/academy/registrations?${params}`)
    const data = await res.json()
    setItems(data.items ?? [])
    setTotal(data.total ?? 0)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }, [search, status, page])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    await fetch("/api/academy/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    })
    fetchItems()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this registration?")) return
    await fetch(`/api/academy/registrations/${id}`, { method: "DELETE" })
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Registrations" description={`${total} registration${total === 1 ? "" : "s"} total`} />

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-secondary">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            placeholder="Search by name, email, or company..."
            className="w-full h-9 pl-9 pr-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
          />
        </div>
        <select
          value={status ?? ""}
          onChange={(e) => { setStatus(e.target.value || null); setPage(1) }}
          className="h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-admin-border/50 bg-[#141414]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border/30">
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3">Name</th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden sm:table-cell">Email</th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden md:table-cell">Course</th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden lg:table-cell">Date</th>
              <th className="text-center font-medium text-admin-text-secondary py-3 px-3">Status</th>
              <th className="text-right font-medium text-admin-text-secondary py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((reg) => (
              <tr key={reg.id} className="border-b border-admin-border/20 hover:bg-admin-surface/20 transition-colors">
                <td className="px-3 py-3">
                  <span className="text-admin-text-primary font-medium">{reg.firstName} {reg.lastName}</span>
                  <p className="text-xs text-admin-text-tertiary mt-0.5">{reg.company ?? "—"}</p>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell">
                  <span className="text-xs text-admin-text-secondary">{reg.email}</span>
                </td>
                <td className="px-3 py-3 hidden md:table-cell">
                  <span className="text-xs text-admin-text-secondary">{reg.course?.title ?? `Course #${reg.courseId}`}</span>
                </td>
                <td className="px-3 py-3 hidden lg:table-cell">
                  <span className="text-xs text-admin-text-secondary">{new Date(reg.createdAt).toLocaleDateString()}</span>
                </td>
                <td className="px-3 py-3 text-center">
                  <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium", STATUS_BADGE[reg.status] ?? "bg-admin-surface text-admin-text-secondary")}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", reg.status === "pending" ? "bg-admin-warning" : reg.status === "confirmed" ? "bg-admin-success" : reg.status === "cancelled" ? "bg-red-400" : reg.status === "completed" ? "bg-blue-400" : "bg-admin-text-muted")} />
                    {reg.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {reg.status !== "confirmed" && (
                      <button type="button" onClick={() => handleStatusUpdate(reg.id, "confirmed")}
                        className="p-1.5 rounded text-admin-success hover:text-admin-success hover:bg-admin-success/10 transition-colors" aria-label="Confirm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </button>
                    )}
                    {reg.status !== "cancelled" && (
                      <button type="button" onClick={() => handleStatusUpdate(reg.id, "cancelled")}
                        className="p-1.5 rounded text-admin-danger hover:text-admin-danger hover:bg-admin-danger/10 transition-colors" aria-label="Cancel">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                      </button>
                    )}
                    {reg.status !== "completed" && (
                      <button type="button" onClick={() => handleStatusUpdate(reg.id, "completed")}
                        className="p-1.5 rounded text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" aria-label="Complete">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
                      </button>
                    )}
                    <button type="button" onClick={() => handleDelete(reg.id)}
                      className="p-1.5 rounded text-admin-text-secondary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors" aria-label="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-12 text-center text-admin-text-secondary text-sm">No registrations found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-admin-text-tertiary">{total} registrations total</p>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Previous</button>
            <span className="text-xs text-admin-text-tertiary px-2">Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
