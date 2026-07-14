import type { Metadata } from "next"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Créer un compte | Weblancia",
  description: "Créez votre compte Weblancia pour accéder à nos services, formations et ressources exclusives.",
  keywords: ["Weblancia", "inscription", "compte", "créer compte", "enregistrement"],
  robots: { index: false, follow: false },
  openGraph: {
    title: "Créer un compte | Weblancia",
    description: "Créez votre compte Weblancia pour accéder à nos services, formations et ressources exclusives.",
    url: `${siteConfig.url}/register`,
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    type: "website",
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@weblancia",
    creator: "@weblancia",
    title: "Créer un compte | Weblancia",
    description: "Créez votre compte Weblancia pour accéder à nos services, formations et ressources exclusives.",
    images: ["/images/og/og.svg"],
  },
  alternates: { canonical: `${siteConfig.url}/register` },
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <WebPageJsonLd name="Créer un compte | Weblancia" description="Créez votre compte Weblancia pour accéder à nos services, formations et ressources exclusives." url={`${siteConfig.url}/register`} />
      {children}
    </>
  )
}
