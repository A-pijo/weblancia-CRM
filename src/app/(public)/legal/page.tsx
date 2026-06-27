import { Metadata } from "next"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Mentions Légales | Weblancia",
  description: "Mentions légales, politique de confidentialité, conditions générales et gestion des cookies de Weblancia.",
  alternates: { canonical: `${siteConfig.url}/legal` },
  openGraph: { title: "Mentions Légales | Weblancia", description: "Mentions légales, politique de confidentialité, conditions générales et gestion des cookies de Weblancia.", url: `${siteConfig.url}/legal` },
  twitter: { card: "summary_large_image", title: "Mentions Légales | Weblancia", description: "Mentions légales et informations juridiques de Weblancia." },
}

export default function LegalPage() {
  return (
    <SectionWrapper>
      <Container>
        <AnimatedReveal>
          <h1 className="text-h1 mb-4">Mentions Legales</h1>
          <p className="text-body text-text-secondary mb-8">
            Retrouvez ici l&apos;ensemble des informations legales concernant Weblancia.
          </p>
          <div className="space-y-6 max-w-2xl">
            <div className="bg-surface border border-border rounded-radius-lg p-6">
              <h2 className="text-h3 mb-2">Politique de confidentialite</h2>
              <p className="text-body-sm text-text-secondary">
                Decouvrez comment nous traitons vos donnees personnelles.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-radius-lg p-6">
              <h2 className="text-h3 mb-2">Conditions generales</h2>
              <p className="text-body-sm text-text-secondary">
                Consultez nos conditions generales d&apos;utilisation et de vente.
              </p>
            </div>
            <div className="bg-surface border border-border rounded-radius-lg p-6">
              <h2 className="text-h3 mb-2">Gestion des cookies</h2>
              <p className="text-body-sm text-text-secondary">
                En savoir plus sur notre utilisation des cookies.
              </p>
            </div>
          </div>
        </AnimatedReveal>
      </Container>
    </SectionWrapper>
  )
}
