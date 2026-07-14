import { Metadata } from "next"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Politique de Confidentialité | Weblancia",
  description: "Politique de confidentialité de Weblancia : comment nous collectons, utilisons et protégeons vos données personnelles.",
  keywords: ["Weblancia", "confidentialité", "RGPD", "données personnelles", "vie privée"],
  alternates: { canonical: `${siteConfig.url}/legal/privacy` },
  openGraph: {
    title: "Politique de Confidentialité | Weblancia",
    description: "Politique de confidentialité de Weblancia : comment nous collectons, utilisons et protégeons vos données personnelles.",
    url: `${siteConfig.url}/legal/privacy`,
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Politique de Confidentialité | Weblancia", description: "Politique de confidentialité de Weblancia.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true },
}

export default function PrivacyPage() {
  return (
    <>
      <WebPageJsonLd name="Politique de Confidentialité | Weblancia" description="Consultez la politique de confidentialité de Weblancia." url={`${siteConfig.url}/legal/privacy`} />
      <SectionWrapper>
        <Container>
        <AnimatedReveal>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h1 mb-4">Politique de Confidentialité</h1>
            <p className="text-caption text-text-tertiary mb-8">Dernière mise à jour : 1er janvier 2025</p>

            <h2 className="text-h2 font-semibold mb-4">1. Collecte des données</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Nous collectons les données personnelles que vous nous fournissez via nos formulaires 
              de contact, de devis et d&apos;inscription : nom, prénom, adresse email, numéro de téléphone 
              et nom de l&apos;entreprise. Ces données sont strictement nécessaires à la gestion de votre demande.
            </p>

            <h2 className="text-h2 font-semibold mb-4">2. Finalités du traitement</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Vos données sont utilisées pour : répondre à vos demandes de contact et de devis, 
              assurer le suivi de votre projet, vous envoyer des informations commerciales 
              (avec votre consentement), et améliorer nos services.
            </p>

            <h2 className="text-h2 font-semibold mb-4">3. Base légale</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Le traitement de vos données repose sur votre consentement (formulaires de contact), 
              l&apos;exécution d&apos;un contrat (suivi de projet) et notre intérêt légitime 
              (amélioration des services).
            </p>

            <h2 className="text-h2 font-semibold mb-4">4. Durée de conservation</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Vos données sont conservées pendant la durée nécessaire à la réalisation des finalités 
              pour lesquelles elles ont été collectées, et au maximum 3 ans après notre dernier contact.
            </p>

            <h2 className="text-h2 font-semibold mb-4">5. Destinataires des données</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Vos données sont destinées aux services internes de Weblancia. Elles ne sont pas 
              transmises à des tiers sans votre consentement, sauf obligation légale.
            </p>

            <h2 className="text-h2 font-semibold mb-4">6. Sécurité</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées 
              pour protéger vos données contre tout accès non autorisé, altération ou divulgation.
            </p>

            <h2 className="text-h2 font-semibold mb-4">7. Vos droits</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Conformément à la loi marocaine 09-08 et au RGPD, vous disposez d&apos;un droit 
              d&apos;accès, de rectification, d&apos;effacement et de portabilité de vos données, 
              ainsi que du droit de limiter ou de vous opposer au traitement. Pour exercer 
              ces droits, contactez-nous à privacy@weblancia.ma.
            </p>

            <h2 className="text-h2 font-semibold mb-4">8. Contact</h2>
            <p className="text-body text-text-secondary leading-relaxed">
              Pour toute question relative à la protection de vos données, vous pouvez nous 
              contacter à l&apos;adresse : privacy@weblancia.ma.
            </p>
          </div>
        </AnimatedReveal>
      </Container>
    </SectionWrapper>
    </>
  )
}
