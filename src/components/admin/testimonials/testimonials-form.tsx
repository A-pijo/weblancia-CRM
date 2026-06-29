"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { testimonialSchema, type TestimonialFormData } from "@/lib/validations/testimonials"

interface TestimonialFormProps {
  defaultValues?: Partial<TestimonialFormData>
  onSubmit: (data: TestimonialFormData) => Promise<void>
  isSubmitting?: boolean
}

export function TestimonialForm({ defaultValues, onSubmit, isSubmitting }: TestimonialFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: "",
      role: "",
      company: "",
      content: "",
      rating: null,
      avatar: "",
      displayOrder: 0,
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
          <label className="text-sm text-admin-text-secondary">Role</label>
          <input {...register("role")} className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" placeholder="CEO, Founder..." />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm text-admin-text-secondary">Company</label>
          <input {...register("company")} className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-admin-text-secondary">Rating (1-5)</label>
          <input type="number" min={1} max={5} {...register("rating", { valueAsNumber: true })} className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-admin-text-secondary">Content *</label>
        <textarea {...register("content")} rows={4} className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none" />
        {errors.content && <p className="text-xs text-admin-danger">{errors.content.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm text-admin-text-secondary">Avatar URL</label>
        <input {...register("avatar")} className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" placeholder="/images/avatars/..." />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm text-admin-text-secondary">Display Order</label>
          <input type="number" {...register("displayOrder", { valueAsNumber: true })} className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
            <input type="checkbox" {...register("isActive")} className="rounded border-admin-text-muted bg-admin-surface" />
            Active
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-admin-border/50">
        <button type="submit" disabled={isSubmitting} className="h-10 px-6 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-admin-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
          {isSubmitting && <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
          {defaultValues ? "Update Testimonial" : "Create Testimonial"}
        </button>
      </div>
    </form>
  )
}
