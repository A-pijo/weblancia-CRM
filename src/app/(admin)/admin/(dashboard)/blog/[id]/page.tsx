"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { BlogForm } from "@/components/admin/blog/blog-form"
import type { BlogFormData } from "@/lib/validation/blog"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [defaultValues, setDefaultValues] = useState<Partial<BlogFormData> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [postRes, catRes] = await Promise.all([
        fetch(`/api/blog/${params.id}`),
        fetch("/api/blog?limit=1"),
      ])
      const post = await postRes.json()
      const catData = await catRes.json()
      if (catData.data?.items) {
        const cats = catData.data.items.map((p: any) => p.category)
        const unique = cats.filter((c: any, i: number, a: any[]) => a.findIndex((x: any) => x.id === c.id) === i)
        setCategories(unique)
      }

      setDefaultValues({
        title: post.data?.title ?? "",
        slug: post.data?.slug ?? "",
        excerpt: post.data?.excerpt ?? "",
        content: post.data?.content ?? "",
        categoryId: post.data?.categoryId,
        author: post.data?.author ?? "",
        publishedAt: post.data?.publishedAt ? post.data.publishedAt.split("T")[0] : "",
        isPublished: post.data?.isPublished,
        isFeatured: post.data?.isFeatured,
        readingTime: post.data?.readingTime ?? undefined,
        tags: post.data?.tags ?? [],
        featuredImage: post.data?.featuredImage ?? "",
        focusKeyword: post.data?.focusKeyword ?? "",
        canonicalUrl: post.data?.canonicalUrl ?? "",
        robots: post.data?.robots ?? "index, follow",
        ogTitle: post.data?.ogTitle ?? "",
        ogDescription: post.data?.ogDescription ?? "",
        ogImage: post.data?.ogImage ?? "",
        twitterCard: post.data?.twitterCard ?? "summary_large_image",
      })
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleSubmit = async (data: BlogFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/blog/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/blog")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Article" description="Loading..." />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Edit Article" description="Update blog article" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <BlogForm categories={categories} defaultValues={defaultValues ?? undefined} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
