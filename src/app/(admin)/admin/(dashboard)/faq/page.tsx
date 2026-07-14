"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { AdminErrorState } from "@/components/admin/error-state"
import { DataTablePlaceholder } from "@/components/admin/data-table-placeholder"
import { DataTable } from "@/components/admin/data-table"
import type { Column } from "@/components/admin/data-table"
import { logger } from "@/lib/logger"

interface FAQRow {
  id: number
  question: string
  isActive: boolean
  displayOrder: number
}

export default function AdminFAQPage() {
  const router = useRouter()
  const [items, setItems] = useState<FAQRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", "50")
    const res = await fetch(`/api/faq?${params}`)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const msg = body?.error?.message ?? "Impossible de charger les FAQ."
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
  }, [page])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleToggle = async (id: number, isActive: boolean) => {
    await fetch(`/api/faq/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "toggle", isActive }),
    })
    fetchItems()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this FAQ?")) return
    await fetch(`/api/faq/${id}`, { method: "DELETE" })
    fetchItems()
  }

  const columns: Column<FAQRow>[] = [
    { key: "question", label: "Question", render: (m) => <span className="font-medium line-clamp-1">{m.question}</span> },
    { key: "displayOrder", label: "Order", render: (m) => <span>{m.displayOrder}</span> },
    {
      key: "isActive", label: "Status", render: (m) => (
        <button onClick={() => handleToggle(m.id, !m.isActive)}
          className={`px-2 py-0.5 rounded text-xs font-medium ${m.isActive ? "bg-success-bg text-success" : "bg-[#1c1917] text-[#a1a1aa]"}`}>
          {m.isActive ? "Active" : "Inactive"}
        </button>
      ),
    },
    {
      key: "actions", label: "Actions", render: (m) => (
        <div className="flex gap-2">
          <button onClick={() => router.push(`/admin/faq/${m.id}`)}
            className="text-xs text-admin-accent hover:underline">Edit</button>
          <button onClick={() => handleDelete(m.id)}
            className="text-xs text-red-400 hover:underline">Delete</button>
        </div>
      ),
    },
  ]

  if (loading && items.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="FAQ" description="Loading..." />
        <DataTablePlaceholder columns={4} rows={8} />
      </div>
    )
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={fetchItems} fullPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="FAQ"
        description={`${total} question${total === 1 ? "" : "s"}`}
        actions={
          <ActionButton onClick={() => router.push("/admin/faq/new")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New FAQ
          </ActionButton>
        }
      />
      <DataTable
        items={items}
        total={total}
        page={page}
        totalPages={totalPages}
        columns={columns}
        onPageChange={setPage}
        getId={(m) => m.id}
      />
    </div>
  )
}
