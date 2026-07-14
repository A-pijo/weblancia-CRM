"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { AdminErrorState } from "@/components/admin/error-state"
import { DataTablePlaceholder } from "@/components/admin/data-table-placeholder"
import { ServicesTable } from "@/components/admin/services/services-table"
import { logger } from "@/lib/logger"

interface Category {
  id: number
  title: string
  slug: string
}

interface Service {
  id: number
  slug: string
  title: string
  description: string | null
  isActive: boolean
  isFeatured: boolean
  displayOrder: number
  startingPrice: number | null
  createdAt: string
  category: Category
}

export default function AdminServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    setError(null)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (categoryId) params.set("categoryId", String(categoryId))
    params.set("page", String(page))
    params.set("limit", "20")

    const res = await fetch(`/api/services?${params}`)
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      const msg = body?.error?.message ?? "Impossible de charger les services."
      logger.error(msg, { status: res.status }, "admin")
      setError(msg)
      setLoading(false)
      return
    }
    const data = await res.json()
    setServices(data.items ?? [])
    setTotal(data.total ?? 0)
    setTotalPages(data.totalPages ?? 1)
    setLoading(false)
  }, [search, categoryId, page])

  const fetchCategories = useCallback(async () => {
    const res = await fetch("/api/services?limit=1")
    if (!res.ok) return
    const data = await res.json()
    if (data.items) {
      const cats = data.items.map((s: Service) => s.category)
      const unique = cats.filter((c: Category, i: number, a: Category[]) => a.findIndex((x: Category) => x.id === c.id) === i)
      setCategories(unique)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])
  useEffect(() => { fetchCategories() }, [fetchCategories])

  const handleEdit = (id: number) => router.push(`/admin/services/${id}`)

  const handleDuplicate = async (id: number) => {
    await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "duplicate" }),
    })
    fetchServices()
  }

  const handleToggle = async (id: number, isActive: boolean) => {
    await fetch(`/api/services/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _action: "toggle", isActive }),
    })
    fetchServices()
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this service? (soft delete — sets to draft)")) return
    await fetch(`/api/services/${id}`, { method: "DELETE" })
    fetchServices()
  }

  const handleBulkAction = async (action: string, ids: number[]) => {
    if (action === "delete") {
      if (!confirm(`Delete ${ids.length} services?`)) return
      for (const id of ids) {
        await fetch(`/api/services/${id}`, { method: "DELETE" })
      }
    } else if (action === "publish" || action === "unpublish") {
      for (const id of ids) {
        await fetch(`/api/services/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _action: "toggle", isActive: action === "publish" }),
        })
      }
    }
    fetchServices()
  }

  if (loading && services.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Services" description="Loading..." />
        <DataTablePlaceholder columns={5} rows={8} />
      </div>
    )
  }

  if (error) {
    return <AdminErrorState message={error} onRetry={fetchServices} fullPage />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description={`${total} service${total === 1 ? "" : "s"} total`}
        actions={
          <ActionButton onClick={() => router.push("/admin/services/new")}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Service
          </ActionButton>
        }
      />
      <ServicesTable
        items={services}
        total={total}
        page={page}
        totalPages={totalPages}
        categories={categories}
        onPageChange={setPage}
        onSearch={(q) => { setSearch(q); setPage(1) }}
        onCategoryFilter={(id) => { setCategoryId(id); setPage(1) }}
        onEdit={handleEdit}
        onDuplicate={handleDuplicate}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onBulkAction={handleBulkAction}
      />
    </div>
  )
}
