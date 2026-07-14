"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { CategoryForm } from "@/components/admin/academy/category-form"
import type { AcademyCategoryFormData } from "@/lib/validation/academy"

export default function NewCategoryPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data: AcademyCategoryFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/academy/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/academy/categories")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="New Category" description="Create a new academy category" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <CategoryForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
