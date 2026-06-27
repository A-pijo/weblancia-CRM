"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { CertificateForm } from "@/components/admin/academy/certificate-form"
import type { CertificateFormData } from "@/lib/validations/academy"

export default function NewCertificatePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<{ id: number; title: string }[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/academy/categories?limit=100").then((r) => r.json()).then((data) => {
      setCategories(data.items ?? [])
    })
  }, [])

  const handleSubmit = async (data: CertificateFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/academy/certificates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed"); return }
      router.push("/admin/academy/certificates")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (!categories.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="New Certificate" description="Create a new certificate" />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="New Certificate" description="Create a new certificate" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <CertificateForm categories={categories} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
