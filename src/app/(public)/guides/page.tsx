import { Metadata } from "next"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { siteConfig } from "@/lib/constants/site"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { problems } from "@/lib/data/problems"
import { technologies } from "@/lib/data/technologies"
import { platforms } from "@/lib/data/platforms"

const guides = [
  { title: "Guide SEO complet pour les entreprises marocaines", description: "Tout ce que vous devez savoir pour optimiser votre référencement naturel au Maroc.", href: "/services/seo", category: "SEO" },
  { title: "Guide de création de site web au Maroc", description: "Les étapes clés pour créer un site web professionnel pour votre entreprise.", href: "/services/web-development", category: "Web" },
  { title: "Guide marketing digital pour PME", description: "Stratégies digitales efficaces pour les petites et moyennes entreprises au Maroc.", href: "/services/digital-marketing", category: "Marketing" },
  { title: "Guide branding et identité visuelle", description: "Comment créer une marque forte et une identité visuelle mémorable.", href: "/services/branding-design", category: "Design" },
  ...problems.map((p) => ({
    title: `Guide : Résoudre le problème de ${p.name.toLowerCase()}`,
    description: p.description,
    href: `/probleme/${p.slug}/seo`,
    category: "Problèmes",
  })),
  ...technologies.map((t) => ({
    title: `Guide ${t.name} pour votre projet web`,
    description: t.description,
    href: `/technologie/${t.slug}/web-development`,
    category: "Technologies",
  })),
  ...platforms.map((p) => ({
    title: `Guide ${p.name} pour votre entreprise`,
    description: p.description,
    href: `/plateforme/${p.slug}/web-development`,
    category: "Plateformes",
  })),
]

export const metadata: Metadata = {
  title: "Guides & Ressources | Weblancia",
  description: "Tous nos guides pour réussir votre transformation digitale : SEO, création web, marketing digital, branding et solutions technologiques.",
  alternates: { canonical: `${siteConfig.url}/guides` },
  openGraph: { title: "Guides & Ressources | Weblancia", description: "Tous nos guides pour réussir votre transformation digitale.", url: `${siteConfig.url}/guides`, siteName: "Weblancia", locale: "fr_FR" },
  robots: { index: true, follow: true },
}

export default function GuidesPage() {
  return (
    <>
      <WebPageJsonLd name="Guides & Ressources | Weblancia" description="Tous nos guides pour réussir votre transformation digitale." url={`${siteConfig.url}/guides`} />
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Guides" }]} />
          <AnimatedReveal>
            <div className="mt-4 mb-8">
              <h1 className="text-display mb-4">Guides & Ressources</h1>
              <p className="text-body-lg text-text-secondary max-w-2xl mb-6">
                Explorez notre collection de guides pour maîtriser le marketing digital, le développement web et le SEO au Maroc.
              </p>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, i) => (
              <AnimatedReveal key={i} delay={i * 0.03}>
                <Link href={guide.href} className="block bg-surface border border-border rounded-radius-lg p-6 hover:border-accent transition-colors h-full">
                  <span className="inline-block text-caption font-medium text-accent mb-2">{guide.category}</span>
                  <h3 className="text-h3 mb-2">{guide.title}</h3>
                  <p className="text-body-sm text-text-secondary">{guide.description}</p>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
