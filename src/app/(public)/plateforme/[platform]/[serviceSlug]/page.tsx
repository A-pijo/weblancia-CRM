import { Metadata } from "next"
import { notFound } from "next/navigation"
import { siteConfig } from "@/lib/constants/site"
import { platforms, getPlatformBySlug } from "@/lib/data/platforms"
import { serviceSlugs } from "@/lib/data/problems"
import { problems } from "@/lib/data/problems"
import { technologies } from "@/lib/data/technologies"
import { cities } from "@/lib/data/cities"
import { ProgrammaticPage } from "@/components/sections/programmatic-page"

type Props = { params: Promise<{ platform: string; serviceSlug: string }> }

const serviceNames: Record<string, string> = {
  seo: "SEO",
  "web-development": "Développement Web",
  "digital-marketing": "Marketing Digital",
  "branding-design": "Branding & Design",
}

export function generateStaticParams() {
  const params = []
  for (const platform of platforms) {
    for (const slug of serviceSlugs) {
      params.push({ platform: platform.slug, serviceSlug: slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { platform: platformSlug, serviceSlug } = await params
  const platform = getPlatformBySlug(platformSlug)
  const serviceName = serviceNames[serviceSlug]
  if (!platform || !serviceName) return { title: "Page non trouvée | Weblancia" }
  const title = `${serviceName} ${platform.name} | Weblancia`
  return {
    title,
    description: platform.metaDescription,
    alternates: { canonical: `${siteConfig.url}/plateforme/${platform.slug}/${serviceSlug}` },
    openGraph: { title, description: platform.metaDescription, url: `${siteConfig.url}/plateforme/${platform.slug}/${serviceSlug}`, siteName: "Weblancia", locale: "fr_FR" },
    robots: { index: true, follow: true },
  }
}

export default async function PlatformServicePage({ params }: Props) {
  const { platform: platformSlug, serviceSlug } = await params
  const platform = getPlatformBySlug(platformSlug)
  const serviceName = serviceNames[serviceSlug]
  if (!platform || !serviceName) notFound()

  const additionalSections = [
    cities.slice(0, 4).map((c) => ({
      label: c.name,
      href: `/ville/${c.slug}/${serviceSlug}`,
      description: c.description,
    })),
    problems.slice(0, 4).map((p) => ({
      label: p.name,
      href: `/probleme/${p.slug}/${serviceSlug}`,
      description: p.description,
    })),
    technologies.slice(0, 4).map((t) => ({
      label: t.name,
      href: `/technologie/${t.slug}/${serviceSlug}`,
      description: t.description,
    })),
  ]

  return (
    <ProgrammaticPage
      dimension="platform"
      entitySlug={platformSlug}
      serviceSlug={serviceSlug}
      serviceName={serviceName}
      entityMap={{
        problem: { label: "Problèmes", entities: problems, getBySlug: () => undefined },
        technology: { label: "Technologies", entities: technologies, getBySlug: () => undefined },
        platform: { label: "Plateformes", entities: platforms, getBySlug: getPlatformBySlug },
      }}
      additionalSections={additionalSections}
    />
  )
}
