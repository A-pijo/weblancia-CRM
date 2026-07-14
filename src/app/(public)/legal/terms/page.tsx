import { Metadata } from "next"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Conditions Générales | Weblancia",
  description: "Conditions générales d'utilisation et de vente de Weblancia.",
  keywords: ["Weblancia", "CGU", "conditions générales", "conditions de vente"],
  alternates: { canonical: `${siteConfig.url}/legal/terms` },
  openGraph: {
    title: "Conditions Générales | Weblancia",
    description: "Conditions générales d'utilisation et de vente de Weblancia.",
    url: `${siteConfig.url}/legal/terms`,
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Conditions Générales | Weblancia", description: "Conditions générales d'utilisation et de vente de Weblancia.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true },
}

export default function TermsPage() {
  return (
    <>
      <WebPageJsonLd name="Conditions Générales | Weblancia" description="Consultez les conditions générales d'utilisation de Weblancia." url={`${siteConfig.url}/legal/terms`} />
      <SectionWrapper>
        <Container>
        <AnimatedReveal>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h1 mb-4">Conditions Générales</h1>
            <p className="text-caption text-text-tertiary mb-8">Dernière mise à jour : 1er janvier 2025</p>

            <h2 className="text-h2 font-semibold mb-4">1. Objet</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Les présentes Conditions Générales régissent l&apos;utilisation des services proposés par Weblancia 
              (SARL au capital de 100 000 DH, siège social à Casablanca, Maroc). 
              Tout client ou visiteur accepte sans réserve les présentes conditions.
            </p>

            <h2 className="text-h2 font-semibold mb-4">2. Services</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Weblancia propose des services de développement web, marketing digital, design UI/UX, 
              consulting et formation. Chaque prestation fait l&apos;objet d&apos;un devis et d&apos;un contrat 
              spécifique détaillant les livrables, délais et modalités.
            </p>

            <h2 className="text-h2 font-semibold mb-4">3. Propriété intellectuelle</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Le client conserve la propriété intellectuelle de ses contenus. Weblancia conserve 
              la propriété de ses outils, méthodes et codes source génériques. Les livrables 
              spécifiques sont cédés au client après paiement intégral.
            </p>

            <h2 className="text-h2 font-semibold mb-4">4. Devis et facturation</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Les devis sont valables 30 jours. La facturation s&apos;effectue selon les modalités 
              définies dans le contrat. Tout dépassement de périmètre fera l&apos;objet d&apos;un avenant.
            </p>

            <h2 className="text-h2 font-semibold mb-4">5. Confidentialité</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Weblancia s&apos;engage à maintenir la confidentialité des informations échangées 
              dans le cadre des prestations. Les données clients ne seront en aucun cas 
              divulguées à des tiers sans accord préalable.
            </p>

            <h2 className="text-h2 font-semibold mb-4">6. Responsabilité</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Weblancia s&apos;engage à mettre en œuvre tous les moyens nécessaires à la bonne 
              exécution des prestations. La responsabilité de Weblancia est limitée au 
              montant des prestations facturées.
            </p>

            <h2 className="text-h2 font-semibold mb-4">7. Droit applicable</h2>
            <p className="text-body text-text-secondary leading-relaxed">
              Les présentes conditions sont soumises au droit marocain. Tout litige relève 
              de la compétence des tribunaux de Casablanca.
            </p>
          </div>
        </AnimatedReveal>
      </Container>
    </SectionWrapper>
    </>
  )
}
