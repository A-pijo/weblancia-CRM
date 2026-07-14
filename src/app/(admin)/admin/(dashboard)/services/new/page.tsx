"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ServiceForm } from "@/components/admin/services/service-form"
import type { ServiceFormData } from "@/lib/validation/services"

interface Category {
  id: number
  title: string
}

export default function NewServicePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/services?limit=1")
      .then((r) => r.json())
      .then((data) => {
        if (data.data?.items) {
          const cats = data.data.items.map((s: { category: Category }) => s.category)
          const unique = cats.filter((c: Category, i: number, a: Category[]) => a.findIndex((x: Category) => x.id === c.id) === i)
          setCategories(unique)
        }
      })
  }, [])

  const handleSubmit = async (data: ServiceFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error?.message ?? "Failed to create service")
        return
      }
      router.push("/admin/services")
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  if (!categories.length) {
    return (
      <div className="space-y-6">
        <PageHeader title="New Service" description="Create a new service offering" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="New Service" description="Create a new service offering" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <ServiceForm categories={categories} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
