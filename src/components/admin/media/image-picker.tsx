"use client"

/* eslint-disable @next/next/no-img-element -- dynamic user-uploaded media URLs */

import { useState, useRef, useCallback } from "react"

interface ImagePickerProps {
  value?: string | null
  onChange: (url: string | null) => void
  folder?: string
  label?: string
}

export function ImagePicker({ value, onChange, folder = "general", label = "Image" }: ImagePickerProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ""

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("files", file)
      formData.append("category", folder)

      const xhr = new XMLHttpRequest()
      const url = await new Promise<string>((resolve, reject) => {
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100))
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const result = JSON.parse(xhr.responseText)
              const item = result.data?.items?.[0]
              if (item?.url) resolve(item.url)
              else reject(new Error("Aucune URL retournée"))
            } catch {
              reject(new Error("Réponse invalide"))
            }
          } else {
            reject(new Error(`Erreur ${xhr.status}`))
          }
        }
        xhr.onerror = () => reject(new Error("Erreur réseau"))
        xhr.open("POST", "/api/media")
        xhr.send(formData)
      })

      onChange(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload")
    } finally {
      setUploading(false)
    }
  }, [folder, onChange])

  const handleRemove = useCallback(() => {
    onChange(null)
    setError(null)
  }, [onChange])

  return (
    <div className="space-y-2">
      <label className="text-sm text-admin-text-secondary">{label}</label>

      {value ? (
        <div className="relative group rounded-lg overflow-hidden border border-admin-border/50 bg-admin-surface/50">
          <img
            src={value}
            alt="Preview"
            className="w-full h-40 object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={handleClick}
              className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-sm hover:bg-white/30 transition-colors"
            >
              Remplacer
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="h-10 px-4 rounded-lg border border-dashed border-admin-text-muted/50 text-sm text-admin-text-secondary hover:border-admin-accent hover:text-admin-accent transition-colors disabled:opacity-50"
          >
            {uploading ? `Upload... ${progress}%` : "Ajouter une image"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            className="hidden"
            onChange={handleFileChange}
            disabled={uploading}
          />
        </div>
      )}

      {uploading && (
        <div className="w-full h-1.5 rounded-full bg-admin-surface overflow-hidden">
          <div className="h-full rounded-full bg-admin-accent transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
      {error && <p className="text-xs text-admin-danger">{error}</p>}
    </div>
  )
}
