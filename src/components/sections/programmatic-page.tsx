import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { CTABanner } from "@/components/sections/cta-banner"
import { WebPageJsonLd, ServiceJsonLd } from "@/components/shared/json-ld"
import { siteConfig } from "@/lib/constants/site"
import { generateIntro, generateFaqs, generateCta, generateServiceDescription } from "@/lib/semantic/templates"
import type { Problem } from "@/lib/data/problems"
import type { Technology } from "@/lib/data/technologies"
import type { Platform } from "@/lib/data/platforms"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem } from "@/components/ui/accordion"

type Entity = Problem | Technology | Platform

interface EntityMap {
  problem: { label: string; entities: Entity[]; getBySlug: (slug: string) => Entity | undefined }
  technology: { label: string; entities: Entity[]; getBySlug: (slug: string) => Entity | undefined }
  platform: { label: string; entities: Entity[]; getBySlug: (slug: string) => Entity | undefined }
}

interface ProgrammaticPageProps {
  dimension: "problem" | "technology" | "platform"
  entitySlug: string
  serviceSlug: string
  entityMap: EntityMap
  serviceName: string
}

const dimMeta: Record<string, { label: string; path: string }> = {
  problem: { label: "Problèmes", path: "/probleme" },
  technology: { label: "Technologies", path: "/technologie" },
  platform: { label: "Plateformes", path: "/plateforme" },
}

export function ProgrammaticPage({ dimension, entitySlug, serviceSlug, entityMap, serviceName }: ProgrammaticPageProps) {
  const dim = dimMeta[dimension]
  const dimData = entityMap[dimension]
  const entity = dimData?.getBySlug(entitySlug) ?? null
  if (!entity) return null

  const entityInfo = { name: entity.name, description: entity.description }
  const pageUrl = `${siteConfig.url}${dim.path}/${entity.slug}/${serviceSlug}`
  const intro = generateIntro(dimension, entityInfo, serviceSlug)
  const faqs = generateFaqs(dimension, entityInfo, serviceSlug, 3)
  const cta = generateCta(dimension, entityInfo, serviceSlug)
  const svcDescription = generateServiceDescription(entityInfo, serviceSlug)

  const sameDimEntities = dimData.entities
    .filter((e: Entity) => e.slug !== entitySlug)
    .slice(0, 4)

  return (
    <>
      <WebPageJsonLd
        name={`${serviceName} pour ${entity.name} | Weblancia`}
        description={entity.metaDescription}
        url={pageUrl}
      />
      <ServiceJsonLd name={`${serviceName} pour ${entity.name}`} description={entity.metaDescription} category={serviceSlug} pageUrl={pageUrl} />

      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[
            { label: dim.label, href: dim.path },
            { label: `${serviceName} pour ${entity.name}` },
          ]} />
          <AnimatedReveal>
            <div className="mt-4 mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="accent">{serviceName}</Badge>
                <Badge variant="outline">{entity.name}</Badge>
              </div>
              <h1 className="text-display mb-4">{serviceName} pour {entity.name}</h1>
              <p className="text-body-lg text-text-secondary max-w-2xl mb-6">{intro}</p>
              <Link href="/book-call" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-radius-md hover:bg-accent-hover transition-colors font-medium">
                {cta.label}
              </Link>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-4">{serviceName} — {entity.name}</h2>
            <p className="text-body text-text-secondary max-w-2xl mb-6">{svcDescription}</p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      {sameDimEntities.length > 0 && (
        <SectionWrapper>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h2 mb-6">Autres {dim.label.toLowerCase()}</h2>
            </AnimatedReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {sameDimEntities.map((e: Entity) => (
                <Link
                  key={e.slug}
                  href={`${dim.path}/${e.slug}/${serviceSlug}`}
                  className="block bg-surface border border-border rounded-radius-lg p-4 text-center hover:border-accent transition-colors h-full"
                >
                  <p className="text-body font-semibold">{e.name}</p>
                  <p className="text-caption text-text-secondary">{e.description}</p>
                </Link>
              ))}
            </div>
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

      <CTABanner headline={cta.headline} subheadline={cta.subheadline} cta={{ label: cta.label, href: cta.href }} variant="accent" />
    </>
  )
}
