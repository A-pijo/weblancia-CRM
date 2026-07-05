import type { Metadata } from "next"
import Link from "next/link"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { WebPageJsonLd, ItemListJsonLd } from "@/components/shared/json-ld"
import { TrustBar } from "@/components/sections/trust-bar"
import { FeaturedWork } from "@/components/sections/featured-work"
import { ServicesGrid } from "@/components/sections/services-grid"
import { StatsCounter } from "@/components/sections/stats-counter"
import { ProcessTimeline } from "@/components/sections/process-timeline"
import { TestimonialCarousel } from "@/components/sections/testimonial-carousel"
import { CTABanner } from "@/components/sections/cta-banner"
import { prisma } from "@/lib/database/prisma"
import { siteConfig } from "@/lib/constants/site"
import type { WorkItem } from "@/types/work"
import type { Service } from "@/types/service"
import type { Stat, ProcessStep, Testimonial } from "@/types/common"

const siteUrl = siteConfig.url

export const metadata: Metadata = {
  title: "Weblancia | Agence Digitale Premium à Fès",
  description: "Agence digitale premium à Fès, spécialisée en création de sites web, développement sur-mesure, SEO et branding pour entreprises ambitieuses au Maroc.",
  keywords: ["Weblancia", "agence digitale", "Fès", "création site web", "développement web", "SEO", "branding", "Maroc"],
  alternates: { canonical: siteUrl },
  openGraph: {
    title: "Weblancia | Agence Digitale Premium à Fès",
    description: "Agence digitale premium à Fès, spécialisée en création de sites web, développement sur-mesure, SEO et branding.",
    url: siteUrl,
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    type: "website",
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Weblancia | Agence Digitale Premium à Fès", description: "Agence digitale premium à Fès, spécialisée en création de sites web, développement sur-mesure, SEO et branding.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  applicationName: "Weblancia",
  authors: [{ name: "Weblancia", url: siteUrl }],
  creator: "Weblancia",
  publisher: "Weblancia",
  category: "digital agency",
}

export const revalidate = 3600

async function getStats(): Promise<Stat[]> {
  const [projectCount, categoryCount, clientCount, yearSetting] = await Promise.all([
    prisma.project.count({ where: { isActive: true } }).catch(() => 0),
    prisma.serviceCategory.count().catch(() => 0),
    prisma.project.count({ where: { isActive: true, client: { not: null } } }).catch(() => 0),
    prisma.setting.findFirst({ where: { key: "years_experience" } }).catch(() => null),
  ])
  return [
    { number: yearSetting?.value ?? "8", label: "années d'expérience" },
    { number: `${projectCount}+`, label: "projets complétés" },
    { number: `${clientCount}+`, label: "clients" },
    { number: `${categoryCount}+`, label: "expertises" },
  ]
}

export default async function HomePage() {
  const [dbServicesResult, categories, featuredProjects, latestPosts, dbTestimonials, processSettings, statsItems] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true, isFeatured: true }, include: { category: true }, orderBy: { displayOrder: "asc" }, take: 6 }).then((items) => ({ items, total: items.length })).catch(() => ({ items: [], total: 0 })),
    prisma.serviceCategory.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
    prisma.project.findMany({ where: { isActive: true, isFeatured: true }, include: { images: true }, orderBy: { displayOrder: "asc" }, take: 3 }).catch(() => []),
    prisma.blogPost.findMany({ where: { isPublished: true }, include: { category: true }, orderBy: { publishedAt: "desc" }, take: 3 }).catch(() => []),
    prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { displayOrder: "asc" }, select: { content: true, name: true, role: true, company: true, avatar: true } }).catch(() => []),
    prisma.setting.findMany({ where: { group: "process" }, orderBy: { key: "asc" } }).catch(() => []),
    getStats(),
  ])
  const dbServices = dbServicesResult.items

  const categoryIconMap: Record<string, string> = {}
  for (const cat of categories) {
    categoryIconMap[cat.slug] = cat.icon ?? "Code"
  }

  const serviceItems: Service[] = dbServices.map((svc) => ({
    slug: svc.slug,
    title: svc.title,
    description: svc.description ?? "",
    icon: svc.icon ?? categoryIconMap[svc.category.slug] ?? "Code",
    deliverables: (svc.deliverables as string[]) ?? [],
    outcome: svc.outcome ?? "",
    categorySlug: svc.category.slug,
  }))

  const displayServices = serviceItems

  const blogItems = latestPosts.map((p) => ({
    name: p.title,
    url: `${siteUrl}/insights/${p.slug}`,
    description: p.excerpt ?? "",
  }))

  const blogPosts = latestPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.excerpt ?? "",
    category: p.category?.title ?? "",
    author: p.author ?? "Weblancia",
    date: p.publishedAt?.toISOString().split("T")[0] ?? "",
    readTime: p.readingTime ? `${p.readingTime} min` : "5 min",
    image: p.featuredImage ?? undefined,
  }))

  const workItems: WorkItem[] = featuredProjects.map((p) => ({
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

  const testimonials: Testimonial[] = dbTestimonials.map((t) => ({
    quote: t.content,
    author: t.name,
    role: t.role ?? "",
    company: t.company ?? "",
    avatar: t.avatar ?? undefined,
  }))

  const processSteps: ProcessStep[] = processSettings.map((s) => {
    try {
      const parsed = JSON.parse(s.value) as ProcessStep
      return parsed
    } catch {
      return { step: 0, title: s.key, description: s.value }
    }
  })

  return (
    <>
      <WebPageJsonLd name="Weblancia | Agence Digitale Premium à Fès" description={siteConfig.description} url={siteUrl} lang="fr" />
      <ItemListJsonLd itemListElement={[
        ...serviceItems.map((s) => ({ name: s.title, url: `${siteUrl}/services/${s.slug}`, description: s.description })),
        ...workItems.map((w) => ({ name: w.title, url: `${siteUrl}/work/${w.slug}`, description: w.description ?? "" })),
      ]} itemType="Service" pageUrl={siteUrl} />
      <HeroDefault
        headline="L'expertise digitale au service de votre succès"
        subheadline="Agence digitale premium à Fès, spécialisée en création de sites web, développement sur-mesure, SEO et branding. Nous accompagnons les entreprises ambitieuses."
        primaryCta={{ label: "Découvrez nos services", href: "/services" }}
        secondaryCta={{ label: "Voir nos réalisations", href: "/work" }}
      />

      <TrustBar />

      <FeaturedWork items={workItems} />

      <ServicesGrid items={displayServices} />

      <StatsCounter items={statsItems} />

      <ProcessTimeline steps={processSteps} />

      <TestimonialCarousel items={testimonials} />

      {blogPosts.length > 0 && (
        <section className="py-12 md:py-16 lg:py-24 bg-bg-secondary">
          <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
            <div className="text-center mb-10">
              <span className="text-caption font-medium text-accent uppercase tracking-wider">Blog</span>
              <h2 className="text-h2 font-bold mt-2 mb-3">Derniers articles</h2>
              <p className="text-body text-text-secondary max-w-2xl mx-auto">Découvrez nos dernières analyses et tendances du digital.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogPosts.map((article) => (
                <a key={article.slug} href={`/insights/${article.slug}`} className="block bg-surface border border-border rounded-radius-lg overflow-hidden hover:-translate-y-1 hover:border-accent transition-all duration-300 group">
                  <div className="p-6">
                    <span className="text-xs text-accent font-medium">{article.category}</span>
                    <h3 className="text-lg font-semibold mt-1 mb-2 group-hover:text-accent transition-colors">{article.title}</h3>
                    <p className="text-body-sm text-text-secondary line-clamp-2">{article.description}</p>
                    <div className="flex items-center gap-3 mt-4 text-caption text-text-tertiary">
                      <span>{article.author}</span>
                      <span>·</span>
                      <span>{article.readTime}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/insights" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover text-button font-medium transition-colors">
                Voir tous les articles
              </Link>
            </div>
          </div>
        </section>
      )}

      <CTABanner
        headline="Prêt à lancer votre projet digital ?"
        subheadline="Discutons de vos objectifs et trouvons ensemble la solution idéale."
        cta={{ label: "Commencer votre projet", href: "/start-project" }}
        variant="accent"
      />
    </>
  )
}
