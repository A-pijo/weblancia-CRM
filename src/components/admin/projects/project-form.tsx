"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, type ProjectFormData } from "@/lib/validation/project"
import { cn } from "@/lib/utils/cn"
import { ImagePicker } from "@/components/admin/media/image-picker"

interface ProjectFormProps {
  defaultValues?: Partial<ProjectFormData>
  onSubmit: (data: ProjectFormData) => Promise<void>
  isSubmitting?: boolean
}

const TABS = ["General", "Content", "Results", "Media", "Team", "SEO"] as const

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

export function ProjectForm({ defaultValues, onSubmit, isSubmitting }: ProjectFormProps) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General")
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false)

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      client: "",
      clientLogo: "",
      clientWebsite: "",
      industry: "",
      country: "",
      date: "",
      duration: "",
      url: "",
      isFeatured: false,
      isActive: true,
      displayOrder: 0,
      status: "completed",
      fullCaseStudy: "",
      challenge: "",
      solution: "",
      results: [],
      technologies: [],
      servicesProvided: [],
      teamMembers: [],
      clientTestimonial: undefined,
      featuredImage: "",
      desktopScreenshot: "",
      tabletScreenshot: "",
      mobileScreenshot: "",
      videoUrl: "",
      ...defaultValues,
    },
  })

  const title = watch("title")
  const featuredImage = watch("featuredImage")

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setValue("title", val)
    if (!slugManuallyEdited) {
      setValue("slug", generateSlug(val))
    }
  }

  const handleTagAdd = (field: keyof ProjectFormData, value: string) => {
    const current = (watch(field) as string[]) ?? []
    if (!current.includes(value)) {
      setValue(field, [...current, value] as never)
    }
  }

  const handleTagRemove = (field: keyof ProjectFormData, index: number) => {
    const current = (watch(field) as string[]) ?? []
    setValue(field, current.filter((_, i) => i !== index) as never)
  }

  const handleKpiAdd = () => {
    const current = (watch("results") as { label: string; value: string }[]) ?? []
    setValue("results", [...current, { label: "", value: "" }] as never)
  }

  const handleKpiChange = (index: number, field: "label" | "value", val: string) => {
    const current = [...((watch("results") as { label: string; value: string }[]) ?? [])]
    current[index] = { ...current[index], [field]: val }
    setValue("results", current as never)
  }

  const handleKpiRemove = (index: number) => {
    const current = (watch("results") as { label: string; value: string }[]) ?? []
    setValue("results", current.filter((_, i) => i !== index) as never)
  }

  const handleTeamAdd = () => {
    const current = (watch("teamMembers") as { name: string; role: string }[]) ?? []
    setValue("teamMembers", [...current, { name: "", role: "" }] as never)
  }

  const handleTeamChange = (index: number, field: "name" | "role", val: string) => {
    const current = [...((watch("teamMembers") as { name: string; role: string }[]) ?? [])]
    current[index] = { ...current[index], [field]: val }
    setValue("teamMembers", current as never)
  }

  const handleTeamRemove = (index: number) => {
    const current = (watch("teamMembers") as { name: string; role: string }[]) ?? []
    setValue("teamMembers", current.filter((_, i) => i !== index) as never)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex border-b border-admin-border/50 gap-0 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] whitespace-nowrap",
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
                <label className="text-sm text-admin-text-secondary">Project Name *</label>
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
                  {...register("slug")}
                  onChange={(e) => { setSlugManuallyEdited(true); setValue("slug", e.target.value) }}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Client Name</label>
                <input
                  {...register("client")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Client Website</label>
                <input
                  {...register("clientWebsite")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Industry</label>
                <input
                  {...register("industry")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="E-commerce, Healthcare..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Country</label>
                <input
                  {...register("country")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="Morocco"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Status</label>
                <select
                  {...register("status")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                >
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Completion Date</label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Duration</label>
                <input
                  {...register("duration")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="3 months"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Challenge</label>
                <textarea
                  {...register("challenge")}
                  rows={6}
                  className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-y"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Solution</label>
                <textarea
                  {...register("solution")}
                  rows={6}
                  className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-y"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Full Case Study (Markdown)</label>
              <textarea
                {...register("fullCaseStudy")}
                rows={12}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-y font-mono"
                placeholder="Supports Markdown..."
              />
            </div>

            <TagSection
              label="Technologies Used"
              field="technologies"
              watch={watch}
              setValue={setValue}
              onAdd={handleTagAdd}
              onRemove={handleTagRemove}
            />

            <TagSection
              label="Services Provided"
              field="servicesProvided"
              watch={watch}
              setValue={setValue}
              onAdd={handleTagAdd}
              onRemove={handleTagRemove}
            />
          </>
        )}

        {tab === "Results" && (
          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Project URL</label>
              <input
                {...register("url")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-admin-text-secondary">KPI Results</label>
                <button type="button" onClick={handleKpiAdd} className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors">+ Add KPI</button>
              </div>
              {(watch("results") as { label: string; value: string }[] | undefined)?.map((kpi, i) => (
                <div key={i} className="flex gap-3 items-start bg-admin-surface/30 rounded-lg p-3 border border-admin-border/30">
                  <div className="flex-1 space-y-2">
                    <input
                      value={kpi.value}
                      onChange={(e) => handleKpiChange(i, "value", e.target.value)}
                      placeholder="e.g. +250%"
                      className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                    />
                    <input
                      value={kpi.label}
                      onChange={(e) => handleKpiChange(i, "label", e.target.value)}
                      placeholder="e.g. Traffic Increase"
                      className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                    />
                  </div>
                  <button type="button" onClick={() => handleKpiRemove(i)} className="p-1.5 rounded text-admin-text-tertiary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-admin-border/30 pt-5">
              <label className="text-sm text-admin-text-secondary">Client Testimonial</label>
              <textarea
                value={(watch("clientTestimonial") as { quote?: string })?.quote ?? ""}
                onChange={(e) => setValue("clientTestimonial", { ...(watch("clientTestimonial") as any ?? {}), quote: e.target.value } as never)}
                rows={3}
                className="w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none"
                placeholder="Quote"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={(watch("clientTestimonial") as { author?: string })?.author ?? ""}
                  onChange={(e) => setValue("clientTestimonial", { ...(watch("clientTestimonial") as any ?? {}), author: e.target.value } as never)}
                  className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="Author name"
                />
                <input
                  value={(watch("clientTestimonial") as { role?: string })?.role ?? ""}
                  onChange={(e) => setValue("clientTestimonial", { ...(watch("clientTestimonial") as any ?? {}), role: e.target.value } as never)}
                  className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                  placeholder="Author role"
                />
              </div>
            </div>
          </div>
        )}

        {tab === "Media" && (
          <div className="space-y-5">
            <ImagePicker
              value={featuredImage}
              onChange={(url) => setValue("featuredImage", url ?? "")}
              folder="projects"
              label="Featured Image"
            />

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Client Logo URL</label>
              <input
                {...register("clientLogo")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Desktop Screenshot URL</label>
                <input
                  {...register("desktopScreenshot")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Tablet Screenshot URL</label>
                <input
                  {...register("tabletScreenshot")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-admin-text-secondary">Mobile Screenshot URL</label>
                <input
                  {...register("mobileScreenshot")}
                  className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Video URL (YouTube/Vimeo)</label>
              <input
                {...register("videoUrl")}
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
          </div>
        )}

        {tab === "Team" && (
          <div className="space-y-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm text-admin-text-secondary">Team Members</label>
                <button type="button" onClick={handleTeamAdd} className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors">+ Add member</button>
              </div>
              {(watch("teamMembers") as { name: string; role: string }[] | undefined)?.map((member, i) => (
                <div key={i} className="flex gap-3 items-start bg-admin-surface/30 rounded-lg p-3 border border-admin-border/30">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      value={member.name}
                      onChange={(e) => handleTeamChange(i, "name", e.target.value)}
                      placeholder="Name"
                      className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                    />
                    <input
                      value={member.role}
                      onChange={(e) => handleTeamChange(i, "role", e.target.value)}
                      placeholder="Role"
                      className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                    />
                  </div>
                  <button type="button" onClick={() => handleTeamRemove(i)} className="p-1.5 rounded text-admin-text-tertiary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "SEO" && (
          <div className="space-y-4">
            <p className="text-xs text-admin-text-tertiary">SEO metadata is managed through the SeoMetadata model.</p>
            <div className="space-y-2">
              <label className="text-sm text-admin-text-secondary">Meta Title</label>
              <input
                className="w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="SEO title (auto-generated from project title)"
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

      <div className="flex justify-end gap-3 pt-4 border-t border-admin-border/50">
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
          {defaultValues ? "Update Project" : "Create Project"}
        </button>
      </div>
    </form>
  )
}

function TagSection({
  label, field, watch, setValue, onAdd, onRemove,
}: {
  label: string
  field: keyof ProjectFormData
  watch: ReturnType<typeof useForm<ProjectFormData>>["watch"]
  setValue: ReturnType<typeof useForm<ProjectFormData>>["setValue"]
  onAdd: (field: keyof ProjectFormData, value: string) => void
  onRemove: (field: keyof ProjectFormData, index: number) => void
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
