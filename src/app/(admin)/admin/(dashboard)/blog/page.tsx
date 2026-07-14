"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { AdminErrorState } from "@/components/admin/error-state"
import { DataTablePlaceholder } from "@/components/admin/data-table-placeholder"
import { BlogTable } from "@/components/admin/blog/blog-table"
import { logger } from "@/lib/logger"

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<any[]>([])
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (categoryId) params.set("categoryId", String(categoryId))
    params.set("page", String(page))
    params.set("limit", "20")
    const res = await fetch(`/api/blog?${params}`)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const msg = body?.error?.message ?? "Impossible de charger les articles."
      logger.error(msg, { status: res.status }, "admin")
      setError(msg)
      setLoading(false)
      return
    }
    const data = await res.json()
    setPosts(data.items ?? [])
    setTotal(data.total ?? 0)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }, [search, categoryId, page])

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/blog?limit=1")
    if (!res.ok) return
    const data = await res.json()
    if (data.items) {
      const cats = data.items.map((p: any) => p.category)
      const unique = cats.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.id === c.id) === i)
      setCategories(unique)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])
  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleEdit = (id: number) => router.push(`/admin/blog/${id}`)
  const handleDuplicate = async (id: number) => {
    await fetch(`/api/blog/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "duplicate" }) })
    fetchPosts()
  }
  const handleToggle = async (id: number, isPublished: boolean) => {
    await fetch(`/api/blog/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "toggle", isPublished }) })
    fetchPosts()
  }
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this article? (unpublish)")) return
    await fetch(`/api/blog/${id}`, { method: "DELETE" })
    fetchPosts()
  }
  const handleBulkAction = async (action: string, ids: number[]) => {
    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} articles?`)) return
      for (const id of ids) await fetch(`/api/blog/${id}`, { method: "DELETE" })
    } else if (action === "publish" || action === "unpublish") {
      for (const id of ids) {
        await fetch(`/api/blog/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "toggle", isPublished: action === "publish" }) })
      }
    }
    fetchPosts()
  }

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Blog" description="Loading..." />
        <DataTablePlaceholder columns={5} rows={8} />
      </div>
    )
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={fetchPosts} fullPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Blog" description={`${total} article${total === 1 ? "" : "s"} total`}
        actions={<ActionButton onClick={() => router.push("/admin/blog/new")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Article
        </ActionButton>}
      />
      <BlogTable items={posts} total={total} page={page} totalPages={totalPages} categories={categories}
        onPageChange={setPage}
        onSearch={(q) => { setSearch(q); setPage(1) }}
        onCategoryFilter={(id) => { setCategoryId(id); setPage(1) }}
        onEdit={handleEdit} onDuplicate={handleDuplicate} onToggle={handleToggle} onDelete={handleDelete}
        onBulkAction={handleBulkAction} />
    </div>
  )
}
