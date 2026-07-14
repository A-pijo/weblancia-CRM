"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { AdminErrorState } from "@/components/admin/error-state"
import { DataTablePlaceholder } from "@/components/admin/data-table-placeholder"
import { ProjectsTable } from "@/components/admin/projects/projects-table"
import { logger } from "@/lib/logger"

export default function AdminWorkPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [industries, setIndustries] = useState<string[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [industry, setIndustry] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (industry) params.set("industry", industry)
    params.set("page", String(page))
    params.set("limit", "20")

    const res = await fetch(`/api/work?${params}`)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const msg = body?.error?.message ?? "Impossible de charger les projets."
      logger.error(msg, { status: res.status }, "admin")
      setError(msg)
      setLoading(false)
      return
    }
    const data = await res.json()
    setProjects(data.data?.items ?? [])
    setTotal(data.data?.total ?? 0)
    setTotalPages(data.data?.totalPages ?? 1)
    setLoading(false)
  }, [search, industry, page])

  const fetchIndustries = useCallback(async () => {
    const res = await fetch("/api/work?limit=100")
    if (!res.ok) return
    const data = await res.json()
    if (data.data?.items) {
      const inds = data.data.items.map((p: any) => p.industry).filter(Boolean)
      setIndustries([...new Set<string>(inds)] as string[])
    }
  }, [])

  useEffect(() => { fetchProjects() }, [fetchProjects])
  useEffect(() => { fetchIndustries() }, [fetchIndustries])

  const handleEdit = (id: number) => router.push(`/admin/work/${id}`)

  const handleDuplicate = async (id: number) => {
    await fetch(`/api/work/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "duplicate" }),
    })
    fetchProjects()
  }

  const handleToggle = async (id: number, isActive: boolean) => {
    await fetch(`/api/work/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "toggle", isActive }),
    })
    fetchProjects()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this project? (soft delete)")) return
    await fetch(`/api/work/${id}`, { method: "DELETE" })
    fetchProjects()
  }

  const handleBulkAction = async (action: string, ids: number[]) => {
    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} projects?`)) return
      for (const id of ids) {
        await fetch(`/api/work/${id}`, { method: "DELETE" })
      }
    } else if (action === "publish" || action === "unpublish") {
      for (const id of ids) {
        await fetch(`/api/work/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _action: "toggle", isActive: action === "publish" }),
        })
      }
    }
    fetchProjects()
  }

  if (loading && projects.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Work" description="Loading..." />
        <DataTablePlaceholder columns={5} rows={8} />
      </div>
    )
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={fetchProjects} fullPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Work"
        description={`${total} project${total === 1 ? "" : "s"} total`}
        actions={
          <ActionButton onClick={() => router.push("/admin/work/new")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Project
          </ActionButton>
        }
      />
      <ProjectsTable
        items={projects}
        total={total}
        page={page}
        totalPages={totalPages}
        industries={industries}
        onPageChange={setPage}
        onSearch={(q) => { setSearch(q); setPage(1) }}
        onIndustryFilter={(ind) => { setIndustry(ind); setPage(1) }}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onBulkAction={handleBulkAction}
      />
    </div>
  )
}
