"use client"

import { useState, useEffect, useCallback } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { SectionCard } from "@/components/admin/section-card"
import { EmptyState } from "@/components/admin/empty-state"

interface ProjectRequest {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  projectType: string | null
  budget: string | null
  timeline: string | null
  description: string
  source: string | null
  isRead: boolean
  createdAt: string
}

export default function AdminProjects() {
  const [items, setItems] = useState<ProjectRequest[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    params.set("page", String(page))
    params.set("limit", "20")
    const res = await fetch(`/api/forms/projects?${params}`)
    const data = await res.json()
    setItems(data.items ?? [])
    setTotal(data.total ?? 0)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }, [search, page])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleMarkRead = async (id: number) => {
    await fetch("/api/forms/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read", id }),
    })
    fetchItems()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project request?")) return
    await fetch(`/api/forms/projects?id=${id}`, { method: "DELETE" })
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Project Requests" description={`${total} project request${total === 1 ? "" : "s"}`} />
      <SectionCard title="Project Requests" description="Manage incoming project inquiries">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-secondary"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search by name, email..."
                className="w-full h-9 pl-9 pr-3 bg-admin-bg border border-admin-border/30 rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-admin-border/30 bg-admin-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-admin-border/30">
                  <th className="text-left font-medium text-admin-text-secondary py-3 px-4">Name</th>
                  <th className="text-left font-medium text-admin-text-secondary py-3 px-4 hidden sm:table-cell">Email</th>
                  <th className="text-left font-medium text-admin-text-secondary py-3 px-4 hidden md:table-cell">Project Type</th>
                  <th className="text-left font-medium text-admin-text-secondary py-3 px-4 hidden md:table-cell">Budget</th>
                  <th className="text-left font-medium text-admin-text-secondary py-3 px-4 hidden lg:table-cell">Timeline</th>
                  <th className="text-left font-medium text-admin-text-secondary py-3 px-4">Status</th>
                  <th className="text-right font-medium text-admin-text-secondary py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-admin-border/30 hover:bg-admin-surface/30 transition-colors">
                    <td className="py-3 px-4 text-admin-text-primary">{item.name}</td>
                    <td className="py-3 px-4 text-admin-text-secondary hidden sm:table-cell">{item.email}</td>
                    <td className="py-3 px-4 text-admin-text-primary hidden md:table-cell">{item.projectType ?? "—"}</td>
                    <td className="py-3 px-4 text-admin-text-primary hidden md:table-cell">{item.budget ?? "—"}</td>
                    <td className="py-3 px-4 text-admin-text-primary hidden lg:table-cell">{item.timeline ?? "—"}</td>
                    <td className="py-3 px-4">
                      {item.isRead ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-admin-success/10 text-admin-success">Read</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-admin-warning/10 text-admin-warning">Unread</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!item.isRead && (
                          <button onClick={() => handleMarkRead(item.id)} className="text-xs text-admin-text-secondary hover:text-admin-text-primary transition-colors px-2 py-1 rounded hover:bg-admin-surface/50">Mark Read</button>
                        )}
                        <button onClick={() => handleDelete(item.id)} className="text-xs text-admin-danger/70 hover:text-admin-danger transition-colors px-2 py-1 rounded hover:bg-admin-danger/10">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="py-12">
                      <EmptyState
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
                        title="No project requests"
                        description="No project inquiries match your criteria."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-xs text-admin-text-tertiary">{total} total</p>
              <div className="flex items-center gap-1">
                <button type="button" disabled={page <= 1} onClick={() => setPage(page - 1)} className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Previous</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4))
                  const num = start + i
                  if (num > totalPages) return null
                  return (
                    <button key={num} type="button" onClick={() => setPage(num)}
                      className={`w-8 h-8 rounded text-xs transition-colors ${num === page ? "bg-admin-surface/50 text-admin-text-primary font-medium" : "text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface/50"}`}
                    >{num}</button>
                  )
                })}
                <button type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
              </div>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  )
}
