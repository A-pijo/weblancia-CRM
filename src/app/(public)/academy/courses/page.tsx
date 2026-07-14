import { Metadata } from "next"
import Link from "next/link"
import { CollectionPageJsonLd } from "@/components/shared/json-ld"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { CourseCard } from "@/components/cards/course-card"
import { siteConfig } from "@/lib/constants/site"
import { prisma } from "@/lib/database/prisma"
import type { Course } from "@/types/course"

export const metadata: Metadata = {
  title: "Cours | Weblancia Academy",
  description: "Explorez nos cours en ligne pour maîtriser le développement web, le marketing digital, le design et plus.",
  keywords: ["Weblancia", "academy", "cours", "formation", "développement web", "marketing digital", "Casablanca"],
  alternates: { canonical: `${siteConfig.url}/academy/courses` },
  openGraph: {
    title: "Cours | Weblancia Academy",
    description: "Explorez nos cours en ligne pour maîtriser le développement web, le marketing digital, le design et plus.",
    url: `${siteConfig.url}/academy/courses`,
    siteName: "Weblancia",
    locale: "fr_FR",
    alternateLocale: ["en_US", "ar_SA"],
    images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Cours | Weblancia Academy", description: "Explorez nos cours en ligne pour maîtriser le développement web, le marketing digital, le design et plus.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

function mapCourseToCard(course: Awaited<ReturnType<typeof prisma.course.findMany>>[number] & { category?: { title: string } | null }): Course {
  const curriculumLen = Array.isArray(course.curriculum) ? (course.curriculum as unknown[]).length : 0
  const outcomesLen = Array.isArray(course.learningOutcomes) ? (course.learningOutcomes as unknown[]).length : 0
  return {
    slug: course.slug,
    title: course.title,
    description: course.shortDescription ?? "",
    instructor: course.instructor ?? "Weblancia",
    duration: course.duration ?? "À déterminer",
    level: (course.level as Course["level"]) ?? "Beginner",
    format: course.category?.title ?? "En ligne",
    price: course.price == null ? "Gratuit" : `${Number(course.price as unknown as number).toFixed(2)} €`,
    image: course.thumbnail ?? undefined,
    lessons: curriculumLen,
    projects: outcomesLen,
  }
}

export const revalidate = 3600

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    prisma.course.findMany({ where: { isPublished: true }, include: { category: true }, orderBy: { createdAt: "desc" } }).catch(() => []),
    prisma.academyCategory.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
  ])

  const mapped = courses.map(mapCourseToCard)

  return (
    <>
      <CollectionPageJsonLd name="Cours | Weblancia Academy" description="Explorez nos cours en ligne pour maîtriser le développement web, le marketing digital, le design et plus." url={`${siteConfig.url}/academy/courses`} numberOfItems={mapped.length} />
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h1 className="text-h1 mb-4">Cours</h1>
            <p className="text-body text-text-secondary max-w-2xl mb-8">
              Explorez notre catalogue de cours en ligne pour maîtriser les compétences digitales les plus recherchées.
            </p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Catalogue"
              title="Nos formations"
              description="Des cours complets conçus par des experts pour vous former aux métiers du digital."
              align="center"
            />
          </AnimatedReveal>
          {mapped.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mapped.map((course, index) => (
                <AnimatedReveal key={course.slug} delay={index * 0.08}>
                  <Link href={`/academy/courses/${course.slug}`} className="block h-full group">
                    <CourseCard course={course} />
                  </Link>
                </AnimatedReveal>
              ))}
            </div>
          ) : (
            <AnimatedReveal>
              <div className="text-center py-16">
                <p className="text-body text-text-secondary">Nos cours sont en cours de préparation. Revenez bientôt !</p>
              </div>
            </AnimatedReveal>
          )}
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Prêt à apprendre ?"
        subheadline="Rejoignez nos programmes de formation et développez vos compétences digitales."
        cta={{ label: "Voir tous les cours", href: "/academy/courses" }}
        variant="accent"
      />
    </>
  )
}
