"use client"

import { cn } from "@/lib/utils/cn"

export type FileStatus = "pending" | "uploading" | "done" | "error"

export interface UploadFileItem {
  id: string
  file: File
  status: FileStatus
  progress: number
  error?: string
}

interface UploadProgressProps {
  items: UploadFileItem[]
  onRemove?: (id: string) => void
}

function FileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  )
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadProgress({ items, onRemove }: UploadProgressProps) {
  if (!items.length) return null

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            "flex items-center gap-3 rounded-lg border px-4 py-3 transition-all",
            item.status === "error"
              ? "border-red-500/20 bg-red-500/5"
              : item.status === "done"
              ? "border-green-500/20 bg-green-500/5"
              : "border-admin-border/50 bg-admin-surface/50",
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
            item.status === "done" ? "bg-admin-success/10 text-admin-success"
            : item.status === "error" ? "bg-admin-danger/10 text-admin-danger"
            : "bg-admin-surface text-admin-text-secondary",
          )}>
            {item.status === "done" ? <CheckIcon /> : item.status === "error" ? <AlertIcon /> : <FileIcon />}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-admin-text-primary truncate">{item.file.name}</p>
              <span className="text-xs text-admin-text-secondary shrink-0">{formatSize(item.file.size)}</span>
            </div>

            {(item.status === "uploading" || item.status === "pending") && (
              <div className="mt-1.5 w-full h-1.5 rounded-full bg-admin-surface overflow-hidden">
                <div
                  className="h-full rounded-full bg-admin-accent transition-all duration-300 ease-out"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
            )}

            {item.status === "uploading" && (
              <p className="text-xs text-admin-text-secondary mt-0.5">{item.progress}%</p>
            )}

            {item.error && (
              <p className="text-xs text-admin-danger mt-0.5">{item.error}</p>
            )}
          </div>

          {item.status !== "uploading" && onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              className="p-1 rounded text-admin-text-tertiary hover:text-admin-text-secondary hover:bg-admin-surface transition-colors"
              aria-label={`Remove ${item.file.name}`}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
