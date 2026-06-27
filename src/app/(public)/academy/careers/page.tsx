import { Metadata } from "next"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { siteConfig } from "@/lib/constants/site"
import { getPublishedCourses } from "@/lib/academy/courses/queries"
import { getPublishedCertificates } from "@/lib/academy/certificates/queries"
import { BookOpen, CheckCircle, ArrowRight } from "@/components/icons"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Carrières | Weblancia Academy",
  description: "Accompagnement carrière : coaching, offres d'emploi et conseils pour booster votre parcours dans le digital.",
  alternates: { canonical: `${siteConfig.url}/academy/careers` },
  openGraph: {
    title: "Carrières | Weblancia Academy",
    description: "Accompagnement carrière : coaching, offres d'emploi et conseils pour booster votre parcours dans le digital.",
    url: `${siteConfig.url}/academy/careers`,
  },
}

const services = [
  { title: "Coaching personnalisé", description: "Séances individuelles avec un expert pour définir votre projet professionnel et construire votre plan de carrière." },
  { title: "Préparation aux entretiens", description: "Simulations d'entretiens, conseils CV et portfolio pour maximiser vos chances de décrocher le poste." },
  { title: "Mise en relation", description: "Accès à notre réseau d'entreprises partenaires à la recherche de talents digitaux." },
  { title: "Ateliers carrière", description: "Ateliers collectifs sur la marque personnelle, le networking et les stratégies de recherche d'emploi." },
]

const steps = [
  { step: "01", title: "Évaluation", description: "Analyse de votre profil, compétences et objectifs de carrière." },
  { step: "02", title: "Stratégie", description: "Élaboration d'un plan d'action personnalisé pour atteindre vos objectifs." },
  { step: "03", title: "Accompagnement", description: "Suivi régulier et ajustement de la stratégie en fonction de vos progrès." },
  { step: "04", title: "Placement", description: "Mise en relation avec les entreprises et suivi post-intégration." },
]

export default async function CareersPage() {
  const [courses, certificates] = await Promise.all([
    getPublishedCourses(6).catch(() => []),
    getPublishedCertificates(6).catch(() => []),
  ])

  return (
    <>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h1 className="text-h1 mb-4">Carrières</h1>
            <p className="text-body text-text-secondary max-w-2xl mb-8">
              Accompagnement personnalisé pour booster votre carrière dans le digital. Coaching, mise en relation et ateliers pratiques.
            </p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      {courses.length > 0 && (
        <SectionWrapper bgSecondary>
          <Container>
            <AnimatedReveal>
              <SectionHeader
                label="Formation"
                title="Parcours de formation disponibles"
                description="Développez les compétences recherchées par les recruteurs grâce à nos cours."
                align="center"
              />
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <AnimatedReveal key={course.id} delay={index * 0.08}>
                  <Link href={`/academy/courses/${course.slug}`} className="block h-full group">
                    <div className="bg-surface border border-border rounded-radius-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg h-full">
                      <BookOpen size={24} className="text-accent mb-3" />
                      <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                      {course.shortDescription && (
                        <p className="text-body-sm text-text-secondary mb-4 line-clamp-2">{course.shortDescription}</p>
                      )}
                      <span className="inline-flex items-center gap-1 text-body-sm font-medium text-accent">
                        Voir le cours <ArrowRight size={16} />
                      </span>
                    </div>
                  </Link>
                </AnimatedReveal>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      )}
      {certificates.length > 0 && (
        <SectionWrapper>
          <Container>
            <AnimatedReveal>
              <SectionHeader
                label="Certification"
                title="Certifiez vos compétences"
                description="Valorisez votre parcours avec des certificats reconnus."
                align="center"
              />
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, index) => (
                <AnimatedReveal key={cert.id} delay={index * 0.08}>
                  <div className="bg-surface border border-border rounded-radius-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg h-full">
                    <CheckCircle size={24} className="text-accent mb-3" />
                    <h3 className="text-lg font-semibold mb-2">{cert.title}</h3>
                    {cert.description && (
                      <p className="text-body-sm text-text-secondary mb-4 line-clamp-2">{cert.description}</p>
                    )}
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          </Container>
        </SectionWrapper>
      )}
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Accompagnement"
              title="Nos services carrière"
              description="Des solutions sur mesure pour vous aider à atteindre vos objectifs professionnels dans le digital."
              align="center"
            />
          </AnimatedReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <AnimatedReveal key={service.title} delay={index * 0.08}>
                <div className="bg-surface border border-border rounded-radius-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg">
                  <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                  <p className="text-body-sm text-text-secondary">{service.description}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Processus"
              title="Comment ça marche"
              description="Un accompagnement structuré en 4 étapes pour booster votre carrière."
              align="center"
            />
          </AnimatedReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <AnimatedReveal key={step.step} delay={index * 0.08}>
                <div className="text-center">
                  <div className="w-14 h-14 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-accent">{step.step}</span>
                  </div>
                  <h3 className="text-body font-semibold mb-2">{step.title}</h3>
                  <p className="text-body-sm text-text-secondary">{step.description}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Prêt à faire évoluer votre carrière ?"
        subheadline="Contactez-nous pour un premier rendez-vous gratuit d'orientation."
        cta={{ label: "Prendre rendez-vous", href: "/contact" }}
        variant="accent"
      />
    </>
  )
}
