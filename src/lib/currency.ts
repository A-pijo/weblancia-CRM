const CURRENCY_KEY = "weblancia_currency"

const CURRENCY_MAP = {
  MAD: { locale: "fr-MA", symbol: "MAD", code: "MAD" },
  EUR: { locale: "fr-EU", symbol: "€", code: "EUR" },
  USD: { locale: "en-US", symbol: "$", code: "USD" },
} as const

type CurrencyCode = keyof typeof CURRENCY_MAP

function detectLocaleCurrency(): CurrencyCode {
  if (typeof navigator === "undefined") return "MAD"
  const lang = navigator.language
  if (lang.startsWith("fr")) return "MAD"
  if (lang.startsWith("en")) return "USD"
  if (lang.startsWith("ar")) return "MAD"
  return "MAD"
}

export function getCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "MAD"
  const stored = localStorage.getItem(CURRENCY_KEY) as CurrencyCode | null
  if (stored && stored in CURRENCY_MAP) return stored
  return detectLocaleCurrency()
}

export function setCurrency(code: string) {
  if (typeof window !== "undefined" && code in CURRENCY_MAP) {
    localStorage.setItem(CURRENCY_KEY, code)
  }
}

export function formatPrice(amount: number, currency?: string): string {
  const code = (currency as CurrencyCode) ?? getCurrency()
  const config = CURRENCY_MAP[code] ?? CURRENCY_MAP.MAD
  try {
    return new Intl.NumberFormat(config.locale, { style: "currency", currency: config.code }).format(amount)
  } catch {
    return `${amount.toFixed(2)} ${config.symbol}`
  }
}

export const CURRENCIES = Object.keys(CURRENCY_MAP)
