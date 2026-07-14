"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"

export default function EditFAQPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [defaultValues, setDefaultValues] = useState<Record<string, unknown> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/faq/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { router.push("/admin/faq"); return }
        setDefaultValues(data.data ?? data)
        setLoading(false)
      })
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const form = new FormData(e.currentTarget)
    const data: Record<string, unknown> = {}
    for (const [key, value] of form.entries()) {
      data[key] = value
    }
    data.displayOrder = Number(data.displayOrder)
    data.isActive = form.get("isActive") === "on"

    try {
      const res = await fetch(`/api/faq/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const err = await res.json(); alert(err.error ?? "Failed"); return }
      router.push("/admin/faq")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit FAQ" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  const dv = defaultValues as Record<string, string | number | boolean> | null

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Edit FAQ" />
      <form onSubmit={handleSubmit} className="bg-[#141414] border border-admin-border/50 rounded-xl p-6 space-y-4">
        <div className="space-y-1.5">
          <label className="text-sm text-admin-text-secondary">Question *</label>
          <input name="question" defaultValue={dv?.question as string ?? ""} required className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-admin-text-secondary">Answer *</label>
          <textarea name="answer" rows={4} defaultValue={dv?.answer as string ?? ""} required className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">Category</label>
            <input name="category" defaultValue={dv?.category as string ?? ""} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">Display Order</label>
            <input name="displayOrder" type="number" defaultValue={dv?.displayOrder as number ?? 0} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-admin-text-secondary">
          <input name="isActive" type="checkbox" defaultChecked={dv?.isActive !== false} className="accent-admin-accent" />
          Active
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting}
            className="px-4 py-2 bg-admin-accent text-white rounded-lg text-sm font-medium hover:bg-admin-accent-hover disabled:opacity-50">
            {submitting ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => router.push("/admin/faq")}
            className="px-4 py-2 bg-admin-surface/60 text-admin-text-secondary rounded-lg text-sm hover:text-admin-text-primary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
