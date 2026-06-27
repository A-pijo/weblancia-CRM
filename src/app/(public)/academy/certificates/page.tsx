import { Metadata } from "next"
import Image from "next/image"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { siteConfig } from "@/lib/constants/site"
import { getPublishedCertificates } from "@/lib/academy/certificates/queries"
import { getAcademyCategories } from "@/lib/academy/categories/queries"
import { CheckCircle, Clock } from "@/components/icons"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Certificats | Weblancia Academy",
  description: "Obtenez vos certificats de formation Weblancia Academy et valorisez vos compétences digitales.",
  alternates: { canonical: `${siteConfig.url}/academy/certificates` },
  openGraph: {
    title: "Certificats | Weblancia Academy",
    description: "Obtenez vos certificats de formation Weblancia Academy et valorisez vos compétences digitales.",
    url: `${siteConfig.url}/academy/certificates`,
  },
}

const certSteps = [
  { step: "1", title: "Suivez un cours", description: "Terminez l'intégralité d'un de nos programmes de formation." },
  { step: "2", title: "Validez les acquis", description: "Réussissez l'évaluation finale ou le projet pratique." },
  { step: "3", title: "Recevez votre certificat", description: "Téléchargez votre certificat nominatif signé par votre formateur." },
  { step: "4", title: "Valorisez votre parcours", description: "Ajoutez votre certificat à votre profil LinkedIn et CV." },
]

const benefits = [
  { title: "Crédibilité professionnelle", description: "Prouvez votre expertise avec un certificat officiel Weblancia." },
  { title: "Avantage concurrentiel", description: "Démarquez-vous auprès des recruteurs et clients potentiels." },
  { title: "Validation des compétences", description: "Attestez de vos capacités réelles acquises durant la formation." },
]

const levelColors: Record<string, string> = {
  Beginner: "success",
  Intermediate: "warning",
  Advanced: "danger",
}

export default async function CertificatesPage() {
  const certificates = await getPublishedCertificates().catch(() => [])

  return (
    <>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h1 className="text-h1 mb-4">Certificats</h1>
            <p className="text-body text-text-secondary max-w-2xl mb-8">
              Obtenez des certificats de formation reconnus pour valoriser vos compétences digitales auprès des recruteurs et de vos clients.
            </p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Parcours certifiant"
              title="Comment obtenir votre certificat"
              description="Un processus simple et transparent pour valider et certifier vos compétences."
              align="center"
            />
          </AnimatedReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {certSteps.map((step, index) => (
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
      {certificates.length > 0 && (
        <SectionWrapper>
          <Container>
            <AnimatedReveal>
              <SectionHeader
                label="Certificats disponibles"
                title="Nos certifications"
                description="Choisissez le certificat qui correspond à votre parcours."
                align="center"
              />
            </AnimatedReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.map((cert, index) => (
                <AnimatedReveal key={cert.id} delay={index * 0.08}>
                  <div className="bg-surface border border-border rounded-radius-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg h-full flex flex-col">
                    {cert.badge && (
                      <div className="relative w-16 h-16 mb-4 mx-auto">
                        <Image src={cert.badge} alt={cert.title} fill className="object-contain" sizes="64px" />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2 text-center">{cert.title}</h3>
                    {cert.description && (
                      <p className="text-body-sm text-text-secondary mb-4 text-center flex-1">{cert.description}</p>
                    )}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                      {cert.level && (
                        <Badge variant={(levelColors[cert.level] ?? "outline") as "success" | "warning" | "danger" | "outline"}>
                          {cert.level}
                        </Badge>
                      )}
                      {cert.duration && (
                        <span className="inline-flex items-center gap-1 text-caption text-text-tertiary">
                          <Clock size={14} /> {cert.duration}
                        </span>
                      )}
                    </div>
                    {cert.requirements && Array.isArray(cert.requirements) && (cert.requirements as unknown[]).length > 0 && (
                      <div className="pt-4 border-t border-border mt-auto">
                        <p className="text-caption font-medium mb-2">Prérequis :</p>
                        <ul className="text-caption text-text-secondary space-y-1">
                          {(cert.requirements as { label?: string }[]).map((req, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <CheckCircle size={12} className="text-accent mt-0.5 shrink-0" />
                              <span>{req?.label ?? `Prérequis ${i + 1}`}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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
              label="Avantages"
              title="Pourquoi obtenir un certificat ?"
              align="center"
            />
          </AnimatedReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((item, index) => (
              <AnimatedReveal key={item.title} delay={index * 0.08}>
                <div className="bg-surface border border-border rounded-radius-lg p-6 text-center">
                  <CheckCircle size={24} className="text-accent mx-auto mb-3" />
                  <h3 className="text-body font-semibold mb-2">{item.title}</h3>
                  <p className="text-body-sm text-text-secondary">{item.description}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Prêt à obtenir votre certificat ?"
        subheadline="Commencez par suivre l'un de nos cours et obtenez votre certificat à la clé."
        cta={{ label: "Voir les cours", href: "/academy/courses" }}
        variant="accent"
      />
    </>
  )
}
