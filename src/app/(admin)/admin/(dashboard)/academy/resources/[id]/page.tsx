"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ResourceForm } from "@/components/admin/academy/resource-form"
import type { ResourceFormData } from "@/lib/validation/academy"

export default function EditResourcePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [defaultValues, setDefaultValues] = useState<Partial<ResourceFormData> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [itemRes, catRes] = await Promise.all([
        fetch(`/api/academy/resources/${params.id}`),
        fetch("/api/academy/categories?limit=100"),
      ])
      const item = await itemRes.json()
      const catData = await catRes.json()
      setCategories(catData.data?.items ?? [])

      setDefaultValues({
        title: item.data?.title ?? "",
        slug: item.data?.slug ?? "",
        description: item.data?.description ?? "",
        academyCategoryId: item.data?.academyCategoryId ?? undefined,
        type: item.data?.type ?? "PDF",
        file: item.data?.file ?? "",
        thumbnail: item.data?.thumbnail ?? "",
        image: item.data?.image ?? "",
        isFree: item.data?.isFree ?? true,
        isPublished: item.data?.isPublished ?? false,
        focusKeyword: item.data?.focusKeyword ?? "",
        canonicalUrl: item.data?.canonicalUrl ?? "",
        robots: item.data?.robots ?? "index, follow",
        ogTitle: item.data?.ogTitle ?? "",
        ogDescription: item.data?.ogDescription ?? "",
        ogImage: item.data?.ogImage ?? "",
        twitterCard: item.data?.twitterCard ?? "summary_large_image",
      })
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleSubmit = async (data: ResourceFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/academy/resources/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/academy/resources")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Resource" description="Loading..." />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Edit Resource" description="Update resource details" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <ResourceForm categories={categories} defaultValues={defaultValues ?? undefined} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
