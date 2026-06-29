"use client"

import { useState, useCallback, useRef } from "react"
import { cn } from "@/lib/utils/cn"

interface Role { id: number; name: string }
interface User {
  id: number
  name: string
  email: string
  isActive: boolean
  createdAt: string
  role: Role
}

interface UsersTableProps {
  items: User[]
  total: number
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  onSearch: (query: string) => void
  onEdit: (id: number) => void
  onToggle: (id: number, isActive: boolean) => void
  onDelete: (id: number) => void
}

export function UsersTable({ items, total, page, totalPages, onPageChange, onSearch, onEdit, onToggle, onDelete }: UsersTableProps) {
  const [search, setSearch] = useState("")
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(undefined)

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => onSearch(value), 300)
  }, [onSearch])

  return (
    <div className="space-y-4">
      <div className="relative flex-1 max-w-sm">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-admin-text-secondary"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        <input type="text" value={search} onChange={(e) => handleSearch(e.target.value)} placeholder="Search users..." className="w-full h-9 pl-9 pr-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors" />
      </div>
      <div className="overflow-x-auto rounded-xl border border-admin-border/50 bg-[#141414]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-admin-border/30">
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3">Name</th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden md:table-cell">Email</th>
              <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden sm:table-cell">Role</th>
              <th className="text-center font-medium text-admin-text-secondary py-3 px-3">Status</th>
              <th className="text-right font-medium text-admin-text-secondary py-3 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((u) => (
              <tr key={u.id} className="border-b border-admin-border/20 hover:bg-admin-surface/20 transition-colors">
                <td className="px-3 py-3">
                  <button type="button" onClick={() => onEdit(u.id)} className="text-admin-text-primary hover:text-admin-accent transition-colors text-left font-medium">{u.name}</button>
                </td>
                <td className="px-3 py-3 hidden md:table-cell"><span className="text-xs text-admin-text-secondary">{u.email}</span></td>
                <td className="px-3 py-3 hidden sm:table-cell"><span className="text-xs text-admin-text-secondary">{u.role.name}</span></td>
                <td className="px-3 py-3 text-center">
                  <button type="button" onClick={() => onToggle(u.id, !u.isActive)} className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors", u.isActive ? "bg-admin-success/10 text-admin-success hover:bg-admin-success/15" : "bg-admin-surface text-admin-text-secondary hover:bg-admin-surface")}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", u.isActive ? "bg-admin-success" : "bg-admin-text-muted")} />
                    {u.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-3 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button type="button" onClick={() => onEdit(u.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors" aria-label="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </button>
                    <button type="button" onClick={() => onDelete(u.id)} className="p-1.5 rounded text-admin-text-secondary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors" aria-label="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="px-3 py-12 text-center text-admin-text-secondary text-sm">No users found</td></tr>}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-admin-text-tertiary">{total} users total</p>
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
