"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils/cn"

interface BlogPost {
  id: number
  slug: string
  title: string
  excerpt: string | null
  author: string | null
  isPublished: boolean
  isFeatured: boolean
  publishedAt: string | null
  category: { id: number; title: string }
}

interface BlogTableProps {
  items: BlogPost[]
  total: number
  page: number
  totalPages: number
  categories: { id: number; title: string }[]
  onPageChange: (page: number) => void
  onSearch: (query: string) => void
  onCategoryFilter: (categoryId: number | null) => void
  onEdit: (id: number) => void
  onDuplicate: (id: number) => void
  onToggle: (id: number, isPublished: boolean) => void
  onDelete: (id: number) => void
  onBulkAction: (action: string, ids: number[]) => void
}

export function BlogTable({
  items, total, page, totalPages, categories,
  onPageChange, onSearch, onCategoryFilter,
  onEdit, onDuplicate, onToggle, onDelete, onBulkAction,
}: BlogTableProps) {
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
            placeholder="Search articles..."
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
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden lg:table-cell">Author</th>
              <th className="text-center font-medium text-admin-text-secondary py-3 px-3 hidden sm:table-cell">Featured</th>
              <th className="text-center font-medium text-admin-text-secondary py-3 px-3">Status</th>
              <th className="text-right font-medium text-admin-text-secondary py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((post) => (
              <tr key={post.id} className="border-b border-admin-border/20 hover:bg-admin-surface/20 transition-colors">
                <td className="px-3 py-3">
                  <input type="checkbox" checked={selected.has(post.id)} onChange={() => toggleSelect(post.id)} className="rounded border-admin-text-muted bg-admin-surface" />
                </td>
                <td className="px-3 py-3">
                  <button type="button" onClick={() => onEdit(post.id)} className="text-admin-text-primary hover:text-admin-accent transition-colors text-left font-medium">{post.title}</button>
                  <p className="text-xs text-admin-text-tertiary mt-0.5 truncate max-w-[250px]">{post.excerpt}</p>
                </td>
                <td className="px-3 py-3 hidden md:table-cell"><span className="text-xs text-admin-text-secondary">{post.category.title}</span></td>
                <td className="px-3 py-3 hidden lg:table-cell"><span className="text-xs text-admin-text-secondary">{post.author ?? "—"}</span></td>
                <td className="px-3 py-3 text-center hidden sm:table-cell">
                  {post.isFeatured ? <span className="text-admin-warning text-xs">★</span> : <span className="text-admin-text-muted text-xs">☆</span>}
                </td>
                <td className="px-3 py-3 text-center">
                  <button type="button" onClick={() => onToggle(post.id, !post.isPublished)}
                    className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
                      post.isPublished ? "bg-admin-success/10 text-admin-success hover:bg-admin-success/15" : "bg-admin-surface text-admin-text-secondary hover:bg-admin-surface"
                    )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", post.isPublished ? "bg-admin-success" : "bg-admin-text-muted")} />
                    {post.isPublished ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onEdit(post.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors" aria-label="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <a href={`/insights/${post.slug}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors" aria-label="Preview">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                    </a>
                    <button type="button" onClick={() => onDuplicate(post.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors" aria-label="Duplicate">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                    </button>
                    <button type="button" onClick={() => onDelete(post.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors" aria-label="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={7} className="px-3 py-12 text-center text-admin-text-secondary text-sm">No articles found</td></tr>}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-admin-text-tertiary">{total} articles total</p>
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
