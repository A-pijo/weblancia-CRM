"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { UserForm } from "@/components/admin/users/users-form"
import type { UserFormData } from "@/lib/validation/users"

interface Role { id: number; name: string }

export default function NewUserPage() {
  const router = useRouter()
  const [roles, setRoles] = useState<Role[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetch("/api/users?roles=true").then((r) => r.json()).then(setRoles)
  }, [])

  const handleSubmit = async (data: UserFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed to create"); return }
      router.push("/admin/users")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (!roles.length) {
    return <div className="space-y-6"><PageHeader title="New User" description="Create a new admin account" /><div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div></div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="New User" description="Create a new admin account" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <UserForm roles={roles} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
