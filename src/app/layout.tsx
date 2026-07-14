import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { LocaleProvider } from "@/lib/i18n/provider"
import { siteConfig } from "@/lib/constants/site"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["400", "600", "700"],
  fallback: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  weight: ["600", "700"],
  fallback: ["Georgia", "serif"],
})

export const metadata: Metadata = {
  title: {
    default: "Weblancia — Agence Digitale Premium Fès",
    template: "%s | Weblancia",
  },
  description:
    "Agence digitale premium à Fès : développement web, marketing digital, design UI/UX, consulting et branding au Maroc.",
  keywords: [
    "Weblancia",
    "agence digitale",
    "Fès",
    "Casablanca",
    "développement web",
    "marketing digital",
    "SEO",
    "branding",
    "Maroc",
    "agence web Maroc",
  ],
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
    languages: {
      fr: "/",
    },
  },
  openGraph: {
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    type: "website",
    title: "Weblancia — Agence Digitale Premium Fès",
    description:
      "Agence digitale premium à Fès : développement web, marketing digital, design UI/UX, consulting et branding au Maroc.",
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@weblancia",
    creator: "@weblancia",
    title: "Weblancia — Agence Digitale Premium Fès",
    description:
      "Agence digitale premium à Fès : développement web, marketing digital, design UI/UX, consulting et branding au Maroc.",
    images: ["/images/og/og.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "lLfesMOocbqn6S7bB0EPwBHAfwVc0YlMjmBXPdGSDfY",
  },
  appleWebApp: {
    capable: true,
    title: "Weblancia",
    statusBarStyle: "black-translucent",
  },
  applicationName: "Weblancia",
  referrer: "origin-when-cross-origin",
  creator: "Weblancia",
  publisher: "Weblancia",
  authors: [{ name: "Weblancia", url: siteConfig.url }],
  classification: "Digital Agency",
  category: "digital agency",
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
    apple: [{ url: "/favicon.ico", sizes: "180x180" }],
  },
  manifest: "/manifest.json",
  other: {
    "google-site-verification": "lLfesMOocbqn6S7bB0EPwBHAfwVc0YlMjmBXPdGSDfY",
    "theme-color": "#0a0a0a",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable} overflow-x-hidden`}>
      <head>
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://*.clarity.ms" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  )
}
