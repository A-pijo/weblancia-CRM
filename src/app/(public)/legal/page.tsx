import { Metadata } from "next"
import Link from "next/link"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { siteConfig } from "@/lib/constants/site"
import { ArrowRight } from "@/components/icons"

export const metadata: Metadata = {
  title: "Mentions Légales | Weblancia",
  description: "Mentions légales, politique de confidentialité, conditions générales, politique éditoriale et gestion des cookies de Weblancia.",
  keywords: ["Weblancia", "mentions légales", "CGU", "politique confidentialité", "cookies", "politique éditoriale"],
  alternates: { canonical: `${siteConfig.url}/legal` },
  openGraph: { title: "Mentions Légales | Weblancia", description: "Informations légales, politiques éditoriales et confidentialité de Weblancia.", url: `${siteConfig.url}/legal`, siteName: "Weblancia", locale: "fr_FR", alternateLocale: ["en_US", "ar_SA"], images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Mentions Légales | Weblancia", description: "Informations légales et politiques de Weblancia.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

const legalLinks = [
  { title: "Politique de confidentialité", description: "Comment nous traitons vos données personnelles.", href: "/legal/privacy" },
  { title: "Conditions générales", description: "Conditions générales d'utilisation et de vente.", href: "/legal/terms" },
  { title: "Gestion des cookies", description: "En savoir plus sur notre utilisation des cookies.", href: "/legal/cookies" },
  { title: "Politique éditoriale", description: "Nos principes et processus de création de contenu.", href: "/legal/editorial-policy" },
  { title: "Politique de correction", description: "Comment nous traitons les erreurs et mettons à jour nos articles.", href: "/legal/correction-policy" },
  { title: "Vérification des faits", description: "Notre processus de vérification des informations.", href: "/legal/fact-checking" },
]

export default function LegalPage() {
  return (
    <>
      <WebPageJsonLd name="Informations Légales | Weblancia" description="Consultez les informations légales et politiques éditoriales de Weblancia." url={`${siteConfig.url}/legal`} />
      <SectionWrapper>
        <Container>
        <AnimatedReveal>
          <h1 className="text-h1 mb-4">Mentions Légales</h1>
          <p className="text-body text-text-secondary mb-8">
            Retrouvez ici l&apos;ensemble des informations légales et politiques éditoriales concernant Weblancia.
          </p>
          <div className="space-y-4 max-w-2xl">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="block bg-surface border border-border rounded-radius-lg p-6 hover:border-accent transition-colors group">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-body font-semibold mb-1 group-hover:text-accent transition-colors">{link.title}</h2>
                    <p className="text-body-sm text-text-secondary">{link.description}</p>
                  </div>
                  <ArrowRight size={20} className="text-text-tertiary group-hover:text-accent transition-colors shrink-0 ml-4" />
                </div>
              </Link>
            ))}
          </div>
        </AnimatedReveal>
      </Container>
    </SectionWrapper>
    </>
  )
}
