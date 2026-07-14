"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { resourceSchema, type ResourceFormData } from "@/lib/validation/academy"
import { cn } from "@/lib/utils/cn"
import { ImagePicker } from "@/components/admin/media/image-picker"

interface CategoryOption {
  id: number
  title: string
}

interface ResourceFormProps {
  categories: CategoryOption[]
  defaultValues?: Partial<ResourceFormData>
  onSubmit: (data: ResourceFormData) => Promise<void>
  isSubmitting?: boolean
}

const TABS = ["General", "Media", "SEO"] as const

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

export function ResourceForm({ categories, defaultValues, onSubmit, isSubmitting }: ResourceFormProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [draftKey] = useState(() => `resource-draft-${Date.now()}`)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      academyCategoryId: categories[0]?.id ?? undefined,
      type: "PDF",
      file: "",
      thumbnail: "",
      image: "",
      isFree: true,
      isPublished: false,
      focusKeyword: "",
      canonicalUrl: "",
      robots: "index, follow",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      twitterCard: "summary_large_image",
      ...defaultValues,
    },
  })

  const title = watch("title")
  const thumbnail = watch("thumbnail")

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
        Object.entries(data).forEach(([key, val]) => setValue(key as keyof ResourceFormData, val as never))
      }
    } catch {}
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex border-b border-admin-border/50 gap-0">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={cn("px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px]",
                tab === t ? "text-admin-accent border-admin-accent" : "text-admin-text-secondary border-transparent hover:text-admin-text-primary"
              )}>{t}</button>
          ))}
        </div>
        {!defaultValues && (
          <button type="button" onClick={restoreDraft} className="text-xs text-admin-text-secondary hover:text-admin-accent transition-colors">Restore draft</button>
        )}
      </div>

      <div className="space-y-5">
        {tab === "General" && (
          <>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Category</label>
                <select {...register("academyCategoryId", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                  <option value="">Select category</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Type</label>
                <select {...register("type")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                  <option value="PDF">PDF</option>
                  <option value="ZIP">ZIP</option>
                  <option value="DOCX">DOCX</option>
                  <option value="PPTX">PPTX</option>
                  <option value="XLSX">XLSX</option>
                  <option value="Image">Image</option>
                  <option value="Video">Video</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Description</label>
              <textarea {...register("description")} rows={4}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none" />
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
                <input type="checkbox" {...register("isFree")} className="rounded border-admin-text-muted bg-admin-surface" />
                Free Resource
              </label>
              <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
                <input type="checkbox" {...register("isPublished")} className="rounded border-admin-text-muted bg-admin-surface" />
                Published
              </label>
            </div>
          </>
        )}

        {tab === "Media" && (
          <>
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">File URL</label>
              <input {...register("file")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="/uploads/resources/..." />
            </div>
            <ImagePicker
              value={thumbnail}
              onChange={(url) => setValue("thumbnail", url ?? "")}
              folder="resources"
              label="Thumbnail"
            />
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Image URL</label>
              <input {...register("image")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="/uploads/resources/images/..." />
            </div>
          </>
        )}

        {tab === "SEO" && (
          <>
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Focus Keyword</label>
              <input {...register("focusKeyword")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
              <p className="text-xs text-admin-text-tertiary">Target keyword for SEO optimization</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Canonical URL</label>
              <input {...register("canonicalUrl")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="https://weblancia.com/academy/resources/..." />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Robots</label>
              <select {...register("robots")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                <option value="index, follow">index, follow</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">OG Title</label>
              <input {...register("ogTitle")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">OG Description</label>
              <textarea {...register("ogDescription")} rows={3}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">OG Image URL</label>
              <input {...register("ogImage")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Twitter Card</label>
              <select {...register("twitterCard")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                <option value="summary_large_image">Summary Large Image</option>
                <option value="summary">Summary</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>
          </>
        )}
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
          {defaultValues ? "Update Resource" : "Create Resource"}
        </button>
      </div>
    </form>
  )
}
