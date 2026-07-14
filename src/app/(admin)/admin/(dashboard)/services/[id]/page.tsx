"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ServiceForm } from "@/components/admin/services/service-form"
import type { ServiceFormData } from "@/lib/validation/services"
import { SectionCard } from "@/components/admin/section-card"

interface Category {
  id: number
  title: string
}

export default function EditServicePage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [categories, setCategories] = useState<Category[]>([])
  const [defaultValues, setDefaultValues] = useState<Partial<ServiceFormData> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [svcRes, catRes] = await Promise.all([
        fetch(`/api/services/${params.id}`),
        fetch("/api/services?limit=1"),
      ])

      const service = await svcRes.json()
      const catData = await catRes.json()

      if (catData.data?.items) {
        const cats = catData.data.items.map((s: { category: Category }) => s.category)
        const unique = cats.filter((c: Category, i: number, a: Category[]) => a.findIndex((x: Category) => x.id === c.id) === i)
        setCategories(unique)
      }

      setDefaultValues({
        title: service.data?.title ?? "",
        slug: service.data?.slug ?? "",
        description: service.data?.description ?? "",
        fullDescription: service.data?.fullDescription ?? "",
        icon: service.data?.icon ?? "",
        categoryId: service.data?.categoryId,
        isFeatured: service.data?.isFeatured ?? false,
        isActive: service.data?.isActive ?? true,
        displayOrder: service.data?.displayOrder ?? 0,
        startingPrice: service.data?.startingPrice ?? null,
        currency: service.data?.currency ?? "MAD",
        ctaText: service.data?.ctaText ?? "",
        deliverables: service.data?.deliverables ?? [],
        benefits: service.data?.benefits ?? [],
        process: service.data?.process ?? [],
        technologies: service.data?.technologies ?? [],
        faqs: service.data?.faqs ?? [],
        relatedServices: service.data?.relatedServices ?? [],
        featuredImage: service.data?.featuredImage ?? "",
        galleryImages: service.data?.galleryImages ?? [],
        clientCount: service.data?.clientCount ?? null,
        projectCount: service.data?.projectCount ?? null,
        satisfactionRate: service.data?.satisfactionRate ?? null,
        outcome: service.data?.outcome ?? "",
      })
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleSubmit = async (data: ServiceFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/services/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error?.message ?? "Failed to update service")
        return
      }
      router.push("/admin/services")
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !defaultValues) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Service" description="Loading..." />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title={`Edit: ${defaultValues.title}`} description="Update service details" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <ServiceForm categories={categories} defaultValues={defaultValues} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
