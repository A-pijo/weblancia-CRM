import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, BookOpen, Monitor, CalendarBlank, ArrowRight } from "@/components/icons"
import { CourseJsonLd } from "@/components/shared/json-ld"
import { prisma } from "@/lib/database/prisma"
import { siteConfig } from "@/lib/constants/site"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const course = await prisma.course.findUnique({ where: { slug }, include: { category: true } }).catch(() => null)
  if (!course) return { title: "Cours non trouvé | Weblancia Academy" }
  return {
    title: `${course.title} | Weblancia Academy`,
    description: course.shortDescription ?? undefined,
    keywords: `Weblancia, ${course.title}, cours, formation, ${course.category?.title ?? "digital"}, academy, Casablanca`,
    alternates: { canonical: `${siteConfig.url}/academy/courses/${course.slug}` },
    openGraph: {
      title: course.title,
      description: course.shortDescription ?? undefined,
      url: `${siteConfig.url}/academy/courses/${course.slug}`,
      siteName: "Weblancia",
      locale: "fr_FR",
      alternateLocale: ["en_US", "ar_SA"],
      images: course.thumbnail ? [{ url: course.thumbnail, width: 1200, height: 630 }] : [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@weblancia",
      creator: "@weblancia",
      title: course.title,
      description: course.shortDescription ?? undefined,
      images: course.thumbnail ? [course.thumbnail] : ["/images/og/og.svg"],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  }
}

const levelColors: Record<string, "success" | "warning" | "danger"> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
}

export const revalidate = 3600

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params
  const course = await prisma.course.findUnique({ where: { slug }, include: { category: true } }).catch(() => null)
  if (!course) notFound()

  const curriculumLen = Array.isArray(course.curriculum) ? (course.curriculum as unknown[]).length : 0
  const outcomesLen = Array.isArray(course.learningOutcomes) ? (course.learningOutcomes as unknown[]).length : 0
  const priceDisplay = course.price == null ? "Gratuit" : `${Number(course.price as unknown as number).toFixed(2)} €`
  const level = course.level ?? "Beginner"

  return (
    <SectionWrapper>
      <Container>
        <CourseJsonLd name={course.title} description={course.shortDescription ?? ""} provider={course.instructor ?? "Weblancia"} url={`${siteConfig.url}/academy/courses/${course.slug}`} image={course.thumbnail ? `${siteConfig.url}${course.thumbnail}` : undefined} duration={course.duration ?? undefined} price={course.price ? Number(course.price) : undefined} currency="EUR" />
        <AnimatedReveal>
          <Link href="/academy/courses" className="text-body-sm text-accent hover:text-accent-hover mb-4 inline-flex items-center gap-1">
            <ArrowRight size={16} className="rotate-180" /> Tous les cours
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {level && <Badge variant={levelColors[level] ?? "success"}>{level}</Badge>}
                {course.category && (
                  <Badge variant="outline">{course.category.title}</Badge>
                )}
              </div>
              <h1 className="text-display mb-4">{course.title}</h1>
              {course.shortDescription && (
                <p className="text-body-lg text-text-secondary mb-6">{course.shortDescription}</p>
              )}
              <div className="flex flex-col gap-3 mb-8">
                <div className="flex items-center gap-3 text-body-sm text-text-secondary">
                  <BookOpen size={20} /> <span>{curriculumLen} leçons</span>
                </div>
                <div className="flex items-center gap-3 text-body-sm text-text-secondary">
                  <Monitor size={20} /> <span>{outcomesLen} projets pratiques</span>
                </div>
                {course.duration && (
                  <div className="flex items-center gap-3 text-body-sm text-text-secondary">
                    <Clock size={20} /> <span>{course.duration}</span>
                  </div>
                )}
                {course.instructor && (
                  <div className="flex items-center gap-3 text-body-sm text-text-secondary">
                    <CalendarBlank size={20} /> <span>Instructeur : {course.instructor}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p className="text-h3 font-semibold text-accent">{priceDisplay}</p>
                <Button size="lg">S&apos;inscrire au cours</Button>
              </div>
            </div>
            <div className="relative aspect-[4/3] rounded-radius-xl overflow-hidden bg-bg-secondary">
              {course.thumbnail && (
                <Image src={course.thumbnail} alt={course.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" priority />
              )}
            </div>
          </div>
        </AnimatedReveal>
      </Container>
    </SectionWrapper>
  )
}
