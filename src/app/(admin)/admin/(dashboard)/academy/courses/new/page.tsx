"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { CourseForm } from "@/components/admin/academy/course-form"
import type { CourseFormData } from "@/lib/validation/academy"

export default function NewCoursePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/academy/categories?limit=100").then((r) => r.json()).then((data) => {
      setCategories(data.data?.items ?? [])
    })
  }, [])

  const handleSubmit = async (data: CourseFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/academy/courses", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/academy/courses")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (!categories.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="New Course" description="Create a new course" />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="New Course" description="Create a new course" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <CourseForm categories={categories} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
