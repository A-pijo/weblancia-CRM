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
import { loadSiteSettings } from "@/lib/settings"

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await loadSiteSettings()

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <OrganizationJsonLd settings={settings} />
      <LocalBusinessJsonLd settings={settings} />
      <WebSiteJsonLd settings={settings} />
      <SkipLink />
      <CookieConsentWrapper>
        <Navigation />
        <main id="main-content" className="flex-1">{children}</main>
        <Footer settings={settings} />
        <GoogleAnalytics />
        <MicrosoftClarity />
      </CookieConsentWrapper>
    </div>
  )
}
