import type { Metadata } from "next"

const baseUrl = "https://app.weblancia.com"

interface SeoProps {
  title: string
  description: string
  path: string
  ogImage?: string
}

export function generateMetadata({ title, description, path, ogImage }: SeoProps): Metadata {
  const url = `${baseUrl}${path}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Weblancia",
      locale: "fr_FR",
      type: "website",
      ...(ogImage && { images: [{ url: ogImage }] }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}
