"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [defaultValues, setDefaultValues] = useState<Record<string, unknown> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/team/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { router.push("/admin/team"); return }
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
      const res = await fetch(`/api/team/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const err = await res.json(); alert(err.error ?? "Failed"); return }
      router.push("/admin/team")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Team Member" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader title="Edit Team Member" description={`Editing ${(defaultValues as Record<string, string>)?.name ?? ""}`} />
      <form onSubmit={handleSubmit} className="bg-[#141414] border border-admin-border/50 rounded-xl p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">Name *</label>
            <input name="name" defaultValue={(defaultValues as Record<string, string>)?.name ?? ""} required className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">Role *</label>
            <input name="role" defaultValue={(defaultValues as Record<string, string>)?.role ?? ""} required className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-admin-text-secondary">Bio</label>
          <textarea name="bio" rows={3} defaultValue={(defaultValues as Record<string, string>)?.bio ?? ""} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm text-admin-text-secondary">Image URL</label>
          <input name="image" defaultValue={(defaultValues as Record<string, string>)?.image ?? ""} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">LinkedIn</label>
            <input name="linkedin" defaultValue={(defaultValues as Record<string, string>)?.linkedin ?? ""} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">Twitter</label>
            <input name="twitter" defaultValue={(defaultValues as Record<string, string>)?.twitter ?? ""} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">GitHub</label>
            <input name="github" defaultValue={(defaultValues as Record<string, string>)?.github ?? ""} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">Email</label>
            <input name="email" type="email" defaultValue={(defaultValues as Record<string, string>)?.email ?? ""} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">Phone</label>
            <input name="phone" defaultValue={(defaultValues as Record<string, string>)?.phone ?? ""} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm text-admin-text-secondary">Display Order</label>
            <input name="displayOrder" type="number" defaultValue={(defaultValues as Record<string, number>)?.displayOrder ?? 0} className="w-full bg-[#0a0a0a] border border-admin-border/50 rounded-lg px-3 py-2 text-sm text-admin-text-primary focus:outline-none focus:border-admin-accent" />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-admin-text-secondary">
          <input name="isActive" type="checkbox" defaultChecked={(defaultValues as Record<string, boolean>)?.isActive !== false} className="accent-admin-accent" />
          Active
        </label>
        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={submitting}
            className="px-4 py-2 bg-admin-accent text-white rounded-lg text-sm font-medium hover:bg-admin-accent-hover disabled:opacity-50">
            {submitting ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={() => router.push("/admin/team")}
            className="px-4 py-2 bg-admin-surface/60 text-admin-text-secondary rounded-lg text-sm hover:text-admin-text-primary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
