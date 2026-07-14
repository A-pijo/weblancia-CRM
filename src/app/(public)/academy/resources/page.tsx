import { Metadata } from "next"
import Link from "next/link"
import { CollectionPageJsonLd } from "@/components/shared/json-ld"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/lib/constants/site"
import { prisma } from "@/lib/database/prisma"
import { ArrowRight, CalendarBlank } from "@/components/icons"

export const metadata: Metadata = {
  title: "Ressources | Weblancia Academy",
  description: "Accédez à nos ressources gratuites : templates, guides, cheatsheets et outils pour votre apprentissage.",
  keywords: ["Weblancia", "academy", "ressources", "templates", "guides", "cheatsheets", "gratuit"],
  alternates: { canonical: `${siteConfig.url}/academy/resources` },
  openGraph: {
    title: "Ressources | Weblancia Academy",
    description: "Accédez à nos ressources gratuites : templates, guides, cheatsheets et outils pour votre apprentissage.",
    url: `${siteConfig.url}/academy/resources`,
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Ressources | Weblancia Academy", description: "Accédez à nos ressources gratuites pour votre apprentissage.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

export const revalidate = 3600

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({ where: { isPublished: true }, include: { category: true }, orderBy: { createdAt: "desc" } }).catch(() => [])

  return (
    <>
      <CollectionPageJsonLd name="Ressources | Weblancia Academy" description="Accédez à nos ressources gratuites : templates, guides, cheatsheets et outils pour votre apprentissage." url={`${siteConfig.url}/academy/resources`} numberOfItems={resources.length} />
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h1 className="text-h1 mb-4">Ressources</h1>
            <p className="text-body text-text-secondary max-w-2xl mb-8">
              Accédez à nos ressources gratuites : templates, guides, cheatsheets et outils pour accélérer votre apprentissage et vos projets.
            </p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Bibliothèque"
              title="Toutes nos ressources"
              description="Des contenus pratiques et gratuits pour vous accompagner dans votre développement professionnel."
              align="center"
            />
          </AnimatedReveal>
          {resources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resources.map((resource, index) => (
                <AnimatedReveal key={resource.slug} delay={index * 0.08}>
                  <div className="bg-surface border border-border rounded-radius-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg h-full flex flex-col">
                    <Badge variant="category" className="mb-3 self-start">
                      {resource.category?.title ?? resource.type ?? "Ressource"}
                    </Badge>
                    <h3 className="text-lg font-semibold mb-2">{resource.title}</h3>
                    {resource.description && (
                      <p className="text-body-sm text-text-secondary line-clamp-2 mb-4 flex-1">{resource.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-caption text-text-tertiary mb-4">
                      <span className="inline-flex items-center gap-1"><CalendarBlank size={14} />{new Date(resource.createdAt).toLocaleDateString("fr-FR")}</span>
                      {resource.type && (
                        <span className="inline-flex items-center gap-1">{resource.type}</span>
                      )}
                    </div>
                    <Link
                      href={`/academy/resources/${resource.slug}`}
                      className="inline-flex items-center gap-1 text-body-sm font-medium text-accent"
                    >
                      Voir la ressource <ArrowRight size={16} />
                    </Link>
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          ) : (
            <AnimatedReveal>
              <div className="text-center py-16">
                <p className="text-body text-text-secondary">Nos ressources sont en cours de préparation. Revenez bientôt !</p>
              </div>
            </AnimatedReveal>
          )}
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Vous cherchez une ressource spécifique ?"
        subheadline="Contactez-nous et nous vous aiderons à trouver ce qu'il vous faut."
        cta={{ label: "Nous écrire", href: "/contact" }}
        variant="accent"
      />
    </>
  )
}
