"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ResourceForm } from "@/components/admin/academy/resource-form"
import type { ResourceFormData } from "@/lib/validation/academy"

export default function NewResourcePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/academy/categories?limit=100").then((r) => r.json()).then((data) => {
      setCategories(data.data?.items ?? [])
    })
  }, [])

  const handleSubmit = async (data: ResourceFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/academy/resources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/academy/resources")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (!categories.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="New Resource" description="Create a new resource" />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="New Resource" description="Create a new resource" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <ResourceForm categories={categories} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
