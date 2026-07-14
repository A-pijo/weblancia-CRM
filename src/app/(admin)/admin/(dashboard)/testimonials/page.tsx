"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { AdminErrorState } from "@/components/admin/error-state"
import { DataTablePlaceholder } from "@/components/admin/data-table-placeholder"
import { TestimonialsTable } from "@/components/admin/testimonials/testimonials-table"
import { logger } from "@/lib/logger"

interface Testimonial {
  id: number
  name: string
  role: string | null
  company: string | null
  content: string
  rating: number | null
  displayOrder: number
  isActive: boolean
  createdAt: string
}

export default function AdminTestimonialsPage() {
  const router = useRouter()
  const [items, setItems] = useState<Testimonial[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    params.set("page", String(page))
    params.set("limit", "20")
    const res = await fetch(`/api/testimonials?${params}`)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const msg = body?.error?.message ?? "Impossible de charger les témoignages."
      logger.error(msg, { status: res.status }, "admin")
      setError(msg)
      setLoading(false)
      return
    }
    const data = await res.json()
    setItems(data.data?.items ?? [])
    setTotal(data.data?.total ?? 0)
    setTotalPages(data.data?.totalPages ?? 1)
    setLoading(false)
  }, [search, page])

  useEffect(() => { loadData() }, [loadData])

  const handleEdit = (id: number) => router.push(`/admin/testimonials/${id}`)
  const handleToggle = async (id: number, isActive: boolean) => {
    await globalThis.fetch(`/api/testimonials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "toggle", isActive }) })
    loadData()
  }
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this testimonial?")) return
    await globalThis.fetch(`/api/testimonials/${id}`, { method: "DELETE" })
    loadData()
  }
  const handleBulkAction = async (action: string, ids: number[]) => {
    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} testimonials?`)) return
      for (const id of ids) { await globalThis.fetch(`/api/testimonials/${id}`, { method: "DELETE" }) }
    } else if (action === "publish" || action === "unpublish") {
      for (const id of ids) {
        await globalThis.fetch(`/api/testimonials/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "toggle", isActive: action === "publish" }) })
      }
    }
    loadData()
  }

  if (loading && items.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Testimonials" description="Loading..." />
        <DataTablePlaceholder columns={5} rows={8} />
      </div>
    )
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={loadData} fullPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Testimonials" description={`${total} testimonial${total === 1 ? "" : "s"} total`} actions={<ActionButton onClick={() => router.push("/admin/testimonials/new")}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>New Testimonial</ActionButton>} />
      <TestimonialsTable items={items} total={total} page={page} totalPages={totalPages} onPageChange={setPage} onSearch={(q) => { setSearch(q); setPage(1) }} onEdit={handleEdit} onToggle={handleToggle} onDelete={handleDelete} onBulkAction={handleBulkAction} />
    </div>
  )
}
