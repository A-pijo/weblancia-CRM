"use client"

import { useState, useCallback } from "react"
import { UploadDropzone } from "./upload-dropzone"
import { UploadProgress, type UploadFileItem } from "./upload-progress"

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"]
const MAX_SIZE = 10 * 1024 * 1024

let idCounter = 0
function nextId() {
  return `upload-${++idCounter}-${Date.now()}`
}

function validateFiles(files: File[]): { valid: File[]; errors: { name: string; reason: string }[] } {
  const valid: File[] = []
  const errors: { name: string; reason: string }[] = []

  for (const file of files) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push({ name: file.name, reason: "Format non supporté" })
      continue
    }
    if (file.size > MAX_SIZE) {
      errors.push({ name: file.name, reason: "Dépasse 10 Mo" })
      continue
    }
    valid.push(file)
  }

  return { valid, errors }
}

interface MediaUploaderProps {
  onUploadComplete?: () => void
  category?: string
}

export function MediaUploader({ onUploadComplete, category = "general" }: MediaUploaderProps) {
  const [queue, setQueue] = useState<UploadFileItem[]>([])
  const [uploading, setUploading] = useState(false)

  const handleFilesSelected = useCallback((files: File[]) => {
    const { valid, errors: validationErrors } = validateFiles(files)

    const newItems: UploadFileItem[] = valid.map((f) => ({
      id: nextId(),
      file: f,
      status: "pending" as const,
      progress: 0,
    }))

    setQueue((prev) => [...prev, ...newItems])

    if (validationErrors.length) {
      setQueue((prev) => [
        ...prev,
        ...validationErrors.map((e) => ({
          id: nextId(),
          file: new File([], e.name),
          status: "error" as const,
          progress: 0,
          error: e.reason,
        })),
      ])
    }

    if (valid.length) {
      uploadFiles(newItems)
    }
  }, [category])

  const uploadFiles = async (items: UploadFileItem[]) => {
    setUploading(true)

    for (const item of items) {
      setQueue((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: "uploading" as const } : p)),
      )

      try {
        const formData = new FormData()
        formData.append("files", item.file)
        formData.append("category", category)

        const xhr = new XMLHttpRequest()

        await new Promise<void>((resolve, reject) => {
          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              const percent = Math.round((e.loaded / e.total) * 100)
              setQueue((prev) =>
                prev.map((p) => (p.id === item.id ? { ...p, progress: percent } : p)),
              )
            }
          }

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              setQueue((prev) =>
                prev.map((p) => (p.id === item.id ? { ...p, status: "done" as const, progress: 100 } : p)),
              )
              resolve()
            } else {
              reject(new Error(`Erreur ${xhr.status}`))
            }
          }

          xhr.onerror = () => reject(new Error("Erreur réseau"))

          xhr.open("POST", "/api/media")
          xhr.send(formData)
        })
      } catch (e) {
        setQueue((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? { ...p, status: "error" as const, error: e instanceof Error ? e.message : "Échec" }
              : p,
          ),
        )
      }
    }

    setUploading(false)
    onUploadComplete?.()
  }

  const handleRemove = useCallback((id: string) => {
    setQueue((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return (
    <div className="space-y-4">
      <UploadDropzone onFilesSelected={handleFilesSelected} disabled={uploading} />
      <UploadProgress items={queue} onRemove={handleRemove} />
    </div>
  )
}
