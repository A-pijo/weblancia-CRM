"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { academyCategorySchema, type AcademyCategoryFormData } from "@/lib/validation/academy"

interface CategoryFormProps {
  defaultValues?: Partial<AcademyCategoryFormData>
  onSubmit: (data: AcademyCategoryFormData) => Promise<void>
  isSubmitting?: boolean
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

export function CategoryForm({ defaultValues, onSubmit, isSubmitting }: CategoryFormProps) {
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [draftKey] = useState(() => `academy-category-draft-${Date.now()}`)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm<AcademyCategoryFormData>({
    resolver: zodResolver(academyCategorySchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      icon: "",
      displayOrder: 0,
      ...defaultValues,
    },
  })

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue("title", val)
    if (!slugManuallyEdited) {
      setValue("slug", generateSlug(val))
    }
  }

  const handleAutoSave = useCallback(() => {
    clearTimeout(autoSaveTimer.current)
    autoSaveTimer.current = setTimeout(() => {
      try {
        const data = getValues()
        localStorage.setItem(draftKey, JSON.stringify(data))
      } catch {}
    }, 2000)
  }, [draftKey, getValues])

  useEffect(() => {
    const subscription = watch(() => handleAutoSave())
    return () => subscription.unsubscribe()
  }, [watch, handleAutoSave])

  const restoreDraft = () => {
    try {
      const saved = localStorage.getItem(draftKey)
      if (saved) {
        const data = JSON.parse(saved)
        Object.entries(data).forEach(([key, val]) => setValue(key as keyof AcademyCategoryFormData, val as never))
      }
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-admin-text-primary">Category Details</h3>
        {!defaultValues && (
          <button type="button" onClick={restoreDraft} className="text-xs text-admin-text-secondary hover:text-admin-accent transition-colors">Restore draft</button>
        )}
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm text-admin-text-secondary">Title *</label>
            <input {...register("title")} onChange={handleTitleChange}
              className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
            {errors.title && <p className="text-xs text-admin-danger">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm text-admin-text-secondary">Slug *</label>
            <input {...register("slug")} onChange={(e) => { setSlugManuallyEdited(true); setValue("slug", e.target.value) }}
              className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
            {errors.slug && <p className="text-xs text-admin-danger">{errors.slug.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-admin-text-secondary">Description</label>
          <textarea {...register("description")} rows={3}
            className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm text-admin-text-secondary">Icon</label>
            <input {...register("icon")}
              className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
              placeholder="e.g. BookOpen, Code, PenTool" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-admin-text-secondary">Display Order</label>
            <input type="number" {...register("displayOrder", { valueAsNumber: true })}
              className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-admin-border/50">
        <button type="submit" disabled={isSubmitting}
          className="h-10 px-6 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-admin-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {defaultValues ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  )
}
