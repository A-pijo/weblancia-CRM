"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { CategoryForm } from "@/components/admin/academy/category-form"
import type { AcademyCategoryFormData } from "@/lib/validation/academy"

export default function EditCategoryPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [defaultValues, setDefaultValues] = useState<Partial<AcademyCategoryFormData> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/academy/categories/${params.id}`)
      const item = await res.json()
      const d = item.data ?? item

      setDefaultValues({
        title: d.title ?? "",
        slug: d.slug ?? "",
        description: d.description ?? "",
        icon: d.icon ?? "",
        displayOrder: d.displayOrder ?? 0,
      })
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleSubmit = async (data: AcademyCategoryFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/academy/categories/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/academy/categories")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Category" description="Loading..." />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Edit Category" description="Update category details" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <CategoryForm defaultValues={defaultValues ?? undefined} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
