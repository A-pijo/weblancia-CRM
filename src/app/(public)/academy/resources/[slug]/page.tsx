import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Badge } from "@/components/ui/badge"
import { Clock, CalendarBlank, ArrowRight } from "@/components/icons"
import { getResourceBySlug, getPublishedResources } from "@/lib/academy/resources/queries"
import { siteConfig } from "@/lib/constants/site"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const resources = await getPublishedResources().catch(() => [])
  return resources.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const resource = await getResourceBySlug(slug).catch(() => null)
  if (!resource) return { title: "Ressource non trouvée | Weblancia Academy" }
  return {
    title: `${resource.title} | Weblancia Academy`,
    description: resource.description ?? undefined,
    alternates: { canonical: `${siteConfig.url}/academy/resources/${resource.slug}` },
    openGraph: {
      title: resource.title,
      description: resource.description ?? undefined,
      url: `${siteConfig.url}/academy/resources/${resource.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: resource.title,
      description: resource.description ?? undefined,
    },
  }
}

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params
  const resource = await getResourceBySlug(slug).catch(() => null)
  if (!resource) notFound()

  return (
    <SectionWrapper>
      <Container>
        <AnimatedReveal>
          <Link href="/academy/resources" className="text-body-sm text-accent hover:text-accent-hover mb-4 inline-flex items-center gap-1">
            <ArrowRight size={16} className="rotate-180" /> Toutes les ressources
          </Link>
          <div className="max-w-3xl mx-auto mt-4">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="accent">{resource.category?.title ?? resource.type ?? "Ressource"}</Badge>
            </div>
            <h1 className="text-display mb-4">{resource.title}</h1>
            {resource.description && (
              <p className="text-body-lg text-text-secondary mb-6">{resource.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-caption text-text-tertiary mb-8 pb-8 border-b border-border">
              <span className="flex items-center gap-1.5"><CalendarBlank size={16} /> {new Date(resource.createdAt).toLocaleDateString("fr-FR")}</span>
              {resource.type && (
                <span className="flex items-center gap-1.5"><Clock size={16} /> {resource.type}</span>
              )}
            </div>
            {resource.image && (
              <div className="relative aspect-[16/9] rounded-radius-xl overflow-hidden bg-bg-secondary mb-8">
                <Image src={resource.image} alt={resource.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" />
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              <p className="text-body text-text-primary leading-relaxed whitespace-pre-line">{resource.description}</p>
            </div>
          </div>
        </AnimatedReveal>
      </Container>
    </SectionWrapper>
  )
}
