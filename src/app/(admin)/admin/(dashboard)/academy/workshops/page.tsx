"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { WorkshopTable } from "@/components/admin/academy/workshop-table"

export default function AdminWorkshopsPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (categoryId) params.set("categoryId", String(categoryId))
    if (status) params.set("status", status)
    params.set("page", String(page))
    params.set("limit", "20")
    const res = await fetch(`/api/academy/workshops?${params}`)
    const data = await res.json()
    setItems(data.items ?? [])
    setTotal(data.total ?? 0)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }, [search, categoryId, status, page])

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/academy/categories?limit=100")
    const data = await res.json()
    setCategories(data.items ?? [])
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])
  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleEdit = (id: number) => router.push(`/admin/academy/workshops/${id}`)
  const handleToggle = async (id: number, isPublished: boolean) => {
    await fetch(`/api/academy/workshops/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "toggle", isPublished }) })
    fetchItems()
  }
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this workshop?")) return
    await fetch(`/api/academy/workshops/${id}`, { method: "DELETE" })
    fetchItems()
  }
  const handleBulkAction = async (action: string, ids: number[]) => {
    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} workshops?`)) return
      for (const id of ids) await fetch(`/api/academy/workshops/${id}`, { method: "DELETE" })
    } else if (action === "publish" || action === "unpublish") {
      for (const id of ids) {
        await fetch(`/api/academy/workshops/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "toggle", isPublished: action === "publish" }) })
      }
    }
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Workshops" description={`${total} workshop${total === 1 ? "" : "s"} total`}
        actions={<ActionButton onClick={() => router.push("/admin/academy/workshops/new")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Workshop
        </ActionButton>}
      />
      <WorkshopTable items={items} total={total} page={page} totalPages={totalPages} categories={categories}
        onPageChange={setPage}
        onSearch={(q) => { setSearch(q); setPage(1) }}
        onCategoryFilter={(id) => { setCategoryId(id); setPage(1) }}
        onStatusFilter={(s) => { setStatus(s); setPage(1) }}
        onEdit={handleEdit} onToggle={handleToggle} onDelete={handleDelete}
        onBulkAction={handleBulkAction} />
    </div>
  )
}
