"use client"

import dynamic from "next/dynamic"

const CookieConsentProvider = dynamic(
  () => import("@/components/layout/cookie-consent").then((m) => m.CookieConsentProvider),
  { ssr: false },
)

export function CookieConsentWrapper({ children }: { children: React.ReactNode }) {
  return <CookieConsentProvider>{children}</CookieConsentProvider>
}
