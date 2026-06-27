"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "@/components/icons"
import { cn } from "@/lib/utils/cn"

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme")
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      return stored === "dark" || (!stored && prefersDark)
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  return (
    <button
      type="button"
      onClick={() => setDark(!dark)}
      className={cn(
        "text-text-secondary hover:text-text-primary transition-colors duration-200",
        className,
      )}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
