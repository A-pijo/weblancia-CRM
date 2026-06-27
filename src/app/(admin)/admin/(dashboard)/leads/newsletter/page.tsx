"use client"

import { useState, useEffect, useCallback } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { SectionCard } from "@/components/admin/section-card"
import { EmptyState } from "@/components/admin/empty-state"

interface Subscriber {
  id: number
  email: string
  isActive: boolean
  subscribedAt: string
  createdAt: string
}

export default function AdminNewsletter() {
  const [items, setItems] = useState<Subscriber[]>([])
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
    const res = await fetch(`/api/forms/newsletter?${params}`)
    const data = await res.json()
    setItems(data.items ?? [])
    setTotal(data.total ?? 0)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }, [search, page])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this subscriber?")) return
    await fetch(`/api/forms/newsletter?id=${id}`, { method: "DELETE" })
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Newsletter" description={`${total} subscriber${total === 1 ? "" : "s"}`} />
      <SectionCard title="Subscribers" description="Manage newsletter email subscribers">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-secondary"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search by email..."
                className="w-full h-9 pl-9 pr-3 bg-admin-bg border border-admin-border/30 rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-admin-border/30 bg-admin-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-admin-border/30">
                  <th className="text-left font-medium text-admin-text-secondary py-3 px-4">Email</th>
                  <th className="text-left font-medium text-admin-text-secondary py-3 px-4 hidden sm:table-cell">Subscribed Date</th>
                  <th className="text-left font-medium text-admin-text-secondary py-3 px-4">Status</th>
                  <th className="text-right font-medium text-admin-text-secondary py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-admin-border/30 hover:bg-admin-surface/30 transition-colors">
                    <td className="py-3 px-4 text-admin-text-primary">{item.email}</td>
                    <td className="py-3 px-4 text-admin-text-secondary text-xs hidden sm:table-cell">{new Date(item.subscribedAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      {item.isActive ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-admin-success/10 text-admin-success">Active</span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-admin-surface/50 text-admin-text-secondary">Inactive</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button onClick={() => handleDelete(item.id)} className="text-xs text-admin-danger/70 hover:text-admin-danger transition-colors px-2 py-1 rounded hover:bg-admin-danger/10">Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && !loading && (
                  <tr>
                    <td colSpan={4} className="py-12">
                      <EmptyState
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                        title="No subscribers"
                        description="No newsletter subscribers match your criteria."
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
