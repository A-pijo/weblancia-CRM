import { Metadata } from "next"
import Link from "next/link"
import { CollectionPageJsonLd } from "@/components/shared/json-ld"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { cn } from "@/lib/utils/cn"
import { siteConfig } from "@/lib/constants/site"
import { prisma } from "@/lib/database/prisma"

export const metadata: Metadata = {
  title: "Nos Services | Weblancia",
  description:
    "Découvrez notre gamme complète de services digitaux : développement web, marketing digital, branding, consulting et audit.",
  keywords: ["Weblancia", "services", "développement web", "marketing digital", "branding", "consulting", "Casablanca"],
  alternates: { canonical: `${siteConfig.url}/services` },
  openGraph: { title: "Nos Services | Weblancia", description: "Découvrez notre gamme complète de services digitaux : développement web, marketing digital, branding, consulting et audit.", url: `${siteConfig.url}/services`, siteName: "Weblancia", locale: "fr_FR", alternateLocale: ["en_US", "ar_SA"], images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Nos Services | Weblancia", description: "Découvrez notre gamme complète de services digitaux pour votre entreprise.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

export const revalidate = 3600

export default async function ServicesPage() {
  const categories = await prisma.serviceCategory.findMany({ orderBy: { displayOrder: "asc" } })

  return (
    <>
      <CollectionPageJsonLd name="Nos Services | Weblancia" description="Découvrez notre gamme complète de services digitaux : développement web, marketing digital, branding, consulting et audit." url={`${siteConfig.url}/services`} numberOfItems={categories.length} />
      <HeroDefault
        headline="Nos Services"
        subheadline="De la stratégie à l'exécution, nous offrons une gamme complète de services digitaux pour accélérer votre croissance."
        primaryCta={{ label: "Besoin d'un conseil ?", href: "/book-call" }}
        align="left"
      />
      <SectionWrapper>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((cat, index) => (
              <AnimatedReveal key={cat.slug} delay={index * 0.08}>
                <div
                  className={cn(
                    "group bg-surface border border-border rounded-radius-lg p-6",
                    "transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg",
                    "flex flex-col h-full",
                  )}
                >
                  <div className="w-10 h-10 rounded-full bg-accent-light text-accent flex items-center justify-center text-lg font-semibold mb-4 shrink-0">
                    {index + 1}
                  </div>
                  <h2 className="text-h2 font-semibold mb-2">{cat.title}</h2>
                  <p className="text-body-sm text-text-secondary line-clamp-2 mb-4">
                    {cat.description}
                  </p>
                  <div className="mt-auto">
                    <Link
                      href={`/services/${cat.slug}`}
                      className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover text-button font-medium hover:underline transition-colors duration-200"
                    >
                      Voir les services
                    </Link>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Vous ne savez pas par où commencer ?"
        subheadline="Réservez une consultation gratuite de 30 minutes. Nous vous aidons à définir la meilleure stratégie pour votre projet."
        cta={{ label: "Réserver une consultation", href: "/book-call" }}
        variant="accent"
      />
    </>
  )
}
