"use client"

import { useState, useCallback } from "react"
import { cn } from "@/lib/utils/cn"

interface MediaItem {
  id: number
  url: string
  filename: string
  mimeType: string | null
  size: number | null
  width: number | null
  height: number | null
  alt: string | null
  createdAt: string
}

interface MediaListViewProps {
  items: MediaItem[]
}

function formatSize(bytes: number | null): string {
  if (!bytes) return "-"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

function getFileTypeLabel(mime: string | null): string {
  if (!mime) return "-"
  const map: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
    "image/webp": "WebP",
    "image/avif": "AVIF",
    "image/svg+xml": "SVG",
  }
  return map[mime] ?? mime.split("/").pop()?.toUpperCase() ?? "-"
}

export function MediaListView({ items: initialItems }: MediaListViewProps) {
  const [items, setItems] = useState<MediaItem[]>(initialItems)
  const [deleting, setDeleting] = useState<number | null>(null)

  const refresh = useCallback(async () => {
    const res = await fetch("/api/media?limit=50")
    const data = await res.json()
    setItems(data.items ?? [])
  }, [])

  const handleDelete = useCallback(async (id: number) => {
    if (!confirm("Delete this file?")) return
    setDeleting(id)
    await fetch(`/api/media/${id}`, { method: "DELETE" })
    setDeleting(null)
    refresh()
  }, [refresh])

  if (!items.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-admin-surface/50 flex items-center justify-center text-admin-text-secondary mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
        <p className="text-sm text-admin-text-secondary">No media uploaded yet</p>
        <p className="text-xs text-admin-text-tertiary mt-1">Drop images above to get started</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-admin-border/30">
            <th className="text-left font-medium text-admin-text-secondary py-2.5 px-3 w-12" />
            <th className="text-left font-medium text-admin-text-secondary py-2.5 px-3">Name</th>
            <th className="text-left font-medium text-admin-text-secondary py-2.5 px-3 hidden sm:table-cell">Type</th>
            <th className="text-left font-medium text-admin-text-secondary py-2.5 px-3 hidden md:table-cell">Dimensions</th>
            <th className="text-left font-medium text-admin-text-secondary py-2.5 px-3 hidden md:table-cell">Size</th>
            <th className="text-left font-medium text-admin-text-secondary py-2.5 px-3 hidden lg:table-cell">Date</th>
            <th className="text-right font-medium text-admin-text-secondary py-2.5 px-3 w-16" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-admin-border/20 hover:bg-admin-surface/20 transition-colors">
              <td className="py-2 px-3">
                <div className="w-10 h-10 rounded-lg bg-admin-surface overflow-hidden flex items-center justify-center">
                  {item.mimeType?.startsWith("image/") ? (
                    <img src={item.url} alt={item.alt ?? item.filename} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-admin-text-secondary">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                  )}
                </div>
              </td>
              <td className="py-2 px-3">
                <p className="text-admin-text-primary truncate max-w-[180px] sm:max-w-[240px]">{item.filename}</p>
              </td>
              <td className="py-2 px-3 hidden sm:table-cell">
                <span className="text-xs text-admin-text-secondary">{getFileTypeLabel(item.mimeType)}</span>
              </td>
              <td className="py-2 px-3 hidden md:table-cell text-admin-text-secondary">
                {item.width && item.height ? `${item.width}×${item.height}` : "-"}
              </td>
              <td className="py-2 px-3 hidden md:table-cell text-admin-text-secondary">{formatSize(item.size)}</td>
              <td className="py-2 px-3 hidden lg:table-cell text-admin-text-secondary text-xs">{formatDate(item.createdAt)}</td>
              <td className="py-2 px-3 text-right">
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deleting === item.id}
                  className={cn(
                    "p-1.5 rounded text-admin-text-tertiary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors",
                    deleting === item.id && "opacity-50",
                  )}
                  aria-label={`Delete ${item.filename}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
