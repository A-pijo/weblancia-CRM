"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { workshopSchema, type WorkshopFormData } from "@/lib/validations/academy"
import { cn } from "@/lib/utils/cn"

interface CategoryOption {
  id: number
  title: string
}

interface WorkshopFormProps {
  categories: CategoryOption[]
  defaultValues?: Partial<WorkshopFormData>
  onSubmit: (data: WorkshopFormData) => Promise<void>
  isSubmitting?: boolean
}

const TABS = ["General", "Details", "SEO"] as const

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

export function WorkshopForm({ categories, defaultValues, onSubmit, isSubmitting }: WorkshopFormProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [draftKey] = useState(() => `workshop-draft-${Date.now()}`)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      instructor: "",
      academyCategoryId: categories[0]?.id ?? undefined,
      date: "",
      time: "",
      duration: "",
      seats: undefined,
      location: "",
      type: "Online",
      price: undefined,
      registrationDeadline: "",
      status: "Upcoming",
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
        Object.entries(data).forEach(([key, val]) => setValue(key as keyof WorkshopFormData, val as never))
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
                <label className="text-sm text-admin-text-secondary">Instructor</label>
                <input {...register("instructor")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Category</label>
                <select {...register("academyCategoryId", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                  <option value="">Select category</option>
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Description</label>
              <textarea {...register("description")} rows={4}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none" />
            </div>

            <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
              <input type="checkbox" {...register("isPublished")} className="rounded border-admin-text-muted bg-admin-surface" />
              Published
            </label>
          </>
        )}

        {tab === "Details" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Date</label>
                <input type="date" {...register("date")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Time</label>
                <input {...register("time")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="e.g. 10:00 AM - 12:00 PM" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Duration</label>
                <input {...register("duration")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="e.g. 2 hours" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Seats</label>
                <input type="number" {...register("seats", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Price</label>
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="0.00" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Location</label>
              <input {...register("location")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="e.g. Online, or physical address" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Type</label>
                <select {...register("type")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                  <option value="Online">Online</option>
                  <option value="Offline">Offline</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Status</label>
                <select {...register("status")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Registration Deadline</label>
              <input type="date" {...register("registrationDeadline")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
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
                placeholder="https://weblancia.com/academy/workshops/..." />
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
          {defaultValues ? "Update Workshop" : "Create Workshop"}
        </button>
      </div>
    </form>
  )
}
