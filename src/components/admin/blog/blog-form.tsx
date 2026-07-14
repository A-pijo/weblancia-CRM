"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { blogSchema, type BlogFormData, calculateReadingTime } from "@/lib/validation/blog"
import { cn } from "@/lib/utils/cn"

interface CategoryOption {
  id: number
  title: string
}

interface BlogFormProps {
  categories: CategoryOption[]
  defaultValues?: Partial<BlogFormData>
  onSubmit: (data: BlogFormData) => Promise<void>
  isSubmitting?: boolean
}

const TABS = ["Content", "Meta", "SEO"] as const

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "")
}

export function BlogForm({ categories, defaultValues, onSubmit, isSubmitting }: BlogFormProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Content")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [preview, setPreview] = useState(false)
  const [draftKey] = useState(() => `blog-draft-${Date.now()}`)
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      categoryId: categories[0]?.id,
      author: "",
      publishedAt: "",
      isPublished: false,
      isFeatured: false,
      readingTime: undefined,
      tags: [],
      featuredImage: "",
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
  const content = watch("content")
  const tags = watch("tags") as string[] | undefined

  useEffect(() => {
    if (content) {
      const rt = calculateReadingTime(content)
      setValue("readingTime", rt)
    }
  }, [content, setValue])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue("title", val)
    if (!slugManuallyEdited) {
      setValue("slug", generateSlug(val))
    }
  }

  const handleTagAdd = (value: string) => {
    if (!tags?.includes(value)) {
      setValue("tags", [...(tags ?? []), value] as never)
    }
  }

  const handleTagRemove = (index: number) => {
    setValue("tags", (tags ?? []).filter((_, i) => i !== index) as never)
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
        Object.entries(data).forEach(([key, val]) => setValue(key as keyof BlogFormData, val as never))
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex items-center justify-between overflow-x-auto">
        <div className="flex border-b border-admin-border/50 gap-0">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)}
              className={cn("px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] shrink-0",
                tab === t ? "text-admin-accent border-admin-accent" : "text-admin-text-secondary border-transparent hover:text-admin-text-primary"
              )}>{t}</button>
          ))}
        </div>
        {!defaultValues && (
          <button type="button" onClick={restoreDraft} className="text-xs text-admin-text-secondary hover:text-admin-accent transition-colors">Restore draft</button>
        )}
      </div>

      <div className="space-y-5">
        {tab === "Content" && (
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
                <label className="text-sm text-admin-text-secondary">Category *</label>
                <select {...register("categoryId", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                  {categories.map((c) => (<option key={c.id} value={c.id}>{c.title}</option>))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Author</label>
                <input {...register("author")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="Yassine El Khazouni" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Published Date</label>
                <input type="date" {...register("publishedAt")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
                <input type="checkbox" {...register("isPublished")} className="rounded border-admin-text-muted bg-admin-surface" />
                Published
              </label>
              <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
                <input type="checkbox" {...register("isFeatured")} className="rounded border-admin-text-muted bg-admin-surface" />
                Featured Article
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Excerpt</label>
              <textarea {...register("excerpt")} rows={2}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-admin-text-secondary">Content (Markdown)</label>
                <button type="button" onClick={() => setPreview(!preview)}
                  className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors">
                  {preview ? "Edit" : "Preview"}
                </button>
              </div>
              {preview ? (
                <div className="w-full min-h-[200px] md:min-h-[400px] px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary overflow-y-auto prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: markdownPreview(content ?? "") }} />
              ) : (
                <textarea {...register("content")} rows={18}
                  className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-y font-mono"
                  placeholder="Write your article in Markdown..." />
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Featured Image URL</label>
              <input {...register("featuredImage")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="/uploads/blog/..." />
            </div>

            <TagSection tags={tags ?? []} onAdd={handleTagAdd} onRemove={handleTagRemove} />
          </>
        )}

        {tab === "Meta" && (
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
                placeholder="https://weblancia.com/insights/..." />
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
              <label className="text-sm text-admin-text-secondary">Reading Time (minutes)</label>
              <input type="number" {...register("readingTime", { valueAsNumber: true })}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors" />
              <p className="text-xs text-admin-text-tertiary">Auto-calculated from content length. Override if needed.</p>
            </div>
          </>
        )}

        {tab === "SEO" && (
          <>
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
          {defaultValues ? "Update Article" : "Create Article"}
        </button>
      </div>
    </form>
  )
}

function TagSection({ tags, onAdd, onRemove }: { tags: string[]; onAdd: (v: string) => void; onRemove: (i: number) => void }) {
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
      <label className="text-sm text-admin-text-secondary">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((item, i) => (
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
