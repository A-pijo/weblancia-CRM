"use client"

import { useState, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils/cn"

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  hidden?: "sm" | "md" | "lg"
  render: (item: T) => React.ReactNode
  width?: string
}

interface DataTableProps<T> {
  items: T[]
  total: number
  page: number
  totalPages: number
  columns: Column<T>[]
  searchable?: boolean
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (query: string) => void
  filters?: { label: string; value: string | number | null }[]
  filterValue?: string
  onFilter?: (value: string) => void
  bulkActions?: { label: string; value: string }[]
  onBulkAction?: (action: string, ids: number[]) => void
  onPageChange: (page: number) => void
  getId: (item: T) => number
  emptyState?: React.ReactNode
  onSort?: (key: string, direction: "asc" | "desc") => void
  sortKey?: string
  sortDirection?: "asc" | "desc"
}

export function DataTable<T>({
  items, total, page, totalPages, columns,
  searchable, searchPlaceholder = "Search...", searchValue = "", onSearch,
  filters, filterValue, onFilter,
  bulkActions, onBulkAction,
  onPageChange, getId, emptyState,
  onSort, sortKey, sortDirection: externalSortDirection,
}: DataTableProps<T>) {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [localSearch, setLocalSearch] = useState(searchValue)
  const [localSortKey, setLocalSortKey] = useState<string | undefined>(sortKey)
  const [localSortDir, setLocalSortDir] = useState<"asc" | "desc">(externalSortDirection || "asc")
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleSearch = useCallback((value: string) => {
    setLocalSearch(value)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => onSearch?.(value), 300)
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
    else setSelected(new Set(items.map((s) => getId(s))))
  }

  const handleSort = (key: string) => {
    const dir = localSortKey === key && localSortDir === "asc" ? "desc" : "asc"
    setLocalSortKey(key)
    setLocalSortDir(dir)
    onSort?.(key, dir)
  }

  const allSelected = items.length > 0 && selected.size === items.length

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {searchable && (
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-secondary">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={localSearch}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full h-9 pl-9 pr-3 bg-admin-bg-tertiary border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
            />
          </div>
        )}
        {filters && onFilter && (
          <select
            value={filterValue}
            onChange={(e) => onFilter(e.target.value)}
            className="h-9 px-3 bg-admin-bg-tertiary border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
          >
            {filters.map((f) => (
              <option key={String(f.value)} value={String(f.value)}>{f.label}</option>
            ))}
          </select>
        )}
        {bulkActions && onBulkAction && selected.size > 0 && (
          <select
            onChange={(e) => { if (e.target.value) { onBulkAction(e.target.value, Array.from(selected)); setSelected(new Set()); e.target.value = "" } }}
            className="h-9 px-3 bg-admin-bg-tertiary border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
          >
            <option value="">Bulk ({selected.size})</option>
            {bulkActions.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        )}
      </div>

      <div   className="overflow-x-auto rounded-xl border border-admin-border bg-admin-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border">
              <th className="w-10 px-3 py-3 sticky top-0 bg-admin-surface z-10">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  className="rounded border-admin-border bg-admin-bg-tertiary text-admin-accent focus:ring-admin-accent"
                />
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "text-left font-medium text-admin-text-secondary py-3 px-3 sticky top-0 bg-admin-surface z-10",
                    col.sortable && "cursor-pointer hover:text-admin-text-primary select-none",
                    col.hidden === "sm" && "hidden sm:table-cell",
                    col.hidden === "md" && "hidden md:table-cell",
                    col.hidden === "lg" && "hidden lg:table-cell",
                  )}
                  onClick={() => col.sortable && handleSort(col.key)}
                  style={col.width ? { width: col.width } : undefined}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{col.label}</span>
                    {col.sortable && localSortKey === col.key && (
                      <span className="text-admin-accent">
                        {localSortDir === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="text-right font-medium text-admin-text-secondary py-3 px-3 sticky top-0 bg-admin-surface z-10">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {items.map((item) => {
                const id = getId(item)
                return (
                  <motion.tr
                    key={id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "border-b border-admin-border/30 transition-colors",
                      selected.has(id) ? "bg-admin-accent/5" : "hover:bg-admin-surface",
                    )}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(id)}
                        onChange={() => toggleSelect(id)}
                        className="rounded border-admin-border bg-admin-bg-tertiary text-admin-accent focus:ring-admin-accent"
                      />
                    </td>
                    {columns.map((col) => (
                      <td
                        key={col.key}
                        className={cn(
                          "px-3 py-3",
                          col.hidden === "sm" && "hidden sm:table-cell",
                          col.hidden === "md" && "hidden md:table-cell",
                          col.hidden === "lg" && "hidden lg:table-cell",
                        )}
                      >
                        {col.render(item)}
                      </td>
                    ))}
                    <td className="px-3 py-3 text-right">
                      {null}
                    </td>
                  </motion.tr>
                )
              })}
            </AnimatePresence>
            {items.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-3 py-12">
                  {emptyState || (
                    <div className="text-center text-admin-text-secondary text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-2 text-admin-text-muted">
                        <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" />
                      </svg>
                      <p>No results found</p>
                    </div>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-admin-text-tertiary">{total} total</p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
              className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4))
              const num = start + i
              if (num > totalPages) return null
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onPageChange(num)}
                  className={cn(
                    "w-8 h-8 rounded text-xs transition-colors",
                    num === page
                      ? "bg-admin-accent/10 text-admin-accent font-medium"
                      : "text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface",
                  )}
                >
                  {num}
                </button>
              )
            })}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
              className="px-3 py-1.5 rounded text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
