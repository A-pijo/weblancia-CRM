"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ProjectForm } from "@/components/admin/projects/project-form"
import type { ProjectFormData } from "@/lib/validation/project"

export default function NewProjectPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (data: ProjectFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/work", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error?.message ?? "Failed to create project")
        return
      }
      router.push("/admin/work")
      router.refresh()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="New Project" description="Create a new portfolio project" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <ProjectForm onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
