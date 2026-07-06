import { Metadata } from "next"
import { notFound } from "next/navigation"
import { siteConfig } from "@/lib/constants/site"
import { technologies, getTechnologyBySlug } from "@/lib/data/technologies"
import { serviceSlugs } from "@/lib/data/problems"
import { ProgrammaticPage } from "@/components/sections/programmatic-page"

type Props = { params: Promise<{ technology: string; serviceSlug: string }> }

const serviceNames: Record<string, string> = {
  seo: "SEO",
  "web-development": "Développement Web",
  "digital-marketing": "Marketing Digital",
  "branding-design": "Branding & Design",
}

export function generateStaticParams() {
  const params = []
  for (const tech of technologies) {
    for (const slug of serviceSlugs) {
      params.push({ technology: tech.slug, serviceSlug: slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { technology: techSlug, serviceSlug } = await params
  const tech = getTechnologyBySlug(techSlug)
  const serviceName = serviceNames[serviceSlug]
  if (!tech || !serviceName) return { title: "Page non trouvée | Weblancia" }
  const title = `${serviceName} ${tech.name} | Weblancia`
  return {
    title,
    description: tech.metaDescription,
    alternates: { canonical: `${siteConfig.url}/technologie/${tech.slug}/${serviceSlug}` },
    openGraph: { title, description: tech.metaDescription, url: `${siteConfig.url}/technologie/${tech.slug}/${serviceSlug}`, siteName: "Weblancia", locale: "fr_FR" },
    robots: { index: true, follow: true },
  }
}

export default async function TechnologyServicePage({ params }: Props) {
  const { technology: techSlug, serviceSlug } = await params
  const tech = getTechnologyBySlug(techSlug)
  const serviceName = serviceNames[serviceSlug]
  if (!tech || !serviceName) notFound()

  return (
    <ProgrammaticPage
      dimension="technology"
      entitySlug={techSlug}
      serviceSlug={serviceSlug}
      serviceName={serviceName}
      entityMap={{
        problem: { label: "Problèmes", entities: [], getBySlug: () => undefined },
        technology: { label: "Technologies", entities: technologies, getBySlug: getTechnologyBySlug },
        platform: { label: "Plateformes", entities: [], getBySlug: () => undefined },
      }}
    />
  )
}
