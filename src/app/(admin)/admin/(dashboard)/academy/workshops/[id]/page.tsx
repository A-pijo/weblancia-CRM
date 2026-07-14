"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { WorkshopForm } from "@/components/admin/academy/workshop-form"
import type { WorkshopFormData } from "@/lib/validation/academy"

export default function EditWorkshopPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [defaultValues, setDefaultValues] = useState<Partial<WorkshopFormData> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [itemRes, catRes] = await Promise.all([
        fetch(`/api/academy/workshops/${params.id}`),
        fetch("/api/academy/categories?limit=100"),
      ])
      const item = await itemRes.json()
      const catData = await catRes.json()
      setCategories(catData.data?.items ?? [])

      setDefaultValues({
        title: item.data?.title ?? "",
        slug: item.data?.slug ?? "",
        description: item.data?.description ?? "",
        instructor: item.data?.instructor ?? "",
        academyCategoryId: item.data?.academyCategoryId ?? undefined,
        date: item.data?.date ? item.data.date.split("T")[0] : "",
        time: item.data?.time ?? "",
        duration: item.data?.duration ?? "",
        seats: item.data?.seats ?? undefined,
        location: item.data?.location ?? "",
        type: item.data?.type ?? "Online",
        price: item.data?.price ?? undefined,
        registrationDeadline: item.data?.registrationDeadline ? item.data.registrationDeadline.split("T")[0] : "",
        status: item.data?.status ?? "Upcoming",
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

  const handleSubmit = async (data: WorkshopFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/academy/workshops/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/academy/workshops")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Workshop" description="Loading..." />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Edit Workshop" description="Update workshop details" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <WorkshopForm categories={categories} defaultValues={defaultValues ?? undefined} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
