import { db } from "@/lib/db"

export interface SiteSettings {
  companyName: string
  companyTagline: string
  companyDescription: string
  siteUrl: string
  logoUrl: string
  email: string
  emailAcademy: string
  emailCareers: string
  phone: string
  addressCity: string
  addressCountry: string
  businessHours: string
  socialFacebook: string
  socialInstagram: string
  socialLinkedin: string
  socialXTwitter: string
  socialYoutube: string
  socialTiktok: string
  whatsappNumber: string
  googleMapsUrl: string
  defaultSeoTitle: string
  defaultSeoDescription: string
}

export const defaultSettings: SiteSettings = {
  companyName: "Weblancia",
  companyTagline: "Premium Digital Agency",
  companyDescription:
    "Web design, development, SEO & branding agency based in Casablanca. We craft digital experiences that drive results.",
  siteUrl: "https://app.weblancia.com",
  logoUrl: "",
  email: "hello@weblancia.ma",
  emailAcademy: "academy@weblancia.ma",
  emailCareers: "careers@weblancia.ma",
  phone: "+212 XXX-XXXXXX",
  addressCity: "Casablanca",
  addressCountry: "Morocco",
  businessHours: "Lundi - Vendredi, 9h00 - 18h00",
  socialFacebook: "",
  socialInstagram: "https://instagram.com/weblancia",
  socialLinkedin: "https://linkedin.com/company/weblancia",
  socialXTwitter: "https://twitter.com/weblancia",
  socialYoutube: "https://youtube.com/@weblancia",
  socialTiktok: "",
  whatsappNumber: "+212XXXXXXXXX",
  googleMapsUrl: "",
  defaultSeoTitle: "Weblancia | Premium Digital Agency",
  defaultSeoDescription:
    "Web design, development, SEO & branding agency based in Casablanca. We craft digital experiences that drive results.",
}

const SETTING_KEYS = Object.keys(defaultSettings) as (keyof SiteSettings)[]

function settingsToRecord(rows: { key: string; value: string }[]): Record<string, string> {
  const map: Record<string, string> = {}
  for (const row of rows) {
    map[row.key] = row.value
  }
  return map
}

export async function loadSiteSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.setting.findMany({
      where: { group: "site" },
      select: { key: true, value: true },
    })

    if (!rows || rows.length === 0) {
      return { ...defaultSettings }
    }

    const map = settingsToRecord(rows)
    const result = { ...defaultSettings }

    for (const key of SETTING_KEYS) {
      if (map[key] !== undefined) {
        (result as Record<string, string>)[key] = map[key]
      }
    }

    return result
  } catch {
    return { ...defaultSettings }
  }
}

export async function getAllSettings(): Promise<SiteSettings> {
  return loadSiteSettings()
}

export async function getSetting(key: keyof SiteSettings): Promise<string | undefined> {
  try {
    const row = await db.setting.findUnique({
      where: { key },
      select: { value: true },
    })
    return row?.value ?? undefined
  } catch {
    return undefined
  }
}

export async function upsertSettings(data: Partial<SiteSettings>): Promise<SiteSettings> {
  const keys = Object.keys(data) as (keyof SiteSettings)[]

  for (const key of keys) {
    const value = data[key]
    if (value === undefined || value === null) continue

    await db.setting.upsert({
      where: { key },
      create: { key, value: String(value), group: "site" },
      update: { value: String(value) },
    })
  }

  return loadSiteSettings()
}
