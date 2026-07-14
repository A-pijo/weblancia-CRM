"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { serviceSchema, type ServiceFormData } from "@/lib/validation/services"
import { cn } from "@/lib/utils/cn"
import { useAutoSave } from "@/lib/hooks/use-auto-save"
import type { UseFormWatch, UseFormGetValues, UseFormSetValue } from "react-hook-form"
import { ImagePicker } from "@/components/admin/media/image-picker"

interface CategoryOption {
  id: number
  title: string
}

interface ServiceFormProps {
  categories: CategoryOption[]
  defaultValues?: Partial<ServiceFormData>
  onSubmit: (data: ServiceFormData) => Promise<void>
  isSubmitting?: boolean
}

const TABS = ["General", "Content", "Pricing", "Media", "SEO"] as const

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function ServiceForm({ categories, defaultValues, onSubmit, isSubmitting }: ServiceFormProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)
  const [draftKey] = useState(() => `service-draft-${Date.now()}`)

  const { register, handleSubmit, formState: { errors }, setValue, watch, getValues } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      fullDescription: "",
      icon: "",
      categoryId: categories[0]?.id,
      isFeatured: false,
      isActive: true,
      displayOrder: 0,
      startingPrice: null,
      currency: "MAD",
      ctaText: "Get started",
      deliverables: [],
      benefits: [],
      process: [],
      technologies: [],
      faqs: [],
      relatedServices: [],
      featuredImage: "",
      galleryImages: [],
      clientCount: null,
      projectCount: null,
      satisfactionRate: null,
      outcome: "",
      ...defaultValues,
    },
  })

  const autoSave = useAutoSave<ServiceFormData>({
    draftKey,
    watch,
    getValues,
    setValue,
  })

  const title = watch("title")
  const watchSlug = watch("slug")
  const featuredImage = watch("featuredImage")

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue("title", val)
    if (!slugManuallyEdited) {
      setValue("slug", generateSlug(val))
    }
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlugManuallyEdited(true)
    setValue("slug", e.target.value)
  }

  const handleTagAdd = (field: keyof ServiceFormData, value: string) => {
    const current = (watch(field) as string[]) ?? []
    if (!current.includes(value)) {
      setValue(field, [...current, value] as never)
    }
  }

  const handleTagRemove = (field: keyof ServiceFormData, index: number) => {
    const current = (watch(field) as string[]) ?? []
    setValue(field, current.filter((_, i) => i !== index) as never)
  }

  const handleFaqAdd = () => {
    const current = (watch("faqs") as { question: string; answer: string }[]) ?? []
    setValue("faqs", [...current, { question: "", answer: "" }] as never)
  }

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const current = [...((watch("faqs") as { question: string; answer: string }[]) ?? [])]
    current[index] = { ...current[index], [field]: value }
    setValue("faqs", current as never)
  }

  const handleFaqRemove = (index: number) => {
    const current = (watch("faqs") as { question: string; answer: string }[]) ?? []
    setValue("faqs", current.filter((_, i) => i !== index) as never)
  }

  const handleProcessAdd = () => {
    const current = (watch("process") as { title: string; description: string }[]) ?? []
    setValue("process", [...current, { title: "", description: "" }] as never)
  }

  const handleProcessChange = (index: number, field: "title" | "description", value: string) => {
    const current = [...((watch("process") as { title: string; description: string }[]) ?? [])]
    current[index] = { ...current[index], [field]: value }
    setValue("process", current as never)
  }

  const handleProcessRemove = (index: number) => {
    const current = (watch("process") as { title: string; description: string }[]) ?? []
    setValue("process", current.filter((_, i) => i !== index) as never)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex border-b border-admin-border/50 gap-0 overflow-x-auto scrollbar-thin">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] shrink-0",
              tab === t
                ? "text-admin-accent border-admin-accent"
                : "text-admin-text-secondary border-transparent hover:text-admin-text-primary",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {tab === "General" && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Title *</label>
                <input
                  {...register("title")}
                  onChange={handleTitleChange}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
                {errors.title && <p className="text-xs text-admin-danger">{errors.title.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Slug *</label>
                <input
                  value={watchSlug}
                  onChange={handleSlugChange}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
                {errors.slug && <p className="text-xs text-admin-danger">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Short Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Category *</label>
                <select
                  {...register("categoryId", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Icon</label>
                <input
                  {...register("icon")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="Code, Palette, etc."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Display Order</label>
                <input
                  type="number"
                  {...register("displayOrder", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
                <input type="checkbox" {...register("isFeatured")} className="rounded border-admin-text-muted bg-admin-surface" />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm text-admin-text-primary cursor-pointer">
                <input type="checkbox" {...register("isActive")} className="rounded border-admin-text-muted bg-admin-surface" />
                Published
              </label>
            </div>
          </>
        )}

        {tab === "Content" && (
          <>
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Full Description</label>
              <textarea
                {...register("fullDescription")}
                rows={8}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-y font-mono"
                placeholder="Supports HTML for rich formatting..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Outcome</label>
              <textarea
                {...register("outcome")}
                rows={3}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none"
              />
            </div>

            <TagSection
              label="Deliverables"
              field="deliverables"
              watch={watch}
              setValue={setValue}
              onAdd={handleTagAdd}
              onRemove={handleTagRemove}
            />

            <TagSection
              label="Benefits"
              field="benefits"
              watch={watch}
              setValue={setValue}
              onAdd={handleTagAdd}
              onRemove={handleTagRemove}
            />

            <TagSection
              label="Technologies"
              field="technologies"
              watch={watch}
              setValue={setValue}
              onAdd={handleTagAdd}
              onRemove={handleTagRemove}
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-admin-text-secondary">Process Steps</label>
                <button type="button" onClick={handleProcessAdd} className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors">+ Add step</button>
              </div>
              {(watch("process") as { title: string; description: string }[] | undefined)?.map((step, i) => (
                <div key={i} className="flex gap-3 items-start bg-admin-surface/30 rounded-lg p-3 border border-admin-border/30">
                  <span className="text-xs text-admin-text-tertiary mt-2.5 w-5 shrink-0">{i + 1}.</span>
                  <div className="flex-1 space-y-2">
                    <input
                      value={step.title}
                      onChange={(e) => handleProcessChange(i, "title", e.target.value)}
                      placeholder="Step title"
                      className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                    />
                    <textarea
                      value={step.description}
                      onChange={(e) => handleProcessChange(i, "description", e.target.value)}
                      placeholder="Step description"
                      rows={2}
                      className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none"
                    />
                  </div>
                  <button type="button" onClick={() => handleProcessRemove(i)} className="p-1.5 rounded text-admin-text-tertiary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-admin-text-secondary">FAQs</label>
                <button type="button" onClick={handleFaqAdd} className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors">+ Add FAQ</button>
              </div>
              {(watch("faqs") as { question: string; answer: string }[] | undefined)?.map((faq, i) => (
                <div key={i} className="flex gap-3 items-start bg-admin-surface/30 rounded-lg p-3 border border-admin-border/30">
                  <div className="flex-1 space-y-2">
                    <input
                      value={faq.question}
                      onChange={(e) => handleFaqChange(i, "question", e.target.value)}
                      placeholder="Question"
                      className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) => handleFaqChange(i, "answer", e.target.value)}
                      placeholder="Answer"
                      rows={2}
                      className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none"
                    />
                  </div>
                  <button type="button" onClick={() => handleFaqRemove(i)} className="p-1.5 rounded text-admin-text-tertiary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "Pricing" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Starting Price</label>
              <input
                type="number"
                step="0.01"
                {...register("startingPrice", { valueAsNumber: true })}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Currency</label>
              <select
                {...register("currency")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
              >
                <option value="MAD">MAD</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">CTA Text</label>
              <input
                {...register("ctaText")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
              />
            </div>
          </div>
        )}

        {tab === "Media" && (
          <div className="space-y-5">
            <ImagePicker
              value={featuredImage}
              onChange={(url) => setValue("featuredImage", url ?? "")}
              folder="services"
              label="Featured Image"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Clients</label>
                <input
                  type="number"
                  {...register("clientCount", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Projects</label>
                <input
                  type="number"
                  {...register("projectCount", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Satisfaction Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("satisfactionRate", { valueAsNumber: true })}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
              </div>
            </div>
          </div>
        )}

        {tab === "SEO" && (
          <div className="space-y-4">
            <p className="text-xs text-admin-text-tertiary">SEO metadata is managed through the SeoMetadata model. Basic fields are available here.</p>
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Meta Title</label>
              <input
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="SEO title (auto-generated from service title)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Meta Description</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none"
                placeholder="SEO description"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-admin-border/50">
        <div className="flex items-center gap-3">
          {autoSave.saved && (
            <span className="text-xs text-admin-text-tertiary flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              Brouillon enregistré
            </span>
          )}
          {!defaultValues && autoSave.hasDraft && (
            <button
              type="button"
              onClick={autoSave.restoreDraft}
              className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors"
            >
              Restaurer le brouillon
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-6 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-admin-accent-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {isSubmitting && (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {defaultValues ? "Update Service" : "Create Service"}
        </button>
      </div>
    </form>
  )
}

function TagSection({
  label, field, watch, setValue, onAdd, onRemove,
}: {
  label: string
  field: keyof ServiceFormData
  watch: ReturnType<typeof useForm<ServiceFormData>>["watch"]
  setValue: ReturnType<typeof useForm<ServiceFormData>>["setValue"]
  onAdd: (field: keyof ServiceFormData, value: string) => void
  onRemove: (field: keyof ServiceFormData, index: number) => void
}) {
  const [input, setInput] = useState("")

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault()
      onAdd(field, input.trim())
      setInput("")
    }
  }

  const items = (watch(field) as string[]) ?? []

  return (
    <div className="space-y-2">
      <label className="text-sm text-admin-text-secondary">{label}</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {items.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-admin-surface/60 text-xs text-admin-text-primary">
            {item}
            <button type="button" onClick={() => onRemove(field, i)} className="text-admin-text-secondary hover:text-admin-danger transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            </button>
          </span>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type and press Enter to add..."
        className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
      />
    </div>
  )
}
