import { Metadata } from "next"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { CTABanner } from "@/components/sections/cta-banner"
import { WorkFilterGrid } from "./work-filter-grid"
import { siteConfig } from "@/lib/constants/site"
import { getProjects, getProjectIndustries } from "@/lib/projects/queries"
import type { WorkItem } from "@/types/work"

export const metadata: Metadata = {
  title: "Nos Réalisations | Weblancia",
  description:
    "Découvrez nos projets web, e-commerce et applications qui ont transformé la vision de nos clients en solutions digitales performantes.",
  alternates: { canonical: `${siteConfig.url}/work` },
  openGraph: {
    title: "Nos Réalisations | Weblancia",
    description: "Découvrez nos projets web, e-commerce et applications qui ont transformé la vision de nos clients en solutions digitales performantes.",
    url: `${siteConfig.url}/work`,
  },
  twitter: { card: "summary_large_image", title: "Nos Réalisations | Weblancia", description: "Découvrez nos projets web, e-commerce et applications qui ont transformé la vision de nos clients en solutions digitales performantes." },
}

export default async function WorkPage() {
  const { items: dbProjects } = await getProjects({ isActive: true, limit: 50 })
  const industries = await getProjectIndustries()

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
