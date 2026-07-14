import { Metadata } from "next"
import Link from "next/link"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { siteConfig } from "@/lib/constants/site"
import { AboutPageJsonLd } from "@/components/shared/json-ld"
import { ArrowRight } from "@/components/icons"

export const metadata: Metadata = {
  title: "À Propos | Weblancia — Agence Digitale Premium à Fès",
  description: "Weblancia est une agence digitale premium basée à Fès, spécialisée en développement web, marketing digital, UI/UX design et SEO. Fondée en 2018, nous accompagnons les entreprises dans leur transformation numérique.",
  keywords: ["Weblancia", "agence digitale", "Fès", "développement web", "marketing digital", "design", "à propos", "transformation numérique"],
  alternates: { canonical: `${siteConfig.url}/about` },
  openGraph: { title: "À Propos | Weblancia — Agence Digitale Premium", description: "Découvrez Weblancia, agence digitale premium fondée en 2018 à Fès.", url: `${siteConfig.url}/about`, siteName: "Weblancia", locale: "fr_FR", alternateLocale: ["en_US", "ar_SA"], images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "À Propos | Weblancia — Agence Digitale Premium", description: "Découvrez Weblancia, agence digitale premium fondée en 2018 à Fès.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

const milestones = [
  { year: "2018", title: "Fondation", description: "Création de Weblancia à Fès avec la vision de devenir l'agence digitale de référence au Maroc." },
  { year: "2019", title: "Premiers Projets", description: "Lancement des premiers sites web et applications pour des clients locaux et internationaux." },
  { year: "2020", title: "Croissance & Academy", description: "Expansion de l'équipe et lancement de Weblancia Academy pour former les talents digitaux." },
  { year: "2021", title: "Expertise SEO", description: "Développement de l'expertise SEO et référencement naturel, nouveau pilier stratégique." },
  { year: "2023", title: "50+ Projets", description: "Plus de 50 projets livrés avec satisfaction client, équipe de 10+ experts." },
  { year: "2025", title: "Innovation & IA", description: "Intégration de l'IA générative dans nos processus et lancement de nouvellesoffres." },
]

const values = [
  { title: "Excellence", description: "Nous visons la qualité maximale dans chaque projet, de la conception à la livraison." },
  { title: "Innovation", description: "Nous explorons constamment les nouvelles technologies pour offrir des solutions avant-gardistes." },
  { title: "Transparence", description: "Communication claire et honnête avec nos clients à chaque étape du projet." },
  { title: "Engagement", description: "Nous nous impliquons pleinement dans la réussite de chaque projet comme s'il était le nôtre." },
]

const stats = [
  { value: "2018", label: "Année de fondation" },
  { value: "50+", label: "Projets livrés" },
  { value: "10+", label: "Experts dans l'équipe" },
  { value: "95%", label: "Clients satisfaits" },
]

export default function AboutPage() {
  return (
    <>
      <AboutPageJsonLd />
      <HeroDefault
        headline="À Propos"
        subheadline="Weblancia est une agence digitale premium fondée en 2018 à Fès, dédiée à la transformation numérique des entreprises."
        primaryCta={{ label: "Notre équipe", href: "/about/team" }}
        secondaryCta={{ label: "Notre mission", href: "/about/mission" }}
        align="left"
      />
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-4">Qui sommes-nous ?</h2>
            <p className="text-body text-text-secondary max-w-2xl mb-6">
              Weblancia accompagne les entreprises dans leur stratégie digitale : création de sites web,
              développement d&apos;applications, marketing digital et design. Notre approche allie expertise technique
              et vision créative pour des résultats mesurables. Basés à Fès, nous servons des clients au Maroc et à
              l&apos;international depuis 2018.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-surface border border-border rounded-radius-lg">
                  <p className="text-h3 font-bold text-accent mb-1">{stat.value}</p>
                  <p className="text-caption text-text-secondary">{stat.label}</p>
                </div>
              ))}
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Notre Histoire</h2>
            <div className="relative">
              {milestones.map((m, i) => (
                <div key={m.year} className="flex gap-4 pb-8 last:pb-0 relative">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-accent shrink-0 mt-1.5" />
                    {i < milestones.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                  </div>
                  <div>
                    <span className="text-caption font-semibold text-accent">{m.year}</span>
                    <h3 className="text-body font-semibold mt-1">{m.title}</h3>
                    <p className="text-body-sm text-text-secondary mt-1">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Nos Valeurs</h2>
          </AnimatedReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <AnimatedReveal key={value.title} delay={index * 0.08}>
                <div className="bg-surface border border-border rounded-radius-lg p-6 text-center h-full">
                  <h3 className="text-body font-semibold mb-2">{value.title}</h3>
                  <p className="text-body-sm text-text-secondary">{value.description}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-h2 mb-4">Notre Équipe</h2>
              <p className="text-body text-text-secondary mb-6">
                Une équipe d&apos;experts passionnés par le digital, réunissant des compétences en développement,
                design, marketing et stratégie.
              </p>
              <Link href="/about/team" className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium transition-colors">
                Rencontrer l'équipe <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Envie de travailler avec nous ?"
        subheadline="Nous sommes toujours à la recherche de nouveaux défis."
        cta={{ label: "Nous contacter", href: "/contact" }}
        variant="accent"
      />
    </>
  )
}
