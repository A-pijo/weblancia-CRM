"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { BlogForm } from "@/components/admin/blog/blog-form"
import type { BlogFormData } from "@/lib/validation/blog"

export default function NewBlogPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/blog?limit=1").then((r) => r.json()).then((data) => {
      if (data.items) {
        const cats = data.items.map((p: any) => p.category)
        const unique = cats.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.id === c.id) === i)
        setCategories(unique)
      }
    })
  }, [])

  const handleSubmit = async (data: BlogFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/blog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/blog")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (!categories.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="New Article" description="Create a new blog article" />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="New Article" description="Create a new blog article" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <BlogForm categories={categories} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
