"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { TestimonialForm } from "@/components/admin/testimonials/testimonials-form"
import type { TestimonialFormData } from "@/lib/validations/testimonials"

export default function EditTestimonialPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [defaultValues, setDefaultValues] = useState<Partial<TestimonialFormData> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/testimonials/${params.id}`)
      const t = await res.json()
      setDefaultValues({
        name: t.name, role: t.role ?? "", company: t.company ?? "",
        content: t.content, rating: t.rating ?? null, avatar: t.avatar ?? "",
        displayOrder: t.displayOrder ?? 0, isActive: t.isActive ?? true,
      })
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleSubmit = async (data: TestimonialFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/testimonials/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed to update"); return }
      router.push("/admin/testimonials")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (loading || !defaultValues) {
    return <div className="space-y-6"><PageHeader title="Edit Testimonial" description="Loading..." /><div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div></div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title={`Edit: ${defaultValues.name}`} description="Update testimonial details" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <TestimonialForm defaultValues={defaultValues} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
