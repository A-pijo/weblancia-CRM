"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { WorkshopForm } from "@/components/admin/academy/workshop-form"
import type { WorkshopFormData } from "@/lib/validation/academy"

export default function NewWorkshopPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/academy/categories?limit=100").then((r) => r.json()).then((data) => {
      setCategories(data.items ?? [])
    })
  }, [])

  const handleSubmit = async (data: WorkshopFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/academy/workshops", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/academy/workshops")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (!categories.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="New Workshop" description="Create a new workshop" />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="New Workshop" description="Create a new workshop" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <WorkshopForm categories={categories} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
