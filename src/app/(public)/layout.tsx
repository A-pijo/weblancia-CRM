import { headers } from "next/headers"
import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { SkipLink } from "@/components/layout/skip-link"
import { CookieConsentWrapper } from "@/components/layout/cookie-consent-wrapper"
import { StickyCTA } from "@/components/layout/sticky-cta"
import {
  OrganizationJsonLd,
  LocalBusinessJsonLd,
  WebSiteJsonLd,
} from "@/components/shared/json-ld"
import { WhatsAppFloat } from "@/components/shared/whatsapp-float"
import {
  GoogleAnalytics,
  MicrosoftClarity,
} from "@/components/shared/analytics"

export const dynamic = "force-dynamic"

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const nonce = (await headers()).get("x-nonce") ?? undefined
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <OrganizationJsonLd />
      <LocalBusinessJsonLd />
      <WebSiteJsonLd />
      <SkipLink />
      <CookieConsentWrapper>
        <Navigation />
        <main id="main-content" className="flex-1 pb-16 lg:pb-0">{children}</main>
        <Footer />
        <StickyCTA />
        <WhatsAppFloat />
        <GoogleAnalytics nonce={nonce} />
        <MicrosoftClarity nonce={nonce} />
      </CookieConsentWrapper>
    </div>
  )
}
