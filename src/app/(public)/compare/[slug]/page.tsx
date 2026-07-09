import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { CTABanner } from "@/components/sections/cta-banner"
import { siteConfig } from "@/lib/constants/site"
import { comparisons, getComparisonBySlug } from "@/lib/data/comparisons"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { Accordion, AccordionItem } from "@/components/ui/accordion"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return comparisons.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const comparison = getComparisonBySlug(slug)
  if (!comparison) return { title: "Page non trouvée | Weblancia" }
  return {
    title: `${comparison.title} | Weblancia`,
    description: comparison.metaDescription,
    alternates: { canonical: `${siteConfig.url}/compare/${comparison.slug}` },
    openGraph: { title: comparison.title, description: comparison.metaDescription, url: `${siteConfig.url}/compare/${comparison.slug}`, siteName: "Weblancia", locale: "fr_FR" },
    robots: { index: true, follow: true },
  }
}

export default async function ComparePage({ params }: Props) {
  const { slug } = await params
  const comparison = getComparisonBySlug(slug)
  if (!comparison) notFound()

  return (
    <>
      <WebPageJsonLd name={comparison.title} description={comparison.metaDescription} url={`${siteConfig.url}/compare/${comparison.slug}`} />
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Comparatifs", href: "/compare" }, { label: comparison.title }]} />
          <AnimatedReveal>
            <div className="mt-4 mb-8">
              <h1 className="text-display mb-4">{comparison.title}</h1>
              <p className="text-body-lg text-text-secondary max-w-2xl mb-6">{comparison.intro}</p>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-8">{comparison.itemA} — Avantages & Inconvénients</h2>
          </AnimatedReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-surface border border-border rounded-radius-lg p-6">
              <h3 className="text-h3 mb-4 text-accent">Avantages de {comparison.itemA}</h3>
              <ul className="space-y-2">
                {comparison.prosA.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 shrink-0">+</span>
                    <span className="text-body text-text-secondary">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface border border-border rounded-radius-lg p-6">
              <h3 className="text-h3 mb-4 text-red-500">Inconvénients de {comparison.itemA}</h3>
              <ul className="space-y-2">
                {comparison.consA.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1 shrink-0">-</span>
                    <span className="text-body text-text-secondary">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <AnimatedReveal>
            <h2 className="text-h2 mb-8">{comparison.itemB} — Avantages & Inconvénients</h2>
          </AnimatedReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-surface border border-border rounded-radius-lg p-6">
              <h3 className="text-h3 mb-4 text-accent">Avantages de {comparison.itemB}</h3>
              <ul className="space-y-2">
                {comparison.prosB.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1 shrink-0">+</span>
                    <span className="text-body text-text-secondary">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-surface border border-border rounded-radius-lg p-6">
              <h3 className="text-h3 mb-4 text-red-500">Inconvénients de {comparison.itemB}</h3>
              <ul className="space-y-2">
                {comparison.consB.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 mt-1 shrink-0">-</span>
                    <span className="text-body text-text-secondary">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-8">Tableau comparatif</h2>
          </AnimatedReveal>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-surface border-b border-border">
                  <th className="text-left p-4 font-semibold">Critère</th>
                  <th className="text-left p-4 font-semibold text-accent">{comparison.itemA}</th>
                  <th className="text-left p-4 font-semibold text-accent">{comparison.itemB}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.table.map((row, i) => (
                  <tr key={i} className="border-b border-border hover:bg-surface/50 transition-colors">
                    <td className="p-4 font-medium">{row.aspect}</td>
                    <td className="p-4 text-text-secondary">{row.aValue}</td>
                    <td className="p-4 text-text-secondary">{row.bValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/services/${comparison.itemASlug}`} className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-radius-md hover:bg-accent-hover transition-colors font-medium">
              En savoir plus sur {comparison.itemA}
            </Link>
            <Link href={`/services/${comparison.itemBSlug}`} className="inline-flex items-center gap-2 border border-accent text-accent px-6 py-3 rounded-radius-md hover:bg-accent/10 transition-colors font-medium">
              En savoir plus sur {comparison.itemB}
            </Link>
          </div>
        </Container>
      </SectionWrapper>

      {comparison.faqs.length > 0 && (
        <SectionWrapper>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h2 mb-6">Questions fréquentes</h2>
              <div className="max-w-3xl mx-auto">
                <Accordion>
                  {comparison.faqs.map((faq, i) => (
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
        headline="Besoin d'aide pour choisir ?"
        subheadline="Nos experts vous accompagnent dans le choix de la meilleure solution pour votre entreprise."
        cta={{ label: "Nous contacter", href: "/contact" }}
        variant="accent"
      />
    </>
  )
}
