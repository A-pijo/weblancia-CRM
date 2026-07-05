import { prisma } from "@/lib/database/prisma"
import { cities } from "@/lib/data/cities"
import { industries } from "@/lib/data/industries"
import { siteConfig } from "@/lib/constants/site"

const CITY_ALIASES: Record<string, string> = {
  casablanca: "casablanca", casa: "casablanca",
  rabat: "rabat", salé: "rabat",
  marrakech: "marrakech", marrakesh: "marrakech",
  fes: "fes", fès: "fes", fez: "fes",
  tanger: "tanger", tangier: "tanger", tangiers: "tanger",
  agadir: "agadir",
}

const INDUSTRY_ALIASES: Record<string, string> = {
  santé: "sante", sante: "sante", healthcare: "sante", medical: "sante",
  ecommerce: "ecommerce", "e-commerce": "ecommerce", retail: "ecommerce",
  éducation: "education", education: "education", learning: "education", formation: "education",
  immobilier: "immobilier", realestate: "immobilier", "real estate": "immobilier", property: "immobilier",
  finance: "finance", banking: "finance", fintech: "finance", banque: "finance",
  tourisme: "tourisme", tourism: "tourisme", hospitality: "tourisme", hotel: "tourisme",
}

const SERVICE_MATCHERS: { keywords: string[]; slug: string }[] = [
  { keywords: ["seo", "referencement", "google"], slug: "seo" },
  { keywords: ["web", "site", "developpement", "development"], slug: "web-development" },
  { keywords: ["marketing", "social media", "reseaux", "publicite", "ads"], slug: "digital-marketing" },
  { keywords: ["branding", "design", "logo", "marque", "identite"], slug: "branding-design" },
]

export interface SemanticClusters {
  services: { slug: string; title: string; url: string }[]
  faq: { question: string; answer: string }[]
  industries: { slug: string; name: string; url: string; serviceSlug: string }[]
  cities: { slug: string; name: string; url: string; serviceSlug: string }[]
  projects: { slug: string; title: string; url: string; industry?: string | null }[]
  resources: { slug: string; title: string; url: string }[]
  relatedPosts: { slug: string; title: string; url: string; category: string }[]
}

function normalizeTag(tag: string): string {
  return tag.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function matchEntities(tags: string[]): { citySlugs: string[]; industrySlugs: string[]; serviceSlugs: string[] } {
  const normalized = tags.map(normalizeTag)
  const citySlugs: string[] = []
  const industrySlugs: string[] = []
  const serviceSlugs: string[] = []

  for (const tag of normalized) {
    const citySlug = CITY_ALIASES[tag]
    if (citySlug && !citySlugs.includes(citySlug)) citySlugs.push(citySlug)
    const industrySlug = INDUSTRY_ALIASES[tag]
    if (industrySlug && !industrySlugs.includes(industrySlug)) industrySlugs.push(industrySlug)
    for (const matcher of SERVICE_MATCHERS) {
      if (matcher.keywords.some((k) => tag.includes(k))) {
        if (!serviceSlugs.includes(matcher.slug)) serviceSlugs.push(matcher.slug)
      }
    }
  }
  return { citySlugs, industrySlugs, serviceSlugs }
}

const ALL_SERVICE_SLUGS_FALLBACK = ["web-development", "seo", "digital-marketing", "branding-design"]

export async function getSemanticClusters(tags: string[] | null, categoryId: number, currentPostId: number): Promise<SemanticClusters> {
  const result: SemanticClusters = {
    services: [],
    faq: [],
    industries: [],
    cities: [],
    projects: [],
    resources: [],
    relatedPosts: [],
  }

  const { citySlugs, industrySlugs, serviceSlugs } = matchEntities(tags ?? [])
  const matchedServiceSlugs = serviceSlugs.length > 0 ? serviceSlugs : ALL_SERVICE_SLUGS_FALLBACK.slice(0, 2)

  const [dbServices, dbProjects, dbFaq, dbResources, dbRelated] = await Promise.all([
    prisma.service.findMany({
      where: { slug: { in: matchedServiceSlugs }, isActive: true },
      select: { slug: true, title: true },
    }),
    prisma.project.findMany({
      where: {
        isActive: true,
        OR: [
          ...(industrySlugs.length > 0
            ? industrySlugs.map((s) => ({ industry: { contains: s } }))
            : [{ isFeatured: true } as const]),
        ],
      },
      select: { slug: true, title: true, industry: true },
      orderBy: { displayOrder: "asc" },
      take: 3,
    }),
    prisma.fAQ.findMany({
      where: { isActive: true },
      select: { question: true, answer: true },
      orderBy: { displayOrder: "asc" },
      take: 4,
    }),
    prisma.resource.findMany({
      where: {
        isPublished: true,
        ...(serviceSlugs.length > 0
          ? { slug: { in: serviceSlugs } }
          : {}),
      },
      select: { slug: true, title: true },
      take: 3,
    }),
    prisma.blogPost.findMany({
      where: { isPublished: true, categoryId, id: { not: currentPostId } },
      select: { slug: true, title: true, category: { select: { title: true } } },
      orderBy: { publishedAt: "desc" },
      take: 4,
    }),
  ])

  result.services = dbServices.map((s) => ({
    slug: s.slug,
    title: s.title,
    url: `${siteConfig.url}/services/${s.slug}`,
  }))

  result.projects = dbProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    url: `${siteConfig.url}/work/${p.slug}`,
    industry: p.industry,
  }))

  result.faq = dbFaq

  result.resources = dbResources.map((r) => ({
    slug: r.slug,
    title: r.title,
    url: `${siteConfig.url}/academy/resources/${r.slug}`,
  }))

  result.relatedPosts = dbRelated.map((p) => ({
    slug: p.slug,
    title: p.title,
    url: `${siteConfig.url}/insights/${p.slug}`,
    category: p.category?.title ?? "",
  }))

  const primaryServiceSlug = matchedServiceSlugs[0] ?? "web-development"

  result.cities = citySlugs.slice(0, 3).map((slug) => {
    const city = cities.find((c) => c.slug === slug)
    return {
      slug,
      name: city?.name ?? slug,
      url: `${siteConfig.url}/ville/${slug}/${primaryServiceSlug}`,
      serviceSlug: primaryServiceSlug,
    }
  })

  result.industries = industrySlugs.slice(0, 3).map((slug) => {
    const industry = industries.find((i) => i.slug === slug)
    return {
      slug,
      name: industry?.name ?? slug,
      url: `${siteConfig.url}/industrie/${slug}/${primaryServiceSlug}`,
      serviceSlug: primaryServiceSlug,
    }
  })

  return result
}
