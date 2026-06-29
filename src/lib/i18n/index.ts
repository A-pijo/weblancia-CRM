import type { Metadata } from "next"

export type Locale = "fr" | "en" | "ar"

export const LOCALE_COOKIE = "NEXT_LOCALE"

interface Translations {
  [key: string]: string | Translations
}

const translationsCache = new Map<Locale, Translations>()

async function loadTranslations(locale: Locale): Promise<Translations> {
  if (translationsCache.has(locale)) return translationsCache.get(locale)!
  try {
    const mod = await import(`@/lib/i18n/locales/${locale}/common.json`)
    translationsCache.set(locale, mod.default as Translations)
    return mod.default as Translations
  } catch {
    const fallback = await import("@/lib/i18n/locales/fr/common.json")
    return fallback.default as Translations
  }
}

function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = (current as Translations)[key]
    } else {
      return path
    }
  }
  return typeof current === "string" ? current : path
}

export function createTranslator(locale: Locale) {
  const translations = translationsCache.get(locale) ?? {}

  return {
    t: (path: string, params?: Record<string, string>): string => {
      let text = getNestedValue(translations, path)
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          text = text.replace(`{{${key}}}`, value)
        }
      }
      return text
    },
    locale,
    isRtl: locale === "ar",
  }
}

export type Translator = ReturnType<typeof createTranslator>

export async function getTranslator(locale: Locale): Promise<Translator> {
  await loadTranslations(locale)
  return createTranslator(locale)
}

export async function loadAllTranslations(): Promise<void> {
  await Promise.all([loadTranslations("fr"), loadTranslations("en"), loadTranslations("ar")])
}

export function getLocaleFromPath(pathname: string): Locale {
  const pathLocale = pathname.split("/")[1] as Locale | undefined
  if (pathLocale && ["fr", "en", "ar"].includes(pathLocale)) return pathLocale
  return "fr"
}

export function getAlternateUrls(pathname: string, baseUrl: string): Record<string, string> {
  const pathPart = pathname.replace(/^\/(fr|en|ar)/, "")
  return {
    fr: `${baseUrl}/fr${pathPart}`,
    en: `${baseUrl}/en${pathPart}`,
    ar: `${baseUrl}/ar${pathPart}`,
  }
}

export function getRtlClass(locale: Locale): string {
  return locale === "ar" ? "rtl" : "ltr"
}

export function getMetadataForLocale(locale: Locale, pagePath: string, title: string, description: string): Metadata {
  const baseUrl = "https://app.weblancia.com"
  const pathPart = pagePath.replace(/^\//, "")
  const fullPath = locale === "fr" ? `/${pathPart}` : `/${locale}/${pathPart}`

  return {
    title,
    description,
    alternates: {
      canonical: `${baseUrl}${fullPath}`,
      languages: {
        fr: `${baseUrl}/fr/${pathPart}`,
        en: `${baseUrl}/en/${pathPart}`,
        ar: `${baseUrl}/ar/${pathPart}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${baseUrl}${fullPath}`,
      locale: locale === "fr" ? "fr_FR" : locale === "en" ? "en_US" : "ar_SA",
    },
  }
}