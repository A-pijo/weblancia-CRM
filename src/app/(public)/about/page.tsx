import { Metadata } from "next"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "À Propos | Weblancia",
  description: "Découvrez Weblancia, une agence digitale premium spécialisée en développement web, marketing digital et design à Casablanca.",
  alternates: { canonical: `${siteConfig.url}/about` },
  openGraph: { title: "À Propos | Weblancia", description: "Découvrez Weblancia, une agence digitale premium spécialisée en développement web, marketing digital et design à Casablanca.", url: `${siteConfig.url}/about` },
  twitter: { card: "summary_large_image", title: "À Propos | Weblancia", description: "Découvrez Weblancia, une agence digitale premium spécialisée en développement web, marketing digital et design à Casablanca." },
}

export default function AboutPage() {
  return (
    <>
      <HeroDefault
        headline="À Propos"
        subheadline="Weblancia est une agence digitale premium dédiée à la transformation numérique des entreprises."
        primaryCta={{ label: "Notre équipe", href: "/about/team" }}
        secondaryCta={{ label: "Notre mission", href: "/about/mission" }}
        align="left"
      />
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-4">Qui sommes-nous ?</h2>
            <p className="text-body text-text-secondary max-w-2xl">
              Weblancia accompagne les entreprises dans leur stratégie digitale : création de sites web,
              développement d&apos;applications, marketing digital et design. Notre approche allie expertise technique
              et vision créative pour des résultats mesurables.
            </p>
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
