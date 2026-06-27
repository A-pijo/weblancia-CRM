import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Weblancia — Agence Digitale Premium Casablanca",
    template: "%s | Weblancia",
  },
  description:
    "Agence digitale premium à Casablanca : développement web, marketing digital, design UI/UX, consulting et branding.",
  metadataBase: new URL("https://weblancia.ma"),
  alternates: {
    canonical: "/",
    languages: {
      fr: "/fr",
      en: "/en",
      ar: "/ar",
    },
  },
  openGraph: {
    siteName: "Weblancia",
    locale: "fr_FR",
    type: "website",
    title: "Weblancia — Agence Digitale Premium Casablanca",
    description:
      "Agence digitale premium à Casablanca : développement web, marketing digital, design UI/UX, consulting et branding.",
    images: [{ url: "/images/og/default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Weblancia — Agence Digitale Premium Casablanca",
    description:
      "Agence digitale premium à Casablanca : développement web, marketing digital, design UI/UX, consulting et branding.",
    images: ["/images/og/default.jpg"],
  },
  other: {
    "google-site-verification": "lLfesMOocbqn6S7bB0EPwBHAfwVc0YlMjmBXPdGSDfY",
  },
  icons: {
    icon: [{ url: "/favicon.ico", sizes: "any" }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html
        lang="fr"
        className={`${inter.variable} ${playfair.variable} overflow-x-hidden`}
      >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://*.clarity.ms" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  )
}
