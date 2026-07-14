import { Metadata } from "next"
import Link from "next/link"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { siteConfig } from "@/lib/constants/site"
import { prisma } from "@/lib/database/prisma"
import { ArrowRight, Clock, CalendarBlank, Monitor } from "@/components/icons"
import { CollectionPageJsonLd } from "@/components/shared/json-ld"

export const metadata: Metadata = {
  title: "Academy | Weblancia",
  description: "Formez-vous aux métiers du digital avec Weblancia Academy : cours, ateliers, ressources et certifications.",
  keywords: ["Weblancia", "academy", "formation", "cours en ligne", "ateliers", "certification", "compétences digitales", "Casablanca"],
  alternates: { canonical: `${siteConfig.url}/academy` },
  openGraph: {
    title: "Academy | Weblancia",
    description: "Formez-vous aux métiers du digital avec Weblancia Academy : cours, ateliers, ressources et certifications.",
    url: `${siteConfig.url}/academy`,
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    type: "website",
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@weblancia",
    creator: "@weblancia",
    title: "Academy | Weblancia",
    description: "Formez-vous aux métiers du digital avec Weblancia Academy : cours, ateliers, ressources et certifications.",
    images: ["/images/og/og.svg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

export const revalidate = 3600

export default async function AcademyPage() {
  const [courses, categories, workshops] = await Promise.all([
    prisma.course.findMany({ where: { isPublished: true }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 4 }).catch(() => []),
    prisma.academyCategory.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
    prisma.workshop.findMany({ where: { isPublished: true }, include: { category: true }, orderBy: { date: "asc" }, take: 3 }).catch(() => []),
  ])

  return (
    <>
      <CollectionPageJsonLd name="Academy | Weblancia" description="Formez-vous aux métiers du digital avec Weblancia Academy" url={`${siteConfig.url}/academy`} numberOfItems={courses.length + workshops.length} />
      <HeroDefault
        headline="Academy"
        subheadline="Formez-vous aux competences digitales les plus recherchees. Cours, ateliers pratiques et ressources pour accelerer votre carriere."
        primaryCta={{ label: "Explorer les cours", href: "/academy/courses" }}
        secondaryCta={{ label: "Voir les ateliers", href: "/academy/workshops" }}
        align="left"
      />
      {categories.length > 0 && (
        <SectionWrapper>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h2 mb-8">Domaines de formation</h2>
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat, index) => (
                <AnimatedReveal key={cat.id} delay={index * 0.08}>
                  <div className="bg-surface border border-border rounded-radius-lg p-6 hover:border-accent transition-colors duration-300">
                    <h3 className="text-xl font-semibold mb-2">{cat.title}</h3>
                    {cat.description && (
                      <p className="text-body-sm text-text-secondary">{cat.description}</p>
                    )}
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      )}
      {courses.length > 0 && (
        <SectionWrapper bgSecondary>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h2 mb-8">Cours à la une</h2>
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <AnimatedReveal key={course.id} delay={index * 0.08}>
                  <Link href={`/academy/courses/${course.slug}`} className="block h-full group">
                    <div className="bg-surface border border-border rounded-radius-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg h-full">
                      <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                      {course.shortDescription && (
                        <p className="text-body-sm text-text-secondary mb-4">{course.shortDescription}</p>
                      )}
                      <div className="flex items-center gap-4 text-caption text-text-tertiary">
                        {course.duration && (
                          <span className="inline-flex items-center gap-1"><Clock size={14} />{course.duration}</span>
                        )}
                        {course.instructor && (
                          <span className="inline-flex items-center gap-1">{course.instructor}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </AnimatedReveal>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      )}
      {workshops.length > 0 && (
        <SectionWrapper>
          <Container>
            <AnimatedReveal>
              <h2 className="text-h2 mb-8">Ateliers à venir</h2>
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workshops.map((workshop, index) => (
                <AnimatedReveal key={workshop.id} delay={index * 0.08}>
                  <div className="bg-surface border border-border rounded-radius-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
                    <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
                    {workshop.description && (
                      <p className="text-body-sm text-text-secondary mb-4">{workshop.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-caption text-text-tertiary mb-4">
                      {workshop.date && (
                        <span className="inline-flex items-center gap-1"><CalendarBlank size={14} />{new Date(workshop.date).toLocaleDateString("fr-FR")}</span>
                      )}
                      {workshop.duration && (
                        <span className="inline-flex items-center gap-1"><Clock size={14} />{workshop.duration}</span>
                      )}
                      {workshop.type && (
                        <span className="inline-flex items-center gap-1"><Monitor size={14} />{workshop.type}</span>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-1 text-body-sm font-medium text-accent">
                      S'inscrire <ArrowRight size={16} />
                    </span>
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      )}
      <CTABanner
        headline="Pret a passer a l'action ?"
        subheadline="Rejoignez nos programmes de formation et developpez vos competences."
        cta={{ label: "Commencer maintenant", href: "/academy/courses" }}
        variant="accent"
      />
    </>
  )
}
