"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@/lib/utils/cn"

interface UploadDropzoneProps {
  onFilesSelected: (files: File[]) => void
  disabled?: boolean
}

function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

export function UploadDropzone({ onFilesSelected, disabled }: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragging(true)
    else setDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(false)
    if (disabled) return
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type.startsWith("image/"),
    )
    if (files.length) onFilesSelected(files)
  }, [onFilesSelected, disabled])

  const handleClick = () => inputRef.current?.click()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length) onFilesSelected(files)
    e.target.value = ""
  }

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleClick() }}
      role="button"
      tabIndex={0}
      aria-label="Upload media files"
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 sm:p-8 cursor-pointer transition-all duration-200",
        dragging
          ? "border-admin-accent bg-admin-accent/5"
          : "border-admin-text-muted/50 hover:border-admin-text-muted bg-admin-surface/50 hover:bg-admin-surface/80",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
        multiple
        className="hidden"
        onChange={handleChange}
        disabled={disabled}
      />
      <div className={cn("mb-3 text-admin-text-secondary transition-colors", dragging && "text-admin-accent")}>
        <UploadIcon />
      </div>
      <p className="text-sm font-medium text-admin-text-primary mb-1">
        {dragging ? "Déposez vos fichiers ici" : "Glissez-déposez vos images ici"}
      </p>
      <p className="text-xs text-admin-text-secondary mb-3">ou cliquez pour parcourir</p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {["JPG", "PNG", "WebP", "AVIF", "SVG"].map((fmt) => (
          <span key={fmt} className="px-2 py-0.5 rounded-md bg-admin-surface text-[11px] text-admin-text-secondary font-medium">
            {fmt}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-admin-text-tertiary mt-2">Max 10 Mo par fichier</p>
    </div>
  )
}
