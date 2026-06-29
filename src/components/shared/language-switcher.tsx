"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CaretDown } from "@/components/icons"
import { cn } from "@/lib/utils/cn"
import { siteConfig } from "@/lib/constants/site"

interface LanguageSwitcherProps {
  className?: string
}

const locales: Record<string, string> = {
  fr: "FR",
  en: "EN",
  ar: "العربية",
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [current, setCurrent] = useState(siteConfig.defaultLocale)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-caption text-text-secondary hover:text-text-primary transition-colors duration-200"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        {locales[current]}
        <CaretDown
          size={12}
          className={cn("transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-surface border border-border rounded-radius-md shadow-lg py-1 min-w-[120px] z-50">
          {Object.entries(locales).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setCurrent(key)
                setIsOpen(false)
                document.cookie = `NEXT_LOCALE=${key};path=/;max-age=31536000`
                router.refresh()
              }}
              className={cn(
                "w-full text-left px-3 py-1.5 text-caption transition-colors duration-150",
                key === current
                  ? "text-text-primary font-medium"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-secondary",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
