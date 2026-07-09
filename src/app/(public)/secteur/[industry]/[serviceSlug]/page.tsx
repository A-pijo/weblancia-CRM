import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { CTABanner } from "@/components/sections/cta-banner"
import { siteConfig } from "@/lib/constants/site"
import { getSectorBySlug, sectors, getSectorServiceMapping } from "@/lib/data/sectors"
import { prisma } from "@/lib/database/prisma"
import { ServiceJsonLd, WebPageJsonLd } from "@/components/shared/json-ld"
import { cities } from "@/lib/data/cities"
import { problems } from "@/lib/data/problems"
import { ArrowRight } from "@/components/icons"
import { generateIntro, generateFaqs, generateCta, generateServiceDescription } from "@/lib/semantic/templates"
import { Accordion, AccordionItem } from "@/components/ui/accordion"

type Props = { params: Promise<{ industry: string; serviceSlug: string }> }

const serviceSlugs = ["web-development", "seo", "digital-marketing", "branding-design"]

export async function generateStaticParams() {
  const params = []
  for (const sector of sectors) {
    for (const serviceSlug of serviceSlugs) {
      params.push({ industry: sector.slug, serviceSlug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { industry: industrySlug, serviceSlug } = await params
  const sector = getSectorBySlug(industrySlug)
  const mapping = getSectorServiceMapping(serviceSlug)
  if (!sector || !mapping) return { title: "Page non trouvée | Weblancia" }
  const title = mapping.title.replace("{sector}", sector.name)
  const description = mapping.description.replace(/{sector}/g, sector.name)
  return {
    title: `${title} | Weblancia`,
    description,
    alternates: { canonical: `${siteConfig.url}/secteur/${sector.slug}/${serviceSlug}` },
    openGraph: { title, description, url: `${siteConfig.url}/secteur/${sector.slug}/${serviceSlug}`, siteName: "Weblancia", locale: "fr_FR" },
    robots: { index: true, follow: true },
  }
}

export default async function SectorServicePage({ params }: Props) {
  const { industry: industrySlug, serviceSlug } = await params
  const sector = getSectorBySlug(industrySlug)
  const mapping = getSectorServiceMapping(serviceSlug)
  if (!sector || !mapping) notFound()

  const title = mapping.title.replace("{sector}", sector.name)
  const description = mapping.description.replace(/{sector}/g, sector.name)

  const service = await prisma.service.findUnique({ where: { slug: serviceSlug } }).catch(() => null)
  const projects = await prisma.project.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    take: 4,
  }).catch(() => [])

  const otherSectors = sectors.filter((s) => s.slug !== sector.slug)
  const relatedCities = cities.slice(0, 4)
  const relatedProblems = problems.slice(0, 4)

  const entityInfo = { name: sector.name, description: sector.description }
  const intro = generateIntro("sector", entityInfo, serviceSlug)
  const faqs = generateFaqs("sector", entityInfo, serviceSlug, 3)
  const cta = generateCta("sector", entityInfo, serviceSlug)
  const svcDescription = generateServiceDescription(entityInfo, serviceSlug)

  return (
    <>
      <WebPageJsonLd name={title} description={description} url={`${siteConfig.url}/secteur/${sector.slug}/${serviceSlug}`} />
      {service && <ServiceJsonLd name={service.title} description={description} category={serviceSlug} />}
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Secteurs", href: "/secteur" }, { label: title }]} />
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
            <h2 className="text-h2 mb-4">{service?.title ?? "Nos Services"} pour le secteur {sector.name}</h2>
            <p className="text-body text-text-secondary max-w-2xl mb-6">{svcDescription}</p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Autres secteurs d&apos;activité</h2>
          </AnimatedReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherSectors.slice(0, 8).map((s) => (
              <Link
                key={s.slug}
                href={`/secteur/${s.slug}/${serviceSlug}`}
                className="block bg-surface border border-border rounded-radius-lg p-4 text-center hover:border-accent transition-colors h-full"
              >
                <p className="text-body font-semibold">{s.name}</p>
                <p className="text-caption text-text-secondary line-clamp-2">{s.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Services disponibles dans vos villes</h2>
          </AnimatedReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedCities.map((c) => (
              <Link
                key={c.slug}
                href={`/ville/${c.slug}/${serviceSlug}`}
                className="block bg-surface border border-border rounded-radius-lg p-4 text-center hover:border-accent transition-colors h-full"
              >
                <p className="text-body font-semibold">{c.name}</p>
                <p className="text-caption text-text-secondary line-clamp-2">{c.description}</p>
              </Link>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Solutions à vos problèmes</h2>
          </AnimatedReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProblems.map((p) => (
              <Link
                key={p.slug}
                href={`/probleme/${p.slug}/${serviceSlug}`}
                className="block bg-surface border border-border rounded-radius-lg p-4 text-center hover:border-accent transition-colors h-full"
              >
                <p className="text-body font-semibold">{p.name}</p>
                <p className="text-caption text-text-secondary line-clamp-2">{p.description}</p>
              </Link>
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

      {faqs.length > 0 && (
        <SectionWrapper bgSecondary>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h2 mb-6">Questions fréquentes</h2>
              <div className="max-w-3xl mx-auto">
                <Accordion>
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} title={faq.question}>
                      {faq.answer}
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AnimatedReveal>
          </Container>
        </SectionWrapper>
      )}

      <CTABanner
        headline={`Prêt à développer votre projet dans le secteur ${sector.name} ?`}
        subheadline="Contactez notre équipe pour discuter de vos besoins spécifiques."
        cta={{ label: "Nous contacter", href: "/contact" }}
        variant="accent"
      />
    </>
  )
}
