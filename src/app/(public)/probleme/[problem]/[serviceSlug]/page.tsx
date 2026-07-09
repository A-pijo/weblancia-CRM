import { Metadata } from "next"
import { notFound } from "next/navigation"
import { siteConfig } from "@/lib/constants/site"
import { problems, getProblemBySlug, serviceSlugs } from "@/lib/data/problems"
import { technologies } from "@/lib/data/technologies"
import { platforms } from "@/lib/data/platforms"
import { cities } from "@/lib/data/cities"
import { ProgrammaticPage } from "@/components/sections/programmatic-page"

type Props = { params: Promise<{ problem: string; serviceSlug: string }> }

const serviceNames: Record<string, string> = {
  seo: "SEO",
  "web-development": "Développement Web",
  "digital-marketing": "Marketing Digital",
  "branding-design": "Branding & Design",
}

export function generateStaticParams() {
  const params = []
  for (const problem of problems) {
    for (const slug of serviceSlugs) {
      params.push({ problem: problem.slug, serviceSlug: slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { problem: problemSlug, serviceSlug } = await params
  const problem = getProblemBySlug(problemSlug)
  const serviceName = serviceNames[serviceSlug]
  if (!problem || !serviceName) return { title: "Page non trouvée | Weblancia" }
  const title = `${serviceName} pour ${problem.name} | Weblancia`
  return {
    title,
    description: problem.metaDescription,
    alternates: { canonical: `${siteConfig.url}/probleme/${problem.slug}/${serviceSlug}` },
    openGraph: { title, description: problem.metaDescription, url: `${siteConfig.url}/probleme/${problem.slug}/${serviceSlug}`, siteName: "Weblancia", locale: "fr_FR" },
    robots: { index: true, follow: true },
  }
}

export default async function ProblemServicePage({ params }: Props) {
  const { problem: problemSlug, serviceSlug } = await params
  const problem = getProblemBySlug(problemSlug)
  const serviceName = serviceNames[serviceSlug]
  if (!problem || !serviceName) notFound()

  const additionalSections = [
    cities.slice(0, 4).map((c) => ({
      label: c.name,
      href: `/ville/${c.slug}/${serviceSlug}`,
      description: c.description,
    })),
    technologies.slice(0, 4).map((t) => ({
      label: t.name,
      href: `/technologie/${t.slug}/${serviceSlug}`,
      description: t.description,
    })),
    platforms.slice(0, 4).map((p) => ({
      label: p.name,
      href: `/plateforme/${p.slug}/${serviceSlug}`,
      description: p.description,
    })),
  ]

  return (
    <ProgrammaticPage
      dimension="problem"
      entitySlug={problemSlug}
      serviceSlug={serviceSlug}
      serviceName={serviceName}
      entityMap={{
        problem: { label: "Problèmes", entities: problems, getBySlug: getProblemBySlug },
        technology: { label: "Technologies", entities: technologies, getBySlug: () => undefined },
        platform: { label: "Plateformes", entities: platforms, getBySlug: () => undefined },
      }}
      additionalSections={additionalSections}
    />
  )
}
