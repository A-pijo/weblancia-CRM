"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { userSchema, type UserFormData } from "@/lib/validation/users"

interface RoleOption { id: number; name: string }

interface UserFormProps {
  roles: RoleOption[]
  defaultValues?: Partial<UserFormData>
  onSubmit: (data: UserFormData) => Promise<void>
  isSubmitting?: boolean
}

export function UserForm({ roles, defaultValues, onSubmit, isSubmitting }: UserFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      roleId: roles[0]?.id,
      isActive: true,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm text-admin-text-secondary">Name *</label>
          <input {...register("name")} className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
          {errors.name && <p className="text-xs text-admin-danger">{errors.name.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-admin-text-secondary">Email *</label>
          <input type="email" {...register("email")} className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
          {errors.email && <p className="text-xs text-admin-danger">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm text-admin-text-secondary">{defaultValues ? "New Password (leave empty to keep)" : "Password *"}</label>
          <input type="password" {...register("password")} className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
          {errors.password && <p className="text-xs text-admin-danger">{errors.password.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm text-admin-text-secondary">Role *</label>
          <select {...register("roleId", { valueAsNumber: true })} className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
            {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
          <input type="checkbox" {...register("isActive")} className="rounded border-admin-text-muted bg-admin-surface" />
          Active
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-admin-border/50">
        <button type="submit" disabled={isSubmitting} className="h-10 px-6 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-admin-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
          {isSubmitting && <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
          {defaultValues ? "Update User" : "Create User"}
        </button>
      </div>
    </form>
  )
}
