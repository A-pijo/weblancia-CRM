import { Metadata } from "next"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { CTABanner } from "@/components/sections/cta-banner"
import { WorkFilterGrid } from "./work-filter-grid"
import { siteConfig } from "@/lib/constants/site"
import { prisma } from "@/lib/database/prisma"
import type { WorkItem } from "@/types/work"
import { CollectionPageJsonLd } from "@/components/shared/json-ld"

export const metadata: Metadata = {
  title: "Nos Réalisations | Weblancia",
  description:
    "Découvrez nos projets web, e-commerce et applications qui ont transformé la vision de nos clients en solutions digitales performantes.",
  keywords: ["Weblancia", "réalisations", "portfolio", "projets web", "Casablanca", "développement", "applications"],
  alternates: { canonical: `${siteConfig.url}/work` },
  openGraph: {
    title: "Nos Réalisations | Weblancia",
    description: "Découvrez nos projets web, e-commerce et applications qui ont transformé la vision de nos clients en solutions digitales performantes.",
    url: `${siteConfig.url}/work`,
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    type: "website",
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Nos Réalisations | Weblancia", description: "Découvrez nos projets web, e-commerce et applications qui ont transformé la vision de nos clients en solutions digitales performantes.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

export const revalidate = 3600

export default async function WorkPage() {
  const dbProjects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    take: 50,
    include: { images: { orderBy: { displayOrder: "asc" } } },
  })
  const industries = await prisma.project.findMany({
    where: { isActive: true, industry: { not: null } },
    select: { industry: true },
    distinct: ["industry"],
    orderBy: { industry: "asc" },
  }).then((r) => r.map((i) => i.industry).filter(Boolean) as string[])

  const workItems: WorkItem[] = dbProjects.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    client: p.client,
    industry: p.industry,
    description: p.description,
    featuredImage: p.featuredImage,
    technologies: p.technologies as string[] | null,
    clientTestimonial: p.clientTestimonial as { quote: string; author: string; role: string } | null,
    results: p.results as { label: string; value: string }[] | null,
    date: p.date?.toISOString() ?? null,
    isFeatured: p.isFeatured,
    images: p.images.map((img) => ({ url: img.url, alt: img.alt })),
  }))

  const displayItems = workItems.length > 0 ? workItems : []

  return (
    <>
      <CollectionPageJsonLd name="Nos Réalisations | Weblancia" description="Découvrez nos projets web, e-commerce et applications" url={`${siteConfig.url}/work`} numberOfItems={displayItems.length} />
      <HeroDefault
        headline="Nos Réalisations"
        subheadline="Découvrez comment nous avons transformé la vision de nos clients en solutions digitales performantes. Chaque projet raconte une histoire de collaboration et d'innovation."
        primaryCta={{ label: "Discutons de votre projet", href: "/start-project" }}
        align="left"
      />
      <WorkFilterGrid items={displayItems} industries={industries} />
      <CTABanner
        headline="Vous avez un projet en tête ?"
        subheadline="Racontons-le ensemble."
        cta={{ label: "Démarrer votre projet", href: "/start-project" }}
        variant="subtle"
      />
    </>
  )
}
