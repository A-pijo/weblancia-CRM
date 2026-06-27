"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils/cn"
import { X } from "@/components/icons"

export interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const dialog = dialogRef.current
    const previouslyFocused = document.activeElement as HTMLElement
    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }
      if (e.key === "Tab" && dialog) {
        const focusable = dialog.querySelectorAll<HTMLElement>(focusableSelector)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    requestAnimationFrame(() => {
      dialog?.querySelector<HTMLElement>(focusableSelector)?.focus()
    })

    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
      <style>{`
        @keyframes dialog-overlay{from{opacity:0}to{opacity:1}}
        @keyframes dialog-panel{from{opacity:0;transform:scale(0.95) translateY(4px)}to{opacity:1;transform:scale(1) translateY(0)}}
      `}</style>
      <div
        className="fixed inset-0 bg-overlay"
        style={{ animation: "dialog-overlay 200ms ease-out" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title || "Dialog"}
        className={cn(
          "relative bg-surface rounded-radius-lg border border-border shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto",
          className,
        )}
        style={{ animation: "dialog-panel 200ms ease-out" }}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-0">
          {title && <h2 className="text-h5 text-text-primary">{title}</h2>}
          <button
            onClick={onClose}
            className={cn(
              "ml-auto h-8 w-8 flex items-center justify-center rounded-radius-sm",
              "text-text-tertiary hover:text-text-primary hover:bg-bg-secondary",
              "transition-colors duration-200 shrink-0",
            )}
            aria-label="Close dialog"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export { Dialog }
