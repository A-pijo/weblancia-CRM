import Link from "next/link"
import type { Metadata } from "next"
import { WebPageJsonLd } from "@/components/shared/json-ld"
import { Container } from "@/components/shared/container"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Plan du site | Weblancia",
  description: "Plan du site Weblancia. Retrouvez facilement toutes les pages et ressources disponibles.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteConfig.url}/sitemap` },
  openGraph: {
    title: "Plan du site | Weblancia",
    description: "Plan du site Weblancia. Retrouvez facilement toutes les pages et ressources disponibles.",
    url: `${siteConfig.url}/sitemap`,
    siteName: "Weblancia",
    locale: "fr_FR",
    type: "website",
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@weblancia",
    title: "Plan du site | Weblancia",
    description: "Plan du site Weblancia. Retrouvez facilement toutes les pages et ressources disponibles.",
    images: ["/images/og/og.svg"],
  },
}

const sections = [
  {
    title: "Pages principales",
    links: [
      { label: "Accueil", href: "/" },
      { label: "Services", href: "/services" },
      { label: "Réalisations", href: "/work" },
      { label: "Insights", href: "/insights" },
      { label: "Academy", href: "/academy" },
      { label: "À propos", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Développement web", href: "/services/developpement-web" },
      { label: "Marketing digital", href: "/services/marketing-digital" },
      { label: "Design UI/UX", href: "/services/design" },
      { label: "Branding", href: "/services/branding" },
      { label: "Consulting", href: "/services/consulting" },
    ],
  },
  {
    title: "Academy",
    links: [
      { label: "Cours", href: "/academy/courses" },
      { label: "Ateliers", href: "/academy/workshops" },
      { label: "Ressources", href: "/academy/resources" },
      { label: "Certificats", href: "/academy/certificates" },
      { label: "Carrières", href: "/academy/careers" },
    ],
  },
  {
    title: "À propos",
    links: [
      { label: "Notre équipe", href: "/about/team" },
      { label: "Notre mission", href: "/about/mission" },
      { label: "Carrières", href: "/about/careers" },
      { label: "Press Kit", href: "/about/press" },
    ],
  },
  {
    title: "Par ville",
    links: [
      { label: "Agence SEO Casablanca", href: "/ville/casablanca/seo" },
      { label: "Agence SEO Rabat", href: "/ville/rabat/seo" },
      { label: "Agence SEO Marrakech", href: "/ville/marrakech/seo" },
      { label: "Agence SEO Fès", href: "/ville/fes/seo" },
      { label: "Développement web Casablanca", href: "/ville/casablanca/web-development" },
      { label: "Marketing digital Casablanca", href: "/ville/casablanca/digital-marketing" },
    ],
  },
  {
    title: "Consultation",
    links: [
      { label: "Stratégie digitale", href: "/consultation/strategie-digitale" },
      { label: "Site web & E-commerce", href: "/consultation/site-ecommerce" },
      { label: "SEO & Marketing", href: "/consultation/seo-marketing" },
      { label: "Audit performance", href: "/consultation/audit-performance" },
      { label: "Refonte de site", href: "/consultation/refonte-site" },
      { label: "Marketing digital", href: "/consultation/marketing-digital" },
      { label: "Transformation digitale", href: "/consultation/transformation-digitale" },
    ],
  },
  {
    title: "Autres",
    links: [
      { label: "Recherche", href: "/search" },
      { label: "Réserver un appel", href: "/book-call" },
      { label: "Commencer un projet", href: "/start-project" },
      { label: "Créer un compte", href: "/register" },
      { label: "Nos auteurs", href: "/author" },
    ],
  },
  {
    title: "Informations légales",
    links: [
      { label: "Mentions légales", href: "/legal" },
      { label: "Conditions générales", href: "/legal/terms" },
      { label: "Politique de confidentialité", href: "/legal/privacy" },
      { label: "Gestion des cookies", href: "/legal/cookies" },
      { label: "Politique éditoriale", href: "/legal/editorial-policy" },
      { label: "Politique de correction", href: "/legal/correction-policy" },
      { label: "Vérification des faits", href: "/legal/fact-checking" },
    ],
  },
]

export default function SitemapPage() {
  return (
    <>
      <WebPageJsonLd name="Plan du site | Weblancia" description="Plan du site Weblancia. Retrouvez facilement toutes les pages et ressources disponibles." url={`${siteConfig.url}/sitemap`} />
      <SectionWrapper>
        <Container>
        <h1 className="text-display mb-4">Plan du site</h1>
        <p className="text-body-lg text-text-secondary mb-12 max-w-2xl">
          Retrouvez facilement toutes les pages et ressources disponibles sur Weblancia.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-h2 font-semibold mb-4">{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body text-text-secondary hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </SectionWrapper>
    </>
  )
}
