import { siteConfig } from "@/lib/constants/site"
import type { SiteSettings } from "@/lib/settings"

interface JsonLdSettings {
  companyName: string
  siteUrl: string
  companyDescription: string
  email: string
  phone: string
  addressCity: string
  addressCountry: string
  socialLinkedin: string
  socialXTwitter: string
  socialInstagram: string
  socialYoutube: string
}

function toSettings(s?: Partial<SiteSettings>): JsonLdSettings {
  return {
    companyName: s?.companyName ?? siteConfig.name,
    siteUrl: s?.siteUrl ?? siteConfig.url,
    companyDescription: s?.companyDescription ?? siteConfig.description,
    email: s?.email ?? siteConfig.email.hello,
    phone: s?.phone ?? siteConfig.phone,
    addressCity: s?.addressCity ?? siteConfig.address.city,
    addressCountry: s?.addressCountry ?? siteConfig.address.country,
    socialLinkedin: s?.socialLinkedin ?? siteConfig.social.linkedin,
    socialXTwitter: s?.socialXTwitter ?? siteConfig.social.twitter,
    socialInstagram: s?.socialInstagram ?? siteConfig.social.instagram,
    socialYoutube: s?.socialYoutube ?? siteConfig.social.youtube,
  }
}

export function OrganizationJsonLd({ settings }: { settings?: Partial<SiteSettings> }) {
  const s = toSettings(settings)
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: s.companyName,
    url: s.siteUrl,
    logo: `${s.siteUrl}/images/og/og-default.jpg`,
    description: s.companyDescription,
    address: {
      "@type": "PostalAddress",
      addressLocality: s.addressCity,
      addressCountry: s.addressCountry,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: s.phone,
      email: s.email,
      contactType: "customer service",
      availableLanguage: ["French", "English", "Arabic"],
    },
    sameAs: [
      s.socialLinkedin,
      s.socialXTwitter,
      s.socialInstagram,
      s.socialYoutube,
    ],
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function LocalBusinessJsonLd({ settings }: { settings?: Partial<SiteSettings> }) {
  const s = toSettings(settings)
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: s.companyName,
    image: `${s.siteUrl}/images/og/og-default.jpg`,
    url: s.siteUrl,
    telephone: s.phone,
    email: s.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: s.addressCity,
      addressCountry: s.addressCountry,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    priceRange: "€€€",
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function WebSiteJsonLd({ settings }: { settings?: Partial<SiteSettings> }) {
  const s = toSettings(settings)
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: s.companyName,
    url: s.siteUrl,
    description: s.companyDescription,
    inLanguage: ["fr", "en", "ar"],
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${s.siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ServiceJsonLd({ name, description, providerName = "Weblancia" }: { name: string; description: string; providerName?: string }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: {
      "@type": "Organization",
      name: providerName,
    },
    areaServed: {
      "@type": "Country",
      name: "MA",
    },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "MAD",
      },
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ArticleJsonLd({ title, description, url, image, datePublished, author }: {
  title: string; description: string; url: string; image?: string; datePublished: string; author: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    datePublished,
    author: { "@type": "Person", name: author },
    publisher: { "@type": "Organization", name: "Weblancia" },
  }
  if (image) schema.image = image
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function CourseJsonLd({ name, description, provider, url, image }: {
  name: string; description: string; provider: string; url: string; image?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    name,
    description,
    url,
    provider: { "@type": "Organization", name: provider },
  }
  if (image) schema.image = image
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function FaqJsonLd({ questions }: { questions: { question: string; answer: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: { "@type": "Answer", text: q.answer },
    })),
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function PersonJsonLd({ name, jobTitle, url, sameAs }: {
  name: string; jobTitle: string; url?: string; sameAs?: string[]
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    worksFor: { "@type": "Organization", name: "Weblancia" },
  }
  if (url) schema.url = url
  if (sameAs && sameAs.length > 0) schema.sameAs = sameAs
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ReviewJsonLd({ itemName, reviewBody, authorName, ratingValue }: {
  itemName: string; reviewBody: string; authorName: string; ratingValue: number
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Organization", name: itemName },
    reviewBody,
    author: { "@type": "Person", name: authorName },
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: 5,
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function AggregateRatingJsonLd({ itemName, ratingValue, ratingCount, bestRating = 5 }: {
  itemName: string; ratingValue: number; ratingCount: number; bestRating?: number
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: { "@type": "Organization", name: itemName },
    ratingValue,
    ratingCount,
    bestRating,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ProjectJsonLd({ name, description, url, image }: {
  name: string; description: string; url: string; image?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    creator: { "@type": "Organization", name: "Weblancia" },
  }
  if (image) schema.image = image
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
