"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { CategoryTable } from "@/components/admin/academy/category-table"

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
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
    const res = await fetch(`/api/academy/categories?${params}`)
    const data = await res.json()
    setItems(data.items ?? [])
    setTotal(data.total ?? 0)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }, [search, page])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleEdit = (id: number) => router.push(`/admin/academy/categories/${id}`)
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category?")) return
    await fetch(`/api/academy/categories/${id}`, { method: "DELETE" })
    fetchItems()
  }
  const handleBulkAction = async (action: string, ids: number[]) => {
    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} categories?`)) return
      for (const id of ids) await fetch(`/api/academy/categories/${id}`, { method: "DELETE" })
    }
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Categories" description={`${total} categor${total === 1 ? "y" : "ies"} total`}
        actions={<ActionButton onClick={() => router.push("/admin/academy/categories/new")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Category
        </ActionButton>}
      />
      <CategoryTable items={items} total={total} page={page} totalPages={totalPages}
        onPageChange={setPage}
        onSearch={(q) => { setSearch(q); setPage(1) }}
        onEdit={handleEdit} onDelete={handleDelete}
        onBulkAction={handleBulkAction} />
    </div>
  )
}
