import type { Metadata } from "next"
import Link from "next/link"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Page non trouvée | Weblancia",
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "Page non trouvée | Weblancia",
    description: "La page que vous cherchez n'existe pas ou a été déplacée.",
    url: `${siteConfig.url}/404`,
    siteName: "Weblancia",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@weblancia",
    title: "Page non trouvée | Weblancia",
    description: "La page que vous cherchez n'existe pas ou a été déplacée.",
    images: ["/images/og/og.svg"],
  },
}

export default function RootNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-5 text-center bg-bg">
      <h1 className="text-display font-serif font-bold text-text-primary mb-4">
        Page non trouvée
      </h1>
      <p className="text-body-lg text-text-secondary max-w-md mb-10">
        Il semble que cette page n&rsquo;existe pas ou a été déplacée.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-6 rounded-radius-md bg-accent text-white hover:bg-accent-hover text-button font-medium transition-all duration-200"
        >
          Retour à l&rsquo;accueil
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-12 px-6 rounded-radius-md border border-border bg-transparent text-text-primary hover:border-accent hover:text-accent text-button font-medium transition-all duration-200"
        >
          Contactez-nous
        </Link>
      </div>
    </div>
  )
}
