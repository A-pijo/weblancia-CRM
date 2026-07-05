import { siteConfig } from "@/lib/constants/site"
import { cities } from "@/lib/data/cities"

const baseUrl = siteConfig.url
const defaultLocales = ["fr", "en", "ar"]
const sameAs = [
  siteConfig.social.linkedin,
  siteConfig.social.twitter,
  siteConfig.social.instagram,
  siteConfig.social.youtube,
]

const websiteId = `${baseUrl}#website`
const localbusinessId = `${baseUrl}#localbusiness`
const brandId = `${baseUrl}#brand`
const logoId = `${baseUrl}#logo`

const orgRef = { "@type": "Organization" as const, "@id": baseUrl, name: "Weblancia" }

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": baseUrl,
    name: siteConfig.name,
    alternateName: "Weblancia Agency",
    url: baseUrl,
    logo: { "@type": "ImageObject", "@id": logoId, url: `${baseUrl}/images/og/og.svg` },
    description: siteConfig.description,
    foundingDate: "2018",
    foundingLocation: "Fès, Morocco",
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.country,
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        email: siteConfig.email.hello,
        contactType: "customer service",
        description: "Customer support",
        availableLanguage: ["French", "English", "Arabic"],
      },
      {
        "@type": "ContactPoint",
        telephone: siteConfig.phone,
        email: siteConfig.email.academy,
        contactType: "academy",
        description: "Academy inquiries",
        availableLanguage: ["French", "English", "Arabic"],
      },
    ],
    sameAs,
    knowsAbout: [
      "Web Development",
      "Digital Marketing",
      "UI/UX Design",
      "SEO",
      "Branding",
      "E-commerce",
    ],
    award: "Premium Digital Agency Morocco",
    brand: { "@type": "Brand", "@id": brandId, name: "Weblancia" },
    founder: { "@type": "Person", "@id": `${baseUrl}/author/yassine`, name: "Yassine" },
    inLanguage: defaultLocales,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function LocalBusinessJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": localbusinessId,
    name: siteConfig.name,
    image: `${baseUrl}/images/og/og.svg`,
    url: baseUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email.hello,
    priceRange: "€€€",
    branchOf: orgRef,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.address.city,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 34.020882,
      longitude: -5.018105,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      ...cities.map((c) => ({ "@type": "City", name: c.name })),
      { "@type": "Country", name: "Morocco" },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Digital Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Web Development" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Digital Marketing" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "UI/UX Design" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "SEO" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Branding" } },
      ],
    },
    sameAs,
    inLanguage: defaultLocales,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: baseUrl,
    description: siteConfig.description,
    inLanguage: defaultLocales,
    publisher: orgRef,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function WebPageJsonLd({ name, description, url, breadcrumbs, lang = "fr" }: {
  name: string; description: string; url: string; breadcrumbs?: { name: string; url: string }[]; lang?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": url,
    name,
    description,
    url,
    inLanguage: lang,
    isPartOf: { "@type": "WebSite", "@id": websiteId },
    publisher: orgRef,
  }
  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: breadcrumbs.map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function CollectionPageJsonLd({ name, description, url, numberOfItems, lang = "fr" }: {
  name: string; description: string; url: string; numberOfItems?: number; lang?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url,
    name,
    description,
    url,
    inLanguage: lang,
    isPartOf: { "@type": "WebSite", "@id": websiteId },
    publisher: orgRef,
  }
  if (numberOfItems !== undefined) schema.numberOfItems = numberOfItems
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function AboutPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${baseUrl}/about`,
    name: "À Propos | Weblancia",
    description: "Découvrez Weblancia, une agence digitale premium spécialisée en développement web, marketing digital et design à Fès.",
    url: `${baseUrl}/about`,
    inLanguage: "fr",
    isPartOf: { "@type": "WebSite", "@id": websiteId },
    publisher: orgRef,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ContactPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${baseUrl}/contact`,
    name: "Contact | Weblancia",
    description: "Contactez Weblancia pour vos projets digitaux. Notre équipe est là pour vous accompagner.",
    url: `${baseUrl}/contact`,
    inLanguage: "fr",
    isPartOf: { "@type": "WebSite", "@id": websiteId },
    publisher: orgRef,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function SearchResultsPageJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    "@id": `${baseUrl}/search`,
    name: "Recherche | Weblancia",
    url: `${baseUrl}/search`,
    inLanguage: "fr",
    isPartOf: { "@type": "WebSite", "@id": websiteId },
    publisher: orgRef,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BreadcrumbJsonLd({ items, pageUrl }: { items: { name: string; url: string }[]; pageUrl?: string }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${pageUrl ?? items[items.length - 1]?.url ?? baseUrl}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
  if (pageUrl) {
    schema.isPartOf = { "@type": "WebPage", "@id": pageUrl }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ServiceJsonLd({ name, description, providerName = "Weblancia", category, lang = "fr", pageUrl }: {
  name: string; description: string; providerName?: string; category?: string; lang?: string; pageUrl?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${baseUrl}/services/${name.toLowerCase().replace(/\s+/g, "-")}`,
    name,
    description,
    inLanguage: lang,
    provider: orgRef,
    areaServed: { "@type": "Country", name: "MA" },
    offers: {
      "@type": "Offer",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "MAD",
      },
    },
  }
  if (category) schema.serviceType = category
  if (pageUrl) {
    schema.isPartOf = { "@type": "WebPage", "@id": pageUrl }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ProfessionalServiceJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}#professionalservice`,
    name: "Weblancia",
    description: "Agence digitale premium offrant des services de développement web, marketing digital, design UI/UX et conseil.",
    url: baseUrl,
    telephone: siteConfig.phone,
    email: siteConfig.email.hello,
    areaServed: "Morocco",
    inLanguage: defaultLocales,
    branchOf: orgRef,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BlogPostingJsonLd({ title, description, url, image, datePublished, dateModified, author, authorUrl, authorImage, authorSameAs, wordCount, lang = "fr" }: {
  title: string; description: string; url: string; image?: string; datePublished: string; dateModified?: string; author: string; authorUrl?: string; authorImage?: string; authorSameAs?: string[]; wordCount?: number; lang?: string
}) {
  const authorSchema: Record<string, unknown> = { "@type": "Person", name: author }
  if (authorUrl) { authorSchema.url = authorUrl; authorSchema["@id"] = authorUrl }
  if (authorImage) authorSchema.image = authorImage
  if (authorSameAs && authorSameAs.length > 0) authorSchema.sameAs = authorSameAs
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    headline: title,
    description,
    url,
    datePublished,
    inLanguage: lang,
    author: authorSchema,
    publisher: orgRef,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }
  if (wordCount !== undefined) schema.wordCount = wordCount
  if (dateModified) schema.dateModified = dateModified
  if (image) schema.image = image
  if (image) schema.thumbnailUrl = image
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ArticleJsonLd({ title, description, url, image, datePublished, author, authorUrl, authorImage, authorSameAs }: {
  title: string; description: string; url: string; image?: string; datePublished: string; author: string; authorUrl?: string; authorImage?: string; authorSameAs?: string[]
}) {
  const authorSchema: Record<string, unknown> = { "@type": "Person", name: author }
  if (authorUrl) { authorSchema.url = authorUrl; authorSchema["@id"] = authorUrl }
  if (authorImage) authorSchema.image = authorImage
  if (authorSameAs && authorSameAs.length > 0) authorSchema.sameAs = authorSameAs
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url,
    headline: title,
    description,
    url,
    datePublished,
    inLanguage: "fr",
    author: authorSchema,
    publisher: orgRef,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  }
  if (image) schema.image = image
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function CourseJsonLd({ name, description, provider, url, image, duration, price, currency = "EUR", lang = "fr" }: {
  name: string; description: string; provider: string; url: string; image?: string; duration?: string; price?: number; currency?: string; lang?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": url,
    name,
    description,
    url,
    inLanguage: lang,
    provider: orgRef,
    isPartOf: { "@type": "WebPage", "@id": url },
  }
  if (image) schema.image = image
  if (duration) schema.timeRequired = duration
  if (price !== undefined) {
    schema.offers = {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: "https://schema.org/InStock",
    }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function FaqJsonLd({ questions, pageUrl }: { questions: { question: string; answer: string }[]; pageUrl?: string }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
  }
  if (pageUrl) {
    schema["@id"] = `${pageUrl}#faq`
    schema.isPartOf = { "@type": "WebPage", "@id": pageUrl }
  }
  schema.mainEntity = questions.map((q) => ({
    "@type": "Question",
    name: q.question,
    acceptedAnswer: { "@type": "Answer", text: q.answer },
  }))
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function HowToJsonLd({ name, description, steps, pageUrl, lang = "fr" }: {
  name: string; description: string; steps: { name: string; text: string; url?: string }[]; pageUrl?: string; lang?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    inLanguage: lang,
  }
  if (pageUrl) {
    schema["@id"] = `${pageUrl}#howto`
    schema.isPartOf = { "@type": "WebPage", "@id": pageUrl }
  }
  schema.step = steps.map((step, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: step.name,
    text: step.text,
    ...(step.url ? { url: step.url } : {}),
  }))
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function PersonJsonLd({ name, jobTitle, url, sameAs, image }: {
  name: string; jobTitle: string; url?: string; sameAs?: string[]; image?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name,
    jobTitle,
    worksFor: orgRef,
  }
  if (url) { schema["@id"] = url; schema.url = url }
  if (image) schema.image = image
  if (sameAs && sameAs.length > 0) schema.sameAs = sameAs
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ReviewJsonLd({ itemName, reviewBody, authorName, ratingValue, url }: {
  itemName: string; reviewBody: string; authorName: string; ratingValue: number; url?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Organization", "@id": baseUrl, name: itemName },
    reviewBody,
    author: { "@type": "Person", name: authorName },
    reviewRating: {
      "@type": "Rating",
      ratingValue,
      bestRating: 5,
    },
  }
  if (url) schema["@id"] = url
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function AggregateRatingJsonLd({ itemName, ratingValue, ratingCount, bestRating = 5, url }: {
  itemName: string; ratingValue: number; ratingCount: number; bestRating?: number; url?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "AggregateRating",
    itemReviewed: { "@type": "Organization", "@id": baseUrl, name: itemName },
    ratingValue,
    ratingCount,
    bestRating,
  }
  if (url) schema["@id"] = url
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ProjectJsonLd({ name, description, url, image, datePublished, dateModified }: {
  name: string; description: string; url: string; image?: string; datePublished?: string; dateModified?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": url,
    name,
    description,
    url,
    creator: orgRef,
  }
  if (image) schema.image = image
  if (datePublished) schema.datePublished = datePublished
  if (dateModified) schema.dateModified = dateModified
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function SoftwareApplicationJsonLd({ name, description, url, operatingSystem, applicationCategory }: {
  name: string; description: string; url: string; operatingSystem?: string; applicationCategory?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": url,
    name,
    description,
    url,
    author: orgRef,
    applicationCategory: applicationCategory ?? "WebApplication",
    operatingSystem: operatingSystem ?? "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "MAD",
    },
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function VideoObjectJsonLd({ name, description, thumbnailUrl, contentUrl, uploadDate, duration, url }: {
  name: string; description: string; thumbnailUrl: string; contentUrl: string; uploadDate: string; duration?: string; url?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl,
    contentUrl,
    uploadDate,
    publisher: orgRef,
  }
  if (url) schema["@id"] = url
  if (duration) schema.duration = duration
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ImageObjectJsonLd({ contentUrl, caption, description, author = "Weblancia", url }: {
  contentUrl: string; caption?: string; description?: string; author?: string; url?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": url ?? contentUrl,
    contentUrl,
    author: orgRef,
  }
  if (caption) schema.caption = caption
  if (description) schema.description = description
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function ItemListJsonLd({ itemListElement, itemType, pageUrl }: {
  itemListElement: { name: string; url: string; description?: string }[]
  itemType?: string; pageUrl?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
  }
  if (pageUrl) {
    schema["@id"] = `${pageUrl}#itemlist`
    schema.isPartOf = { "@type": "WebPage", "@id": pageUrl }
  }
  schema.itemListElement = itemListElement.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": itemType ?? "Thing",
      name: item.name,
      url: item.url,
      ...(item.description ? { description: item.description } : {}),
    },
  }))
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function JobPostingJsonLd({ title, description, datePosted, validThrough, employmentType, location, url }: {
  title: string; description: string; datePosted: string; validThrough?: string; employmentType?: string; location?: string; url?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    datePosted,
    hiringOrganization: orgRef,
    employmentType: employmentType ?? "FULL_TIME",
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: location ?? "Fès", addressCountry: "MA" },
    },
  }
  if (url) schema["@id"] = url
  if (validThrough) schema.validThrough = validThrough
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function SpeakableJsonLd({ cssSelector, xpath, url, lang = "fr" }: {
  cssSelector?: string[]; xpath?: string[]; url?: string; lang?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    inLanguage: lang,
    isPartOf: { "@type": "WebSite", "@id": websiteId },
    speakable: {
      "@type": "SpeakableSpecification",
    },
  }
  if (url) schema["@id"] = url
  if (cssSelector) (schema.speakable as Record<string, unknown>).cssSelector = cssSelector
  if (xpath) (schema.speakable as Record<string, unknown>).xpath = xpath
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function SiteNavigationElementJsonLd({ items, url }: {
  items: { name: string; url: string }[]; url?: string
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    description: "Main site navigation for Weblancia",
    inLanguage: "fr",
    isPartOf: { "@type": "WebSite", "@id": websiteId },
  }
  if (url) schema["@id"] = url
  schema.hasPart = items.map((item, i) => ({
    "@type": "SiteNavigationElement",
    position: i + 1,
    name: item.name,
    url: item.url,
  }))
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function BrandJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Brand",
    "@id": brandId,
    name: "Weblancia",
    description: "Premium Digital Agency based in Fès, Morocco",
    url: baseUrl,
    logo: `${baseUrl}/images/og/og.svg`,
    slogan: "Votre Agence de Services Numeriques",
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}

export function LogoJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "@id": logoId,
    url: `${baseUrl}/images/og/og.svg`,
    contentUrl: `${baseUrl}/images/og/og.svg`,
    description: "Weblancia logo",
    author: orgRef,
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
