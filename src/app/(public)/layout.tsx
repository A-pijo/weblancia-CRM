import { Navigation } from "@/components/layout/navigation"
import { Footer } from "@/components/layout/footer"
import { SkipLink } from "@/components/layout/skip-link"
import { CookieConsentWrapper } from "@/components/layout/cookie-consent-wrapper"
import {
  OrganizationJsonLd,
  LocalBusinessJsonLd,
  WebSiteJsonLd,
} from "@/components/shared/json-ld"
import {
  GoogleAnalytics,
  MicrosoftClarity,
} from "@/components/shared/analytics"

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <OrganizationJsonLd />
      <LocalBusinessJsonLd />
      <WebSiteJsonLd />
      <SkipLink />
      <CookieConsentWrapper>
        <Navigation />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer />
        <GoogleAnalytics />
        <MicrosoftClarity />
      </CookieConsentWrapper>
    </div>
  )
}
