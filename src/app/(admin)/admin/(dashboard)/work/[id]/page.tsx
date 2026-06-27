"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ProjectForm } from "@/components/admin/projects/project-form"
import type { ProjectFormData } from "@/lib/validations/project"

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [defaultValues, setDefaultValues] = useState<Partial<ProjectFormData> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/work/${params.id}`)
      const project = await res.json()

      setDefaultValues({
        title: project.title,
        slug: project.slug,
        description: project.description ?? "",
        client: project.client ?? "",
        clientLogo: project.clientLogo ?? "",
        clientWebsite: project.clientWebsite ?? "",
        industry: project.industry ?? "",
        country: project.country ?? "",
        date: project.date ? project.date.split("T")[0] : "",
        duration: project.duration ?? "",
        url: project.url ?? "",
        isFeatured: project.isFeatured,
        isActive: project.isActive,
        displayOrder: project.displayOrder,
        status: project.status ?? "",
        fullCaseStudy: project.fullCaseStudy ?? "",
        challenge: project.challenge ?? "",
        solution: project.solution ?? "",
        results: project.results ?? [],
        technologies: project.technologies ?? [],
        servicesProvided: project.servicesProvided ?? [],
        teamMembers: project.teamMembers ?? [],
        clientTestimonial: project.clientTestimonial ?? undefined,
        featuredImage: project.featuredImage ?? "",
        desktopScreenshot: project.desktopScreenshot ?? "",
        tabletScreenshot: project.tabletScreenshot ?? "",
        mobileScreenshot: project.mobileScreenshot ?? "",
        videoUrl: project.videoUrl ?? "",
      })
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleSubmit = async (data: ProjectFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/work/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error?.message ?? "Failed to update project")
        return
      }
      router.push("/admin/work")
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Project" description="Loading..." />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Edit Project" description="Update portfolio project details" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <ProjectForm defaultValues={defaultValues ?? undefined} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
