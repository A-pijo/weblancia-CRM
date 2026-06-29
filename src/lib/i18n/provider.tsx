"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Locale } from "./index"
import frCommon from "@/lib/i18n/locales/fr/common.json"
import enCommon from "@/lib/i18n/locales/en/common.json"
import arCommon from "@/lib/i18n/locales/ar/common.json"

const allTranslations: Record<Locale, Record<string, unknown>> = {
  fr: frCommon as Record<string, unknown>,
  en: enCommon as Record<string, unknown>,
  ar: arCommon as Record<string, unknown>,
}

const VALID_LOCALES = ["fr", "en", "ar"]

function cookieLocale(): Locale | null {
  if (typeof document === "undefined") return null
  const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/)
  const val = match?.[1]
  if (val && VALID_LOCALES.includes(val)) return val as Locale
  return null
}

function resolvePath(obj: Record<string, unknown>, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Record<string, unknown>)[key]
    } else {
      return path
    }
  }
  return typeof current === "string" ? current : path
}

export function createT(locale: Locale) {
  const translations = allTranslations[locale]
  return (path: string, params?: Record<string, string>): string => {
    let text = resolvePath(translations, path)
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        text = text.replace(`{{${key}}}`, value)
      }
    }
    return text
  }
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: ReturnType<typeof createT>
  dir: "ltr" | "rtl"
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "fr",
  setLocale: () => {},
  t: (path: string) => path,
  dir: "ltr",
})

export function useLocale() {
  return useContext(LocaleContext)
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr")

  useEffect(() => {
    const saved = cookieLocale()
    if (saved) {
      setLocaleState(saved)
      document.documentElement.lang = saved
      document.documentElement.dir = saved === "ar" ? "rtl" : "ltr"
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr"
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000`
    document.documentElement.lang = next
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr"
  }, [])

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: createT(locale),
    dir: locale === "ar" ? "rtl" : "ltr",
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}
