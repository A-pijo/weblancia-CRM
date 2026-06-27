import { Metadata } from "next"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { siteConfig } from "@/lib/constants/site"
import { ArrowRight, MapPin, Clock, CheckCircle } from "@/components/icons"

export const metadata: Metadata = {
  title: "Carrières | Weblancia",
  description: "Rejoignez l'équipe Weblancia et participez à des projets digitaux innovants.",
  alternates: { canonical: `${siteConfig.url}/about/careers` },
  openGraph: {
    title: "Carrières | Weblancia",
    description: "Rejoignez l'équipe Weblancia et participez à des projets digitaux innovants.",
    url: `${siteConfig.url}/about/careers`,
  },
}

const positions = [
  { title: "Développeur Full-Stack", type: "CDI", location: "Casablanca", description: "Vous développez des applications web modernes avec React, Next.js et Laravel." },
  { title: "Designer UI/UX", type: "CDI", location: "Casablanca", description: "Vous créez des expériences utilisateur exceptionnelles et des interfaces élégantes." },
  { title: "Chef de Projet Digital", type: "CDI", location: "Casablanca", description: "Vous pilotez des projets digitaux de A à Z et assurez la satisfaction client." },
  { title: "Spécialiste SEO", type: "Freelance", location: "Remote", description: "Vous optimisez la visibilité de nos clients sur les moteurs de recherche." },
]

const perks = [
  "Environnement de travail moderne et collaboratif",
  "Projets variés et stimulants avec des clients prestigieux",
  "Formation continue et développement des compétences",
  "Flexibilité et équilibre vie professionnelle / personnelle",
  "Évolution de carrière basée sur la performance",
  "Événements d'équipe et afterworks réguliers",
]

export default function AboutCareersPage() {
  return (
    <>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h1 className="text-h1 mb-4">Carrières</h1>
            <p className="text-body text-text-secondary max-w-2xl mb-8">
              Rejoignez une équipe passionnée et participez à des projets digitaux innovants. 
              Nous recrutons des talents qui partagent notre vision d&apos;un digital d&apos;exception.
            </p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Nos offres"
              title="Postes à pourvoir"
              description="Nous sommes toujours à la recherche de talents exceptionnels. Voici nos offres actuelles."
              align="center"
            />
          </AnimatedReveal>
          <div className="space-y-4 max-w-3xl mx-auto">
            {positions.map((position, index) => (
              <AnimatedReveal key={position.title} delay={index * 0.08}>
                <div className="bg-surface border border-border rounded-radius-lg p-6 transition-all duration-300 hover:border-accent hover:shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-caption text-text-tertiary">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={14} /> {position.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={14} /> {position.type}
                        </span>
                      </div>
                      <p className="text-body-sm text-text-secondary mt-3">{position.description}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-body-sm font-medium text-accent shrink-0 whitespace-nowrap">
                      Postuler <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </AnimatedReveal>
            ))}
          </div>
          <AnimatedReveal delay={0.4}>
            <div className="text-center mt-8 bg-surface border border-dashed border-border rounded-radius-lg p-8 max-w-3xl mx-auto">
              <p className="text-body text-text-secondary mb-2">Vous ne trouvez pas votre poste ?</p>
              <p className="text-body-sm text-text-tertiary mb-4">Candidature spontanée toujours bienvenue.</p>
              <Link
                href="mailto:careers@weblancia.ma"
                className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium"
              >
                careers@weblancia.ma <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Pourquoi nous rejoindre"
              title="Ce que nous offrons"
              description="Au-delà d'un poste, nous proposons une expérience professionnelle enrichissante."
              align="center"
            />
          </AnimatedReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => (
              <AnimatedReveal key={perk} delay={index * 0.08}>
                <div className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-accent shrink-0 mt-0.5" />
                  <span className="text-body-sm text-text-secondary">{perk}</span>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Envie de nous rejoindre ?"
        subheadline="Envoyez-nous votre CV et lettre de motivation à careers@weblancia.ma"
        cta={{ label: "Postuler maintenant", href: "mailto:careers@weblancia.ma" }}
        variant="accent"
      />
    </>
  )
}
