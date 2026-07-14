"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { AdminErrorState } from "@/components/admin/error-state"
import { DataTablePlaceholder } from "@/components/admin/data-table-placeholder"
import { UsersTable } from "@/components/admin/users/users-table"
import { logger } from "@/lib/logger"

interface Role { id: number; name: string }
interface User { id: number; name: string; email: string; isActive: boolean; createdAt: string; role: Role }

export default function AdminUsersPage() {
  const router = useRouter()
  const [items, setItems] = useState<User[]>([])
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
    const res = await fetch(`/api/users?${params}`)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const msg = body?.error?.message ?? "Impossible de charger les utilisateurs."
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

  const handleEdit = (id: number) => router.push(`/admin/users/${id}`)
  const handleToggle = async (id: number, isActive: boolean) => {
    await globalThis.fetch(`/api/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "toggle", isActive }) })
    loadData()
  }
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this user?")) return
    await globalThis.fetch(`/api/users/${id}`, { method: "DELETE" })
    loadData()
  }

  if (loading && items.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Users" description="Loading..." />
        <DataTablePlaceholder columns={4} rows={8} />
      </div>
    )
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={loadData} fullPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description={`${total} user${total === 1 ? "" : "s"} total`} actions={<ActionButton onClick={() => router.push("/admin/users/new")}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>New User</ActionButton>} />
      <UsersTable items={items} total={total} page={page} totalPages={totalPages} onPageChange={setPage} onSearch={(q) => { setSearch(q); setPage(1) }} onEdit={handleEdit} onToggle={handleToggle} onDelete={handleDelete} />
    </div>
  )
}
