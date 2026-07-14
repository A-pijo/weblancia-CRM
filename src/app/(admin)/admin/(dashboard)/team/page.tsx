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

interface TeamMemberRow {
  id: number
  name: string
  role: string
  isActive: boolean
  displayOrder: number
}

export default function AdminTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMemberRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    params.set("page", String(page))
    params.set("limit", "20")
    const res = await fetch(`/api/team?${params}`)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const msg = body?.error?.message ?? "Impossible de charger les membres."
      logger.error(msg, { status: res.status }, "admin")
      setError(msg)
      setLoading(false)
      return
    }
    const data = await res.json()
    setMembers(data.data?.items ?? [])
    setTotal(data.data?.total ?? 0)
    setTotalPages(data.data?.totalPages ?? 1)
    setLoading(false)
  }, [page])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  const handleToggle = async (id: number, isActive: boolean) => {
    await fetch(`/api/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "toggle", isActive }),
    })
    fetchMembers()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this team member?")) return
    await fetch(`/api/team/${id}`, { method: "DELETE" })
    fetchMembers()
  }

  const columns: Column<TeamMemberRow>[] = [
    { key: "name", label: "Name", render: (m) => <span className="font-medium">{m.name}</span> },
    { key: "role", label: "Role", render: (m) => <span className="text-admin-text-secondary">{m.role}</span> },
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
          <button onClick={() => router.push(`/admin/team/${m.id}`)}
            className="text-xs text-admin-accent hover:underline">Edit</button>
          <button onClick={() => handleDelete(m.id)}
            className="text-xs text-red-400 hover:underline">Delete</button>
        </div>
      ),
    },
  ]

  if (loading && members.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Team" description="Loading..." />
        <DataTablePlaceholder columns={4} rows={8} />
      </div>
    )
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={fetchMembers} fullPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team"
        description={`${total} member${total === 1 ? "" : "s"}`}
        actions={
          <ActionButton onClick={() => router.push("/admin/team/new")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Member
          </ActionButton>
        }
      />
      <DataTable
        items={members}
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
