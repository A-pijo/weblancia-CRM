import { Metadata } from "next"
import Link from "next/link"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ArrowRight } from "@/components/icons"
import { siteConfig } from "@/lib/constants/site"

type Props = { params: Promise<{ type: string }> }

const consultationTypes = ["strategie-digitale", "site-ecommerce", "seo-marketing", "audit-performance", "refonte-site", "marketing-digital", "transformation-digitale"] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const data = consultationData[type]
  if (!data) return { title: "Consultation | Weblancia" }
  const title = `${data.title} | Weblancia`
  return {
    title,
    description: data.description,
    keywords: `Weblancia, consultation, ${type}, stratégie digitale, Casablanca`,
    alternates: { canonical: `${siteConfig.url}/consultation/${type}` },
    openGraph: { title, description: data.description, url: `${siteConfig.url}/consultation/${type}`, siteName: "Weblancia", locale: "fr_FR", alternateLocale: ["en_US", "ar_SA"], images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title, description: data.description, images: ["/images/og/og.svg"] },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  }
}

const consultationData: Record<string, { title: string; description: string; benefits: string[] }> = {
  "strategie-digitale": {
    title: "Consultation Stratégie Digitale",
    description: "Élaborez une stratégie digitale complète adaptée à vos objectifs d'entreprise. Nous analysons votre marché, votre concurrence et vos opportunités.",
    benefits: ["Analyse de marché approfondie", "Stratégie multicanal", "KPIs et objectifs mesurables", "Roadmap détaillée", "Recommandations budgétaires"],
  },
  "site-ecommerce": {
    title: "Consultation Site Web & E-commerce",
    description: "Obtenez des conseils d'experts pour votre projet de site web ou de boutique en ligne. Architecture, design, technologies et conversion.",
    benefits: ["Conseil en architecture technique", "Recommandations UX/UI", "Stratégie de conversion", "Choix technologiques", "Plan de déploiement"],
  },
  "seo-marketing": {
    title: "Consultation SEO & Marketing",
    description: "Boostez votre visibilité en ligne avec une stratégie SEO et marketing digital sur-mesure.",
    benefits: ["Audit SEO complet", "Stratégie de contenu", "SEO technique", "Campagnes publicitaires", "Social media strategy"],
  },
  "audit-performance": {
    title: "Consultation Audit & Performance",
    description: "Identifiez les opportunités d'optimisation de votre site web. Performance, sécurité, accessibilité et conversion.",
    benefits: ["Analyse de performance", "Audit de sécurité", "Tests d'accessibilité", "Optimisation Core Web Vitals", "Recommandations priorisées"],
  },
  "refonte-site": {
    title: "Consultation Refonte de Site",
    description: "Modernisez votre site web pour améliorer performance, design et expérience utilisateur.",
    benefits: ["Analyse de votre site actuel", "Maquettes et wireframes", "Proposition technique détaillée", "Plan de migration", "Suivi post-lancement"],
  },
  "marketing-digital": {
    title: "Consultation Marketing Digital",
    description: "Optimisez votre acquisition et votre visibilité avec une stratégie marketing sur mesure.",
    benefits: ["Audit SEO et SEA", "Stratégie de contenu", "Calendrier éditorial", "Social media strategy", "Analyse de la concurrence"],
  },
  "transformation-digitale": {
    title: "Consultation Transformation Digitale",
    description: "Accompagnez votre entreprise dans sa transformation numérique avec une approche structurée.",
    benefits: ["Diagnostic de maturité digitale", "Feuille de route stratégique", "Accompagnement au changement", "Choix technologiques", "Formation des équipes"],
  },
}

export default async function ConsultationTypePage({ params }: Props) {
  const { type } = await params
  const data = consultationData[type]
  if (!data) return (
    <SectionWrapper>
      <Container>
        <AnimatedReveal>
          <h1 className="text-h1 mb-4">Type de consultation non trouvé</h1>
          <Link href="/consultation" className="text-accent hover:underline inline-flex items-center gap-1">
            <ArrowRight size={16} className="rotate-180" /> Voir toutes les consultations
          </Link>
        </AnimatedReveal>
      </Container>
    </SectionWrapper>
  )

  return (
    <SectionWrapper>
      <WebPageJsonLd name={data.title + " | Weblancia"} description={data.description} url={`${siteConfig.url}/consultation/${type}`} />
      <Container>
        <AnimatedReveal>
          <Link href="/consultation" className="text-body-sm text-accent hover:text-accent-hover mb-4 inline-flex items-center gap-1">
            <ArrowRight size={16} className="rotate-180" /> Tous les types de consultation
          </Link>
          <h1 className="text-display mt-4 mb-3">{data.title}</h1>
          <p className="text-body-lg text-text-secondary max-w-2xl mb-8">{data.description}</p>
          <Card className="p-8">
            <h2 className="text-h2 font-semibold mb-6">Ce que vous obtiendrez</h2>
            <ul className="flex flex-col gap-3 mb-8">
              {data.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-success shrink-0 mt-0.5" />
                  <span className="text-body">{benefit}</span>
                </li>
              ))}
            </ul>
            <Link href="/book-call">
              <Button size="lg">Réserver une consultation gratuite</Button>
            </Link>
          </Card>
        </AnimatedReveal>
      </Container>
    </SectionWrapper>
  )
}