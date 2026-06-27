"use client"

import { cn } from "@/lib/utils/cn"

interface ActionButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "ghost"
  disabled?: boolean
  className?: string
}

export function ActionButton({
  children,
  onClick,
  variant = "primary",
  disabled,
  className,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-2 text-sm font-medium rounded-lg px-4 py-2 transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]",
        variant === "primary" &&
          "bg-admin-accent text-white hover:bg-admin-accent-hover disabled:opacity-50 disabled:cursor-not-allowed",
        variant === "secondary" &&
          "bg-admin-surface/60 text-admin-text-primary border border-admin-text-muted/50 hover:bg-admin-surface/60 hover:text-admin-text-primary disabled:opacity-50",
        variant === "ghost" &&
          "text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface/40 disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  )
}
