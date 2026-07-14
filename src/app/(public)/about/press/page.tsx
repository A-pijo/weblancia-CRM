import { Metadata } from "next"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { siteConfig } from "@/lib/constants/site"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ArrowRight } from "@/components/icons"

export const metadata: Metadata = {
  title: "Press Kit | Weblancia",
  description: "Téléchargez les ressources presse de Weblancia : logo, charte graphique, fiche d'information et photos de l'équipe.",
  keywords: ["Weblancia", "press kit", "médias", "logo", "branding", "ressources"],
  alternates: { canonical: `${siteConfig.url}/about/press` },
  robots: { index: true, follow: true },
}

const brandAssets = [
  { name: "Logo Weblancia (SVG)", description: "Logo principal en format vectoriel pour usage numérique et print.", file: "/images/brand/logo.svg" },
  { name: "Logo Weblancia (PNG)", description: "Logo principal avec fond transparent pour présentations.", file: "/images/brand/logo.png" },
  { name: "Icône Weblancia", description: "Icône carrée pour favicon et profils réseaux sociaux.", file: "/images/brand/icon.svg" },
  { name: "Couleurs de la marque", description: "Palette de couleurs officielle en formats HEX, RGB et CMYK.", file: "/images/brand/colors.pdf" },
]

const facts = [
  { label: "Fondation", value: "2018" },
  { label: "Siège", value: "Fès, Maroc" },
  { label: "Équipe", value: "10+ experts" },
  { label: "Projets livrés", value: "50+" },
  { label: "Secteurs", value: "Santé, E-commerce, Éducation, Immobilier, Finance, Tourisme" },
  { label: "Technologies", value: "Next.js, React, TypeScript, Node.js, Laravel, PostgreSQL" },
  { label: "Clients", value: "PME, startups, grandes entreprises au Maroc et à l'international" },
]

export default function PressPage() {
  return (
    <>
      <WebPageJsonLd name="Press Kit | Weblancia" description="Ressources presse et brand assets de Weblancia" url={`${siteConfig.url}/about/press`} />
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "À Propos", href: "/about" }, { label: "Press Kit" }]} />
          <AnimatedReveal>
            <h1 className="text-h1 mb-4 mt-4">Press Kit</h1>
            <p className="text-body-lg text-text-secondary max-w-2xl mb-8">
              Ressources et informations pour les journalistes, blogueurs et partenaires souhaitant parler de Weblancia.
            </p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">À Propos de Weblancia</h2>
            <p className="text-body text-text-secondary max-w-3xl mb-6">
              Weblancia est une agence digitale premium fondée en 2018 à Fès, Maroc. Nous accompagnons les entreprises
              dans leur transformation numérique en proposant des services de développement web, marketing digital,
              design UI/UX et SEO. Notre équipe de 10+ experts a livré plus de 50 projets pour des clients au Maroc
              et à l&apos;international.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {facts.map((fact) => (
                <div key={fact.label} className="bg-surface border border-border rounded-radius-lg p-4">
                  <p className="text-caption text-text-secondary">{fact.label}</p>
                  <p className="text-body font-semibold mt-1">{fact.value}</p>
                </div>
              ))}
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Brand Assets</h2>
            <p className="text-body text-text-secondary mb-6">
              Téléchargez nos ressources de marque pour une utilisation dans vos articles, vidéos et présentations.
              Merci de respecter les <a href="/legal/terms" className="text-accent hover:underline">conditions d&apos;utilisation</a>.
            </p>
          </AnimatedReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {brandAssets.map((asset, i) => (
              <AnimatedReveal key={asset.name} delay={i * 0.08}>
                <a href={asset.file} download className="block bg-surface border border-border rounded-radius-lg p-5 hover:border-accent transition-colors group">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-body font-semibold group-hover:text-accent transition-colors">{asset.name}</p>
                      <p className="text-body-sm text-text-secondary mt-1">{asset.description}</p>
                    </div>
                    <ArrowRight size={20} className="text-text-tertiary group-hover:text-accent transition-colors shrink-0 ml-4" />
                  </div>
                </a>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Contact Presse</h2>
            <p className="text-body text-text-secondary max-w-2xl mb-4">
              Pour toute demande presse, interview ou information complémentaire :
            </p>
            <div className="space-y-2">
              <p className="text-body"><a href="mailto:contact@weblancia.com" className="text-accent hover:underline">contact@weblancia.com</a></p>
              <p className="text-body"><a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">LinkedIn →</a></p>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <CTABanner
        headline="Vous souhaitez collaborer avec nous ?"
        subheadline="Nous sommes toujours ouverts aux partenariats et collaborations."
        cta={{ label: "Nous contacter", href: "/contact" }}
        variant="subtle"
      />
    </>
  )
}
