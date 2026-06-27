import { Metadata } from "next"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Gestion des Cookies | Weblancia",
  description: "Politique de gestion des cookies de Weblancia : comment nous utilisons les cookies et comment les contrôler.",
  alternates: { canonical: `${siteConfig.url}/legal/cookies` },
  openGraph: {
    title: "Gestion des Cookies | Weblancia",
    description: "Politique de gestion des cookies de Weblancia : comment nous utilisons les cookies et comment les contrôler.",
    url: `${siteConfig.url}/legal/cookies`,
  },
}

export default function CookiesPage() {
  return (
    <SectionWrapper>
      <Container>
        <AnimatedReveal>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-h1 mb-4">Gestion des Cookies</h1>
            <p className="text-caption text-text-tertiary mb-8">Dernière mise à jour : 1er janvier 2025</p>

            <h2 className="text-h3 font-semibold mb-4">1. Qu&apos;est-ce qu&apos;un cookie ?</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Un cookie est un petit fichier texte déposé sur votre appareil lors de la visite 
              d&apos;un site web. Il permet de stocker des informations relatives à votre navigation 
              et d&apos;améliorer votre expérience utilisateur.
            </p>

            <h2 className="text-h3 font-semibold mb-4">2. Types de cookies utilisés</h2>
            <p className="text-body text-text-secondary mb-4 leading-relaxed font-medium">Cookies essentiels :</p>
            <p className="text-body text-text-secondary mb-4 leading-relaxed">
              Nécessaires au fonctionnement du site, ils ne peuvent pas être désactivés. 
              Ils permettent la navigation et l&apos;accès aux fonctionnalités de base.
            </p>
            <p className="text-body text-text-secondary mb-4 leading-relaxed font-medium">Cookies analytiques :</p>
            <p className="text-body text-text-secondary mb-4 leading-relaxed">
              Nous utilisons Google Analytics (4) et Microsoft Clarity pour comprendre comment 
              vous utilisez notre site et améliorer nos services. Ces cookies sont activés 
              uniquement après votre consentement.
            </p>
            <p className="text-body text-text-secondary mb-6 leading-relaxed font-medium">Cookies marketing :</p>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Utilisés pour mesurer l&apos;efficacité de nos campagnes publicitaires. 
              Activés uniquement avec votre consentement explicite.
            </p>

            <h2 className="text-h3 font-semibold mb-4">3. Base légale</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Conformément à la directive européenne 2009/136/CE et à la loi marocaine 09-08, 
              nous recueillons votre consentement préalable pour le dépôt de cookies non essentiels. 
              Vous pouvez retirer votre consentement à tout moment.
            </p>

            <h2 className="text-h3 font-semibold mb-4">4. Gestion des cookies</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Vous pouvez gérer vos préférences de cookies à tout moment via le panneau de 
              configuration accessible depuis notre site. Vous pouvez également configurer 
              votre navigateur pour refuser les cookies.
            </p>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Pour désactiver Google Analytics, vous pouvez installer le module complémentaire 
              de désactivation disponible à l&apos;adresse : tools.google.com/dlpage/gaoptout.
            </p>

            <h2 className="text-h3 font-semibold mb-4">5. Durée de conservation</h2>
            <p className="text-body text-text-secondary mb-6 leading-relaxed">
              Les cookies analytiques sont conservés pour une durée maximale de 13 mois. 
              Passé ce délai, votre consentement sera à nouveau sollicité.
            </p>

            <h2 className="text-h3 font-semibold mb-4">6. Contact</h2>
            <p className="text-body text-text-secondary leading-relaxed">
              Pour toute question relative à l&apos;utilisation des cookies, contactez-nous 
              à l&apos;adresse : privacy@weblancia.ma.
            </p>
          </div>
        </AnimatedReveal>
      </Container>
    </SectionWrapper>
  )
}
