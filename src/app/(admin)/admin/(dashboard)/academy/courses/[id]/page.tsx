"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { CourseForm } from "@/components/admin/academy/course-form"
import type { CourseFormData } from "@/lib/validation/academy"

export default function EditCoursePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [defaultValues, setDefaultValues] = useState<Partial<CourseFormData> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [itemRes, catRes] = await Promise.all([
        fetch(`/api/academy/courses/${params.id}`),
        fetch("/api/academy/categories?limit=100"),
      ])
      const item = await itemRes.json()
      const catData = await catRes.json()
      setCategories(catData.data?.items ?? [])

      setDefaultValues({
        title: item.data?.title ?? "",
        slug: item.data?.slug ?? "",
        shortDescription: item.data?.shortDescription ?? "",
        fullDescription: item.data?.fullDescription ?? "",
        instructor: item.data?.instructor ?? "",
        academyCategoryId: item.data?.academyCategoryId ?? undefined,
        level: item.data?.level ?? "Beginner",
        duration: item.data?.duration ?? "",
        language: item.data?.language ?? "",
        price: item.data?.price ?? undefined,
        discountPrice: item.data?.discountPrice ?? undefined,
        isFeatured: item.data?.isFeatured ?? false,
        isPublished: item.data?.isPublished ?? false,
        thumbnail: item.data?.thumbnail ?? "",
        gallery: item.data?.gallery ?? [],
        curriculum: item.data?.curriculum ?? [],
        requirements: item.data?.requirements ?? [],
        learningOutcomes: item.data?.learningOutcomes ?? [],
        certificateIncluded: item.data?.certificateIncluded ?? false,
        downloadableResources: item.data?.downloadableResources ?? [],
        faqs: item.data?.faqs ?? [],
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

  const handleSubmit = async (data: CourseFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/academy/courses/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/academy/courses")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Course" description="Loading..." />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Edit Course" description="Update course details" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <CourseForm categories={categories} defaultValues={defaultValues ?? undefined} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
