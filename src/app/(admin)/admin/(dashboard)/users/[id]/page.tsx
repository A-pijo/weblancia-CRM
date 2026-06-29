"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { UserForm } from "@/components/admin/users/users-form"
import type { UserFormData } from "@/lib/validations/users"

interface Role { id: number; name: string }

export default function EditUserPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [roles, setRoles] = useState<Role[]>([])
  const [defaultValues, setDefaultValues] = useState<Partial<UserFormData> | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [userRes, rolesData] = await Promise.all([
        fetch(`/api/users/${params.id}`),
        fetch("/api/users?roles=true").then((r) => r.json()),
      ])
      const u = await userRes.json()
      setRoles(rolesData)
      setDefaultValues({ name: u.name, email: u.email, password: "", roleId: u.roleId, isActive: u.isActive })
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleSubmit = async (data: UserFormData) => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/users/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const err = await res.json(); alert(err.error?.message ?? "Failed to update"); return }
      router.push("/admin/users")
      router.refresh()
    } finally { setSubmitting(false) }
  }

  if (loading || !defaultValues || !roles.length) {
    return <div className="space-y-6"><PageHeader title="Edit User" description="Loading..." /><div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div></div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title={`Edit: ${defaultValues.name}`} description="Update user details" />
      <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-6">
        <UserForm roles={roles} defaultValues={defaultValues} onSubmit={handleSubmit} isSubmitting={submitting} />
      </div>
    </div>
  )
}
