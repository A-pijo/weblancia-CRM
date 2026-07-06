import { Metadata } from "next"
import { notFound } from "next/navigation"
import { siteConfig } from "@/lib/constants/site"
import { platforms, getPlatformBySlug } from "@/lib/data/platforms"
import { serviceSlugs } from "@/lib/data/problems"
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

  return (
    <ProgrammaticPage
      dimension="platform"
      entitySlug={platformSlug}
      serviceSlug={serviceSlug}
      serviceName={serviceName}
      entityMap={{
        problem: { label: "Problèmes", entities: [], getBySlug: () => undefined },
        technology: { label: "Technologies", entities: [], getBySlug: () => undefined },
        platform: { label: "Plateformes", entities: platforms, getBySlug: getPlatformBySlug },
      }}
    />
  )
}
