import { Metadata } from "next"
import Link from "next/link"
import { CollectionPageJsonLd } from "@/components/shared/json-ld"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { siteConfig } from "@/lib/constants/site"
import { ArrowRight, CheckCircle } from "@/components/icons"

export const metadata: Metadata = {
  title: "Consultation | Weblancia",
  description: "Réservez une consultation personnalisée avec nos experts pour définir la stratégie digitale de votre projet.",
  keywords: ["Weblancia", "consultation", "stratégie digitale", "Casablanca", "expert"],
  alternates: { canonical: `${siteConfig.url}/consultation` },
  openGraph: {
    title: "Consultation | Weblancia",
    description: "Réservez une consultation personnalisée avec nos experts pour définir la stratégie digitale de votre projet.",
    url: `${siteConfig.url}/consultation`,
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Consultation | Weblancia", description: "Réservez une consultation personnalisée avec nos experts.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

const consultationTypes = [
  {
    title: "Stratégie digitale",
    description: "Définissez votre feuille de route digitale : audit, objectifs, budget et plan d'action.",
    href: "/consultation/strategie-digitale",
    benefits: ["Audit complet de votre presence en ligne", "Recommandations personnalisées", "Plan d'action priorisé"],
  },
  {
    title: "Refonte de site",
    description: "Modernisez votre site web pour améliorer performance, design et expérience utilisateur.",
    href: "/consultation/refonte-site",
    benefits: ["Analyse de votre site actuel", "Maquettes et wireframes", "Proposition technique détaillée"],
  },
  {
    title: "Marketing digital",
    description: "Optimisez votre acquisition et votre visibilité avec une stratégie marketing sur mesure.",
    href: "/consultation/marketing-digital",
    benefits: ["Audit SEO et SEA", "Stratégie de contenu", "Calendrier éditorial"],
  },
  {
    title: "Transformation digitale",
    description: "Accompagnez votre entreprise dans sa transformation numérique avec une approche structurée.",
    href: "/consultation/transformation-digitale",
    benefits: ["Diagnostic de maturité digitale", "Feuille de route stratégique", "Accompagnement au changement"],
  },
]

const processSteps = [
  { step: "01", title: "Prise de contact", description: "Remplissez le formulaire et nous vous recontacterons sous 24h." },
  { step: "02", title: "Audit express", description: "Nous analysons votre besoin et préparons nos recommandations." },
  { step: "03", title: "Consultation", description: "Échange de 45 min avec un expert pour valider la stratégie." },
  { step: "04", title: "Proposition", description: "Recevez un devis détaillé et personnalisé sous 48h." },
]

export default function ConsultationPage() {
  return (
    <>
      <CollectionPageJsonLd name="Consultation | Weblancia" description="Réservez une consultation personnalisée avec nos experts pour définir la stratégie digitale de votre projet." url={`${siteConfig.url}/consultation`} numberOfItems={4} />
      <HeroDefault
        headline="Consultation"
        subheadline="Réservez une consultation personnalisée avec nos experts pour accélérer votre projet digital."
        primaryCta={{ label: "Voir les types de consultation", href: "#types" }}
        align="left"
      />
      <SectionWrapper id="types" bgSecondary>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Nos consultations"
              title="Choisissez le type de consultation"
              description="Chaque consultation est adaptée à votre besoin spécifique. Sélectionnez celle qui correspond à votre projet."
              align="center"
            />
          </AnimatedReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultationTypes.map((type, index) => (
              <AnimatedReveal key={type.title} delay={index * 0.08}>
                <Link
                  href={type.href}
                  className="group bg-surface border border-border rounded-radius-lg p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg"
                >
                  <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                  <p className="text-body-sm text-text-secondary mb-6">{type.description}</p>
                  <ul className="space-y-2 mb-6">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="text-body-sm text-text-primary flex items-start gap-2">
                        <CheckCircle size={16} className="text-accent mt-0.5 shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <span className="inline-flex items-center gap-1.5 text-body-sm font-medium text-accent mt-auto group-hover:gap-2 transition-all">
                    En savoir plus <ArrowRight size={16} />
                  </span>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Comment ça marche"
              title="Notre processus de consultation"
              description="Un accompagnement structuré pour transformer vos idées en résultats concrets."
              align="center"
            />
          </AnimatedReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <AnimatedReveal key={step.step} delay={index * 0.08}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-accent">{step.step}</span>
                  </div>
                  <h3 className="text-body font-semibold mb-2">{step.title}</h3>
                  <p className="text-body-sm text-text-secondary">{step.description}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <SectionWrapper bgSecondary>
        <Container>
          <div className="max-w-xl mx-auto">
            <AnimatedReveal>
              <SectionHeader
                title="Prêt à démarrer ?"
                description="Réservez votre consultation dès maintenant. Notre équipe vous recontactera sous 24h pour planifier votre rendez-vous."
                align="center"
              />
            </AnimatedReveal>
            <AnimatedReveal delay={0.1}>
              <div className="bg-surface border border-border rounded-radius-lg p-8">
                <p className="text-body text-text-secondary text-center mb-6">
                  Pour réserver, contactez-nous directement ou choisissez un type de consultation ci-dessus.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-radius-lg font-medium hover:bg-accent-hover transition-colors"
                  >
                    Nous contacter <ArrowRight size={16} />
                  </Link>
                  <Link
                    href="/book-call"
                    className="inline-flex items-center justify-center gap-2 border border-border bg-transparent text-text-primary px-6 py-3 rounded-radius-lg font-medium hover:border-accent transition-colors"
                  >
                    Réserver un appel
                  </Link>
                </div>
              </div>
            </AnimatedReveal>
          </div>
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Besoin immédiat ?"
        subheadline="Contactez-nous directement pour une réponse rapide sous 24h."
        cta={{ label: "Nous contacter", href: "/contact" }}
        variant="subtle"
      />
    </>
  )
}
