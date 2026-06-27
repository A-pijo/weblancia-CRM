"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils/cn"

interface CourseItem {
  id: number
  slug: string
  title: string
  instructor: string | null
  level: string | null
  duration: string | null
  price: number | null
  isPublished: boolean
  isFeatured: boolean
  category: { id: number; title: string } | null
}

interface CourseTableProps {
  items: CourseItem[]
  total: number
  page: number
  totalPages: number
  categories: { id: number; title: string }[]
  onPageChange: (page: number) => void
  onSearch: (query: string) => void
  onCategoryFilter: (categoryId: number | null) => void
  onLevelFilter: (level: string | null) => void
  onEdit: (id: number) => void
  onDuplicate: (id: number) => void
  onToggle: (id: number, isPublished: boolean) => void
  onDelete: (id: number) => void
  onBulkAction: (action: string, ids: number[]) => void
}

export function CourseTable({
  items, total, page, totalPages, categories,
  onPageChange, onSearch, onCategoryFilter, onLevelFilter,
  onEdit, onDuplicate, onToggle, onDelete, onBulkAction,
}: CourseTableProps) {
  const [search, setSearch] = useState("")
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => onSearch(value), 300)
  }, [onSearch])

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === items.length) setSelected(new Set())
    else setSelected(new Set(items.map((s) => s.id)))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-secondary">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full h-9 pl-9 pr-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
          />
        </div>
        <select
          onChange={(e) => onCategoryFilter(e.target.value ? Number(e.target.value) : null)}
          className="h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
        <select
          onChange={(e) => onLevelFilter(e.target.value || null)}
          className="h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
        {selected.size > 0 && (
          <select
            onChange={(e) => { onBulkAction(e.target.value, Array.from(selected)); setSelected(new Set()); e.target.value = "" }}
            className="h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
          >
            <option value="">Bulk ({selected.size})</option>
            <option value="publish">Publish</option>
            <option value="unpublish">Unpublish</option>
            <option value="delete">Delete</option>
          </select>
        )}
      </div>

      <div className="overflow-x-auto rounded-xl border border-admin-border/50 bg-[#141414]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border/30">
              <th className="w-10 px-3 py-3">
                <input type="checkbox" checked={selected.size === items.length && items.length > 0} onChange={toggleAll} className="rounded border-admin-text-muted bg-admin-surface" />
              </th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3">Title</th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden md:table-cell">Category</th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden lg:table-cell">Instructor</th>
              <th className="text-center font-medium text-admin-text-secondary py-3 px-3 hidden sm:table-cell">Level</th>
              <th className="text-right font-medium text-admin-text-secondary py-3 px-3 hidden sm:table-cell">Price</th>
              <th className="text-center font-medium text-admin-text-secondary py-3 px-3 hidden sm:table-cell">Featured</th>
              <th className="text-center font-medium text-admin-text-secondary py-3 px-3">Status</th>
              <th className="text-right font-medium text-admin-text-secondary py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((course) => (
              <tr key={course.id} className="border-b border-admin-border/20 hover:bg-admin-surface/20 transition-colors">
                <td className="px-3 py-3">
                  <input type="checkbox" checked={selected.has(course.id)} onChange={() => toggleSelect(course.id)} className="rounded border-admin-text-muted bg-admin-surface" />
                </td>
                <td className="px-3 py-3">
                  <button type="button" onClick={() => onEdit(course.id)} className="text-admin-text-primary hover:text-admin-accent transition-colors text-left font-medium">{course.title}</button>
                  <p className="text-xs text-admin-text-tertiary mt-0.5 truncate max-w-[200px]">{course.duration ?? "—"}</p>
                </td>
                <td className="px-3 py-3 hidden md:table-cell"><span className="text-xs text-admin-text-secondary">{course.category?.title ?? "—"}</span></td>
                <td className="px-3 py-3 hidden lg:table-cell"><span className="text-xs text-admin-text-secondary">{course.instructor ?? "—"}</span></td>
                <td className="px-3 py-3 text-center hidden sm:table-cell">
                  <span className={cn("inline-flex px-2 py-0.5 rounded text-xs font-medium",
                    course.level === "Beginner" ? "text-admin-success bg-admin-success/10" :
                    course.level === "Intermediate" ? "text-admin-warning bg-admin-warning/10" :
                    course.level === "Advanced" ? "text-admin-danger bg-admin-danger/10" : "text-admin-text-secondary bg-admin-surface"
                  )}>{course.level ?? "—"}</span>
                </td>
                <td className="px-3 py-3 text-right hidden sm:table-cell">
                  <span className="text-xs text-admin-text-secondary">
                    {course.price != null ? `$${course.price}` : "—"}
                    {course.price != null && course.price === 0 && <span className="text-admin-success ml-1">Free</span>}
                  </span>
                </td>
                <td className="px-3 py-3 text-center hidden sm:table-cell">
                  {course.isFeatured ? <span className="text-admin-warning text-xs">★</span> : <span className="text-admin-text-muted text-xs">☆</span>}
                </td>
                <td className="px-3 py-3 text-center">
                  <button type="button" onClick={() => onToggle(course.id, !course.isPublished)}
                    className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                      course.isPublished ? "bg-admin-success/10 text-admin-success hover:bg-admin-success/15" : "bg-admin-surface text-admin-text-secondary hover:bg-admin-surface"
                    )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", course.isPublished ? "bg-admin-success" : "bg-admin-text-muted")} />
                    {course.isPublished ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onEdit(course.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors" aria-label="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <a href={`/academy/${course.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors" aria-label="Preview">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    </a>
                    <button type="button" onClick={() => onDuplicate(course.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors" aria-label="Duplicate">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    </button>
                    <button type="button" onClick={() => onDelete(course.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors" aria-label="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={9} className="px-3 py-12 text-center text-admin-text-secondary text-sm">No courses found</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-admin-text-tertiary">{total} courses total</p>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)}
              className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Previous</button>
            <span className="text-xs text-admin-text-tertiary px-2">Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}
              className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
