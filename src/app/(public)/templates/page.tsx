import { Metadata } from "next"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { siteConfig } from "@/lib/constants/site"
import { WebPageJsonLd } from "@/components/shared/json-ld"

const templates = [
  { title: "Template cahier des charges site web", description: "Un template complet pour rédiger votre cahier des charges et bien communiquer avec votre agence web.", href: "/services/web-development" },
  { title: "Template stratégie SEO", description: "Structurez votre stratégie SEO avec ce template prêt à l'emploi : audit, plan d'action, suivi.", href: "/services/seo" },
  { title: "Template plan marketing digital", description: "Planifiez votre stratégie marketing digital avec ce template structuré par objectifs et canaux.", href: "/services/digital-marketing" },
  { title: "Template brief créatif branding", description: "Cadrez votre projet de branding avec ce brief créatif détaillé pour votre agence de design.", href: "/services/branding-design" },
  { title: "Template audit de site web", description: "Évaluez la performance de votre site web avec ce template d'audit complet.", href: "/consultation/audit-performance" },
  { title: "Template budget marketing", description: "Planifiez et suivez votre budget marketing digital avec ce template Excel/Google Sheets.", href: "/consultation/strategie-digitale" },
]

export const metadata: Metadata = {
  title: "Templates & Outils | Weblancia",
  description: "Nos templates prêts à l'emploi pour vos projets digitaux : cahier des charges, plan marketing, audit SEO, brief branding et plus.",
  alternates: { canonical: `${siteConfig.url}/templates` },
  openGraph: { title: "Templates & Outils | Weblancia", description: "Nos templates prêts à l'emploi pour vos projets digitaux.", url: `${siteConfig.url}/templates`, siteName: "Weblancia", locale: "fr_FR" },
  robots: { index: true, follow: true },
}

export default function TemplatesPage() {
  return (
    <>
      <WebPageJsonLd name="Templates & Outils | Weblancia" description="Nos templates prêts à l'emploi pour vos projets digitaux." url={`${siteConfig.url}/templates`} />
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Templates" }]} />
          <AnimatedReveal>
            <div className="mt-4 mb-8">
              <h1 className="text-display mb-4">Templates & Outils</h1>
              <p className="text-body-lg text-text-secondary max-w-2xl mb-6">
                Des templates et outils prêts à l&apos;emploi pour structurer vos projets digitaux. Téléchargez-les et adaptez-les à vos besoins.
              </p>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((item, i) => (
              <AnimatedReveal key={i} delay={i * 0.05}>
                <Link href={item.href} className="block bg-surface border border-border rounded-radius-lg p-6 hover:border-accent transition-colors h-full">
                  <h3 className="text-h3 mb-2">{item.title}</h3>
                  <p className="text-body-sm text-text-secondary">{item.description}</p>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
