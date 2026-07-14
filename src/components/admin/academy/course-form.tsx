"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { courseSchema, type CourseFormData } from "@/lib/validation/academy"
import { cn } from "@/lib/utils/cn"
import { ImagePicker } from "@/components/admin/media/image-picker"

interface CategoryOption {
  id: number
  title: string
}

interface CourseFormProps {
  categories: CategoryOption[]
  defaultValues?: Partial<CourseFormData>
  onSubmit: (data: CourseFormData) => Promise<void>
  isSubmitting?: boolean
}

const TABS = ["General", "Content", "Pricing", "Media", "SEO"] as const

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

export function CourseForm({ categories, defaultValues, onSubmit, isSubmitting }: CourseFormProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [preview, setPreview] = useState(false)
  const [draftKey] = useState(() => `course-draft-${Date.now()}`)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues, control } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      slug: "",
      shortDescription: "",
      fullDescription: "",
      instructor: "",
      academyCategoryId: categories[0]?.id ?? undefined,
      level: "Beginner",
      duration: "",
      language: "",
      price: undefined,
      discountPrice: undefined,
      isFeatured: false,
      isPublished: false,
      thumbnail: "",
      gallery: [],
      curriculum: [],
      requirements: [],
      learningOutcomes: [],
      certificateIncluded: false,
      downloadableResources: [],
      faqs: [],
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

  const { fields: curriculumFields, append: appendCurriculum, remove: removeCurriculum } = useFieldArray({
    control, name: "curriculum",
  })

  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control, name: "faqs",
  })

  const title = watch("title")
  const content = watch("fullDescription")
  const thumbnail = watch("thumbnail")
  const requirements = watch("requirements") as string[] | undefined
  const learningOutcomes = watch("learningOutcomes") as string[] | undefined
  const downloadableResources = watch("downloadableResources") as string[] | undefined
  const gallery = watch("gallery") as string[] | undefined

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
        Object.entries(data).forEach(([key, val]) => setValue(key as keyof CourseFormData, val as never))
      }
    } catch {}
  }

  const markdownPreview = (md: string) => {
    return md
      .replace(/### (.+)/g, "<h3 class='text-lg font-semibold mt-4 mb-2'>$1</h3>")
      .replace(/## (.+)/g, "<h2 class='text-xl font-semibold mt-5 mb-2'>$1</h2>")
      .replace(/# (.+)/g, "<h1 class='text-2xl font-bold mt-6 mb-3'>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code class='bg-admin-surface px-1 rounded text-admin-accent'>$1</code>")
      .replace(/^- (.+)/gm, "<li class='ml-4 list-disc'>$1</li>")
      .replace(/^(\d+)\. (.+)/gm, "<li class='ml-4 list-decimal'>$2</li>")
      .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' class='text-admin-accent underline'>$1</a>")
      .replace(/\n\n/g, "</p><p class='mb-3'>")
      .replace(/\n/g, "<br />")
    return `<p class='mb-3'>${md}</p>`
  }

  const addTag = (field: "requirements" | "learningOutcomes" | "downloadableResources", value: string) => {
    const current = getValues(field) as string[] | undefined
    if (!current?.includes(value)) {
      setValue(field, [...(current ?? []), value] as never)
    }
  }

  const removeTag = (field: "requirements" | "learningOutcomes" | "downloadableResources", index: number) => {
    const current = getValues(field) as string[] | undefined
    setValue(field, (current ?? []).filter((_, i) => i !== index) as never)
  }

  const addToArray = (field: "gallery", value: string) => {
    const current = getValues(field) as string[] | undefined
    setValue(field, [...(current ?? []), value] as never)
  }

  const removeFromArray = (field: "gallery", index: number) => {
    const current = getValues(field) as string[] | undefined
    setValue(field, (current ?? []).filter((_, i) => i !== index) as never)
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
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
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Level</label>
                <select {...register("level")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Duration</label>
                <input {...register("duration")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="e.g. 8 weeks, 3 months" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Language</label>
                <input {...register("language")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="e.g. English, Arabic" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
                <input type="checkbox" {...register("isPublished")} className="rounded border-admin-text-muted bg-admin-surface" />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
                <input type="checkbox" {...register("isFeatured")} className="rounded border-admin-text-muted bg-admin-surface" />
                Featured Course
              </label>
            </div>
          </>
        )}

        {tab === "Content" && (
          <>
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Short Description</label>
              <textarea {...register("shortDescription")} rows={3}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-admin-text-secondary">Full Description (Markdown)</label>
                <button type="button" onClick={() => setPreview(!preview)}
                  className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors">
                  {preview ? "Edit" : "Preview"}
                </button>
              </div>
              {preview ? (
                <div className="w-full min-h-[200px] md:min-h-[300px] px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary overflow-y-auto prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: markdownPreview(content ?? "") }} />
              ) : (
                <textarea {...register("fullDescription")} rows={12}
                  className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-y font-mono"
                  placeholder="Write a full description in Markdown..." />
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-admin-text-secondary">Curriculum</label>
                <button type="button" onClick={() => appendCurriculum({ title: "", items: [] })}
                  className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors">+ Add Section</button>
              </div>
              {curriculumFields.map((field, index) => (
                <div key={field.id} className="p-4 rounded-lg bg-admin-surface/30 border border-admin-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-admin-text-secondary">Section {index + 1}</span>
                    <button type="button" onClick={() => removeCurriculum(index)}
                      className="text-xs text-admin-danger hover:text-red-300 transition-colors">Remove</button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-admin-text-secondary">Section Title</label>
                    <input {...register(`curriculum.${index}.title`)}
                      className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
                  </div>
                  <CurriculumItemsSection nestIndex={index} register={register} control={control} />
                </div>
              ))}
            </div>

            <TagSection
              label="Requirements"
              items={requirements ?? []}
              onAdd={(v) => addTag("requirements", v)}
              onRemove={(i) => removeTag("requirements", i)}
            />

            <TagSection
              label="Learning Outcomes"
              items={learningOutcomes ?? []}
              onAdd={(v) => addTag("learningOutcomes", v)}
              onRemove={(i) => removeTag("learningOutcomes", i)}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-admin-text-secondary">FAQs</label>
                <button type="button" onClick={() => appendFaq({ question: "", answer: "" })}
                  className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors">+ Add FAQ</button>
              </div>
              {faqFields.map((field, index) => (
                <div key={field.id} className="p-4 rounded-lg bg-admin-surface/30 border border-admin-border/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-admin-text-secondary">FAQ {index + 1}</span>
                    <button type="button" onClick={() => removeFaq(index)}
                      className="text-xs text-admin-danger hover:text-red-300 transition-colors">Remove</button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-admin-text-secondary">Question</label>
                    <input {...register(`faqs.${index}.question`)}
                      className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs text-admin-text-secondary">Answer</label>
                    <textarea {...register(`faqs.${index}.answer`)} rows={3}
                      className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none" />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "Pricing" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Price</label>
                <input type="number" step="0.01" {...register("price", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Discount Price</label>
                <input type="number" step="0.01" {...register("discountPrice", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="0.00" />
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
              <input type="checkbox" {...register("certificateIncluded")} className="rounded border-admin-text-muted bg-admin-surface" />
              Certificate Included
            </label>

            <TagSection
              label="Downloadable Resources"
              items={downloadableResources ?? []}
              onAdd={(v) => addTag("downloadableResources", v)}
              onRemove={(i) => removeTag("downloadableResources", i)}
            />
          </>
        )}

        {tab === "Media" && (
          <>
            <ImagePicker
              value={thumbnail}
              onChange={(url) => setValue("thumbnail", url ?? "")}
              folder="courses"
              label="Thumbnail"
            />

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Gallery</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(gallery ?? []).map((url, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-admin-surface/60 text-xs text-admin-text-primary">
                    <span className="truncate max-w-[120px] sm:max-w-[200px]">{url}</span>
                    <button type="button" onClick={() => removeFromArray("gallery", i)} className="text-admin-text-secondary hover:text-admin-danger transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </span>
                ))}
              </div>
              <GalleryInput onAdd={(v) => addToArray("gallery", v)} />
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
                placeholder="https://weblancia.com/academy/..." />
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
          {defaultValues ? "Update Course" : "Create Course"}
        </button>
      </div>
    </form>
  )
}

function CurriculumItemsSection({ nestIndex, register, control }: { nestIndex: number; register: any; control: any }) {
  const { fields, append, remove } = useFieldArray({
    control, name: `curriculum.${nestIndex}.items`,
  })

  const [input, setInput] = useState("")

  const addItem = () => {
    if (input.trim()) {
      append(input.trim())
      setInput("")
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-xs text-admin-text-secondary">Items</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {fields.map((item, i) => (
          <span key={item.id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-admin-surface/50 text-xs text-admin-text-primary">
            {(item as Record<string, unknown>)?.value as string ?? String(item)}
            <button type="button" onClick={() => remove(i)} className="text-admin-text-tertiary hover:text-admin-danger transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem() } }}
          placeholder="Add item and press Enter..."
          className="flex-1 h-8 px-3 bg-admin-surface/50 border border-admin-border rounded text-xs text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
        <button type="button" onClick={addItem}
          className="px-3 h-8 rounded bg-admin-surface text-xs text-admin-text-primary hover:bg-admin-surface transition-colors">Add</button>
      </div>
    </div>
  )
}

function TagSection({ label, items, onAdd, onRemove }: { label: string; items: string[]; onAdd: (v: string) => void; onRemove: (i: number) => void }) {
  const [input, setInput] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault()
      onAdd(input.trim())
      setInput("")
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm text-admin-text-secondary">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-admin-surface/60 text-xs text-admin-text-primary">
            {item}
            <button type="button" onClick={() => onRemove(i)} className="text-admin-text-secondary hover:text-admin-danger transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </span>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
        placeholder="Type and press Enter to add..."
        className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
    </div>
  )
}

function GalleryInput({ onAdd }: { onAdd: (v: string) => void }) {
  const [input, setInput] = useState("")

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim())
      setInput("")
    }
  }

  return (
    <div className="flex gap-2">
      <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAdd() } }}
        placeholder="Enter image URL and press Enter..."
        className="flex-1 h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
      <button type="button" onClick={handleAdd}
        className="h-9 px-4 rounded-lg bg-admin-surface text-xs text-admin-text-primary hover:bg-admin-surface transition-colors">Add</button>
    </div>
  )
}
