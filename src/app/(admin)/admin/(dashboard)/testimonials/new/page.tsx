"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { TestimonialForm } from "@/components/admin/testimonials/testimonials-form"
import type { TestimonialFormData } from "@/lib/validations/testimonials"

export default function NewTestimonialPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data: TestimonialFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed to create"); return }
      router.push("/admin/testimonials")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="New Testimonial" description="Add a new client testimonial" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <TestimonialForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
