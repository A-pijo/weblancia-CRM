"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils/cn"

interface FolderNode {
  id: number
  name: string
  slug: string
  parentId: number | null
  fileCount: number
  childFolderCount: number
}

interface FolderTreeProps {
  folders: FolderNode[]
  currentFolderId: number | null
}

export function FolderTree({ folders, currentFolderId }: FolderTreeProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState("")
  const [creating, setCreating] = useState(false)

  const rootFolders = folders.filter((f) => f.parentId === null)

  const getChildren = useCallback(
    (parentId: number) => folders.filter((f) => f.parentId === parentId),
    [folders],
  )

  const selectFolder = (id: number | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set("folderId", String(id))
    } else {
      params.delete("folderId")
    }
    router.push(`/admin/media?${params.toString()}`)
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      const res = await fetch("/api/media/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), parentId: currentFolderId ?? undefined }),
      })
      if (res.ok) {
        setNewName("")
        setShowCreate(false)
        router.refresh()
      }
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (folder: FolderNode) => {
    if (!confirm(`Supprimer le dossier "${folder.name}" ? Les fichiers seront déplacés hors du dossier.`)) return
    const res = await fetch(`/api/media/folders/${folder.id}`, { method: "DELETE" })
    if (res.ok) {
      if (currentFolderId === folder.id) selectFolder(null)
      router.refresh()
    }
  }

  const renderFolder = (folder: FolderNode, depth = 0) => {
    const children = getChildren(folder.id)
    const isActive = currentFolderId === folder.id
    return (
      <div key={folder.id}>
        <button
          type="button"
          onClick={() => selectFolder(folder.id)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors text-left",
            isActive
              ? "bg-admin-accent/15 text-admin-accent font-medium"
              : "text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface/30",
          )}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <span className="truncate">{folder.name}</span>
          {folder.fileCount > 0 && (
            <span className="ml-auto text-xs text-admin-text-tertiary">{folder.fileCount}</span>
          )}
        </button>
        {children.length > 0 && (
          <div>
            {children.map((child) => renderFolder(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-medium text-admin-text-tertiary uppercase tracking-wider">Dossiers</span>
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="p-1 rounded text-admin-text-tertiary hover:text-admin-accent hover:bg-admin-accent/10 transition-colors"
          aria-label="Nouveau dossier"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        onClick={() => selectFolder(null)}
        className={cn(
          "w-full flex items-center gap-2 px-2 py-1.5 text-sm rounded-md transition-colors text-left",
          currentFolderId === null
            ? "bg-admin-accent/15 text-admin-accent font-medium"
            : "text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface/30",
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
        Tous les fichiers
      </button>

      {rootFolders.map((folder) => renderFolder(folder))}

      {showCreate && (
        <div className="px-2 pt-1">
          <div className="flex gap-1">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nom du dossier"
              className="flex-1 px-2 py-1 text-xs rounded border border-admin-border/50 bg-admin-surface/50 text-admin-text-primary placeholder:text-admin-text-tertiary focus:outline-none focus:border-admin-accent"
              onKeyDown={(e) => { if (e.key === "Enter") handleCreate(); if (e.key === "Escape") setShowCreate(false) }}
              autoFocus
            />
            <button
              type="button"
              onClick={handleCreate}
              disabled={creating || !newName.trim()}
              className="px-2 py-1 text-xs rounded bg-admin-accent text-white hover:bg-admin-accent/90 disabled:opacity-50 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <div className="pt-2 mt-2 border-t border-admin-border/20 px-2">
        {rootFolders.length === 0 && (
          <p className="text-xs text-admin-text-tertiary text-center py-2">
            Aucun dossier
          </p>
        )}
      </div>
    </div>
  )
}
