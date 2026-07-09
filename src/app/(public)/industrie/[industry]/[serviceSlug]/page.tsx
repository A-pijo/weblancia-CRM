import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { CTABanner } from "@/components/sections/cta-banner"
import { siteConfig } from "@/lib/constants/site"
import { getIndustryBySlug, industries, getIndustryServiceMapping } from "@/lib/data/industries"
import { prisma } from "@/lib/database/prisma"
import { ServiceJsonLd, WebPageJsonLd } from "@/components/shared/json-ld"
import { ArrowRight } from "@/components/icons"

type Props = { params: Promise<{ industry: string; serviceSlug: string }> }

export async function generateStaticParams() {
  const serviceSlugs = ["web-development", "seo", "digital-marketing", "branding-design"]
  const params = []
  for (const industry of industries) {
    for (const serviceSlug of serviceSlugs) {
      params.push({ industry: industry.slug, serviceSlug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: industrySlug, serviceSlug } = await params
  const industry = getIndustryBySlug(industrySlug)
  const mapping = getIndustryServiceMapping(serviceSlug)
  if (!industry || !mapping) return { title: "Page non trouvée | Weblancia" }
  const title = mapping.title.replace("{industry}", industry.name)
  const description = mapping.description.replace(/{industry}/g, industry.name)
  return {
    title: `${title} | Weblancia`,
    description,
    alternates: { canonical: `${siteConfig.url}/industrie/${industry.slug}/${serviceSlug}` },
    openGraph: { title, description, url: `${siteConfig.url}/industrie/${industry.slug}/${serviceSlug}`, siteName: "Weblancia", locale: "fr_FR" },
    robots: { index: true, follow: true },
  }
}

export default async function IndustryServicePage({ params }: Props) {
  const { industry: industrySlug, serviceSlug } = await params
  const industry = getIndustryBySlug(industrySlug)
  const mapping = getIndustryServiceMapping(serviceSlug)
  if (!industry || !mapping) notFound()

  const title = mapping.title.replace("{industry}", industry.name)
  const description = mapping.description.replace(/{industry}/g, industry.name)

  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } }).catch(() => null)
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    take: 4,
  }).catch(() => [])

  const otherIndustries = industries.filter((i) => i.slug !== industry.slug)

  return (
    <>
      <WebPageJsonLd name={title} description={description} url={`${siteConfig.url}/industrie/${industry.slug}/${serviceSlug}`} />
      {service && <ServiceJsonLd name={service.title} description={description} category={serviceSlug} />}
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: title }]} />
          <AnimatedReveal>
            <div className="mt-4 mb-8">
              <h1 className="text-display mb-4">{title}</h1>
              <p className="text-body-lg text-text-secondary max-w-2xl mb-6">{description}</p>
              <Link href="/book-call" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-radius-md hover:bg-accent-hover transition-colors font-medium">
                Réserver un appel <ArrowRight size={18} />
              </Link>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-4">{service?.title ?? "Nos Services"} pour le secteur {industry.name}</h2>
            <p className="text-body text-text-secondary max-w-2xl mb-6">
              Weblancia accompagne les acteurs du secteur {industry.name} dans leur transformation digitale.
              Nous comprenons les enjeux spécifiques de votre secteur et adaptons nos solutions en conséquence.
            </p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Également Disponible pour</h2>
          </AnimatedReveal>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {otherIndustries.map((ind, i) => (
              <AnimatedReveal key={ind.slug} delay={i * 0.08}>
                <Link href={`/industrie/${ind.slug}/${serviceSlug}`} className="block bg-surface border border-border rounded-radius-lg p-4 text-center hover:border-accent transition-colors h-full">
                  <p className="text-body font-semibold">{ind.name}</p>
                  <p className="text-caption text-text-secondary line-clamp-2">{ind.description}</p>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      {projects.length > 0 && (
        <SectionWrapper bgSecondary>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h2 mb-6">Nos Réalisations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((p, i) => (
                  <AnimatedReveal key={p.id} delay={i * 0.08}>
                    <Link href={`/work/${p.slug}`} className="block bg-surface border border-border rounded-radius-lg p-6 hover:border-accent transition-colors h-full">
                      <h3 className="text-body font-semibold mb-1">{p.title}</h3>
                      <p className="text-body-sm text-text-secondary line-clamp-2">{p.description}</p>
                    </Link>
                  </AnimatedReveal>
                ))}
              </div>
            </AnimatedReveal>
          </Container>
        </SectionWrapper>
      )}

      <CTABanner
        headline={`Prêt à développer votre projet dans le secteur ${industry.name} ?`}
        subheadline="Contactez notre équipe pour discuter de vos besoins spécifiques."
        cta={{ label: "Nous contacter", href: "/contact" }}
        variant="accent"
      />
    </>
  )
}
