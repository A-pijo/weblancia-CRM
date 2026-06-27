"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { CourseTable } from "@/components/admin/academy/course-table"

export default function AdminCoursesPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [level, setLevel] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (categoryId) params.set("categoryId", String(categoryId))
    if (level) params.set("level", level)
    params.set("page", String(page))
    params.set("limit", "20")
    const res = await fetch(`/api/academy/courses?${params}`)
    const data = await res.json()
    setItems(data.items ?? [])
    setTotal(data.total ?? 0)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }, [search, categoryId, level, page])

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/academy/categories?limit=100")
    const data = await res.json()
    setCategories(data.items ?? [])
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])
  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleEdit = (id: number) => router.push(`/admin/academy/courses/${id}`)
  const handleDuplicate = async (id: number) => {
    await fetch(`/api/academy/courses/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "duplicate" }) })
    fetchItems()
  }
  const handleToggle = async (id: number, isPublished: boolean) => {
    await fetch(`/api/academy/courses/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "toggle", isPublished }) })
    fetchItems()
  }
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this course?")) return
    await fetch(`/api/academy/courses/${id}`, { method: "DELETE" })
    fetchItems()
  }
  const handleBulkAction = async (action: string, ids: number[]) => {
    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} courses?`)) return
      for (const id of ids) await fetch(`/api/academy/courses/${id}`, { method: "DELETE" })
    } else if (action === "publish" || action === "unpublish") {
      for (const id of ids) {
        await fetch(`/api/academy/courses/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "toggle", isPublished: action === "publish" }) })
      }
    }
    fetchItems()
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Courses" description={`${total} course${total === 1 ? "" : "s"} total`}
        actions={<ActionButton onClick={() => router.push("/admin/academy/courses/new")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Course
        </ActionButton>}
      />
      <CourseTable items={items} total={total} page={page} totalPages={totalPages} categories={categories}
        onPageChange={setPage}
        onSearch={(q) => { setSearch(q); setPage(1) }}
        onCategoryFilter={(id) => { setCategoryId(id); setPage(1) }}
        onLevelFilter={(lvl) => { setLevel(lvl); setPage(1) }}
        onEdit={handleEdit} onDuplicate={handleDuplicate} onToggle={handleToggle} onDelete={handleDelete}
        onBulkAction={handleBulkAction} />
    </div>
  )
}
