import { Metadata } from "next"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { siteConfig } from "@/lib/constants/site"
import { CheckCircle, MapPin, Lightning } from "@/components/icons"

export const metadata: Metadata = {
  title: "Notre Mission | Weblancia",
  description: "Découvrez la mission de Weblancia : démocratiser l'accès à des solutions digitales de qualité pour toutes les entreprises.",
  alternates: { canonical: `${siteConfig.url}/about/mission` },
  openGraph: {
    title: "Notre Mission | Weblancia",
    description: "Découvrez la mission de Weblancia : démocratiser l'accès à des solutions digitales de qualité pour toutes les entreprises.",
    url: `${siteConfig.url}/about/mission`,
  },
}

const pillars = [
  {
    icon: Lightning,
    title: "Notre mission",
    items: [
      "Accompagner les entreprises marocaines dans leur transformation numérique",
      "Démocratiser l'accès à des solutions digitales de qualité professionnelle",
      "Former les talents de demain aux métiers du digital",
    ],
  },
  {
    icon: MapPin,
    title: "Notre vision",
    items: [
      "Devenir le partenaire digital de référence au Maroc et en Afrique",
      "Créer un écosystème numérique inclusive et durable",
      "Contribuer au rayonnement du digital marocain à l'international",
    ],
  },
  {
    icon: CheckCircle,
    title: "Notre engagement",
    items: [
      "Qualité irréprochable dans chaque projet livré",
      "Relations transparentes et durables avec nos clients",
      "Innovation constante pour rester à la pointe du secteur",
    ],
  },
]

export default function MissionPage() {
  return (
    <>
      <HeroDefault
        headline="Notre Mission"
        subheadline="Démocratiser l'accès à des solutions digitales de qualité pour toutes les entreprises."
        align="left"
      />
      <SectionWrapper bgSecondary>
        <Container>
          <div className="max-w-3xl mx-auto mb-16">
            <AnimatedReveal>
              <SectionHeader
                label="Pourquoi Weblancia"
                title="Notre raison d'être"
                description="Née de la conviction que chaque entreprise mérite une présence digitale d'exception, Weblancia s'engage à rendre le digital accessible, performant et humain."
                align="center"
              />
            </AnimatedReveal>
            <AnimatedReveal delay={0.1}>
              <p className="text-body text-text-secondary leading-relaxed text-center">
                Au Maroc, trop d&apos;entreprises peinent encore à tirer parti du potentiel du digital. 
                Entre manque de ressources, d&apos;expertise ou de vision, les obstacles sont nombreux. 
                Weblancia est née pour changer cela. Nous croyons en un digital qui sert la croissance, 
                pas la complexité. Notre approche allie expertise technique, vision stratégique et 
                accompagnement humain pour transformer chaque défi digital en opportunité.
              </p>
            </AnimatedReveal>
          </div>
        </Container>
      </SectionWrapper>
      <SectionWrapper>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {pillars.map((pillar, index) => (
              <AnimatedReveal key={pillar.title} delay={index * 0.08}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-6">
                    <pillar.icon size={28} className="text-accent" />
                  </div>
                  <h3 className="text-h4 font-semibold mb-4">{pillar.title}</h3>
                  <ul className="space-y-3 text-left">
                    {pillar.items.map((item) => (
                      <li key={item} className="text-body-sm text-text-secondary flex items-start gap-2">
                        <CheckCircle size={16} className="text-accent mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Prêt à construire votre projet digital ?"
        subheadline="Notre équipe est là pour vous accompagner à chaque étape."
        cta={{ label: "Démarrer un projet", href: "/start-project" }}
        variant="accent"
      />
    </>
  )
}
