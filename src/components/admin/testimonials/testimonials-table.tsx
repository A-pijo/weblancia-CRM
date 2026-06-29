"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils/cn"

interface Testimonial {
  id: number
  name: string
  role: string | null
  company: string | null
  content: string
  rating: number | null
  displayOrder: number
  isActive: boolean
  createdAt: string
}

interface TestimonialsTableProps {
  items: Testimonial[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onSearch: (query: string) => void
  onEdit: (id: number) => void
  onToggle: (id: number, isActive: boolean) => void
  onDelete: (id: number) => void
  onBulkAction: (action: string, ids: number[]) => void
}

export function TestimonialsTable({
  items, total, page, totalPages,
  onPageChange, onSearch,
  onEdit, onToggle, onDelete, onBulkAction,
}: TestimonialsTableProps) {
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
      if (next.has(id)) next.delete(id); else next.add(id)
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
          <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search testimonials..." className="w-full h-9 pl-9 pr-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors" />
        </div>
        {selected.size > 0 && (
          <select onChange={(e) => { onBulkAction(e.target.value, Array.from(selected)); setSelected(new Set()); e.target.value = "" }} className="h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
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
              <th className="w-10 px-3 py-3"><input type="checkbox" checked={selected.size === items.length && items.length > 0} onChange={toggleAll} className="rounded border-admin-text-muted bg-admin-surface" /></th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3">Name</th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden md:table-cell">Company</th>
              <th className="text-center font-medium text-admin-text-secondary py-3 px-3 hidden sm:table-cell">Rating</th>
              <th className="text-center font-medium text-admin-text-secondary py-3 px-3">Status</th>
              <th className="text-right font-medium text-admin-text-secondary py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-b border-admin-border/20 hover:bg-admin-surface/20 transition-colors">
                <td className="px-3 py-3"><input type="checkbox" checked={selected.has(t.id)} onChange={() => toggleSelect(t.id)} className="rounded border-admin-text-muted bg-admin-surface" /></td>
                <td className="px-3 py-3">
                  <button type="button" onClick={() => onEdit(t.id)} className="text-admin-text-primary hover:text-admin-accent transition-colors text-left font-medium">{t.name}</button>
                  {t.role && <p className="text-xs text-admin-text-tertiary mt-0.5">{t.role}</p>}
                </td>
                <td className="px-3 py-3 hidden md:table-cell"><span className="text-xs text-admin-text-secondary">{t.company ?? "—"}</span></td>
                <td className="px-3 py-3 text-center hidden sm:table-cell">
                  {t.rating ? <span className="text-admin-warning text-xs">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</span> : <span className="text-admin-text-muted text-xs">—</span>}
                </td>
                <td className="px-3 py-3 text-center">
                  <button type="button" onClick={() => onToggle(t.id, !t.isActive)} className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors", t.isActive ? "bg-admin-success/10 text-admin-success hover:bg-admin-success/15" : "bg-admin-surface text-admin-text-secondary hover:bg-admin-surface")}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", t.isActive ? "bg-admin-success" : "bg-admin-text-muted")} />
                    {t.isActive ? "Active" : "Hidden"}
                  </button>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onEdit(t.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors" aria-label="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button type="button" onClick={() => onDelete(t.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors" aria-label="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-12 text-center text-admin-text-secondary text-sm">No testimonials found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-admin-text-tertiary">{total} testimonials total</p>
          <div className="flex items-center gap-1">
            <button type="button" disabled={page <= 1} onClick={() => onPageChange(page - 1)} className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Previous</button>
            <span className="text-xs text-admin-text-tertiary px-2">Page {page} of {totalPages}</span>
            <button type="button" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)} className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors">Next</button>
          </div>
        </div>
      )}
    </div>
  )
}
