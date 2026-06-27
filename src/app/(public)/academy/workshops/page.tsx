import { Metadata } from "next"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { siteConfig } from "@/lib/constants/site"
import { getPublishedWorkshops } from "@/lib/academy/workshops/queries"
import { getAcademyCategories } from "@/lib/academy/categories/queries"
import { ArrowRight, Clock, Monitor, CalendarBlank, User } from "@/components/icons"

export const metadata: Metadata = {
  title: "Ateliers | Weblancia Academy",
  description: "Participez à nos ateliers pratiques pour développer vos compétences digitales en temps réel.",
  alternates: { canonical: `${siteConfig.url}/academy/workshops` },
  openGraph: {
    title: "Ateliers | Weblancia Academy",
    description: "Participez à nos ateliers pratiques pour développer vos compétences digitales en temps réel.",
    url: `${siteConfig.url}/academy/workshops`,
  },
}

function formatPrice(price: unknown): string {
  if (price == null) return "Gratuit"
  return `${Number(price as unknown as number).toFixed(2)} €`
}

export default async function WorkshopsPage() {
  const workshops = await getPublishedWorkshops().catch(() => [])

  return (
    <>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h1 className="text-h1 mb-4">Ateliers</h1>
            <p className="text-body text-text-secondary max-w-2xl mb-8">
              Des ateliers pratiques et interactifs pour apprendre en faisant. Nos formateurs vous accompagnent pas à pas dans la réalisation de projets concrets.
            </p>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Programme"
              title="Ateliers à venir"
              description="Inscrivez-vous aux ateliers qui vous intéressent. Places limitées pour garantir un accompagnement de qualité."
              align="center"
            />
          </AnimatedReveal>
          {workshops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {workshops.map((workshop, index) => (
                <AnimatedReveal key={workshop.id} delay={index * 0.08}>
                  <div className="bg-surface border border-border rounded-radius-lg p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg h-full flex flex-col">
                    <h3 className="text-xl font-semibold mb-2">{workshop.title}</h3>
                    {workshop.description && (
                      <p className="text-body-sm text-text-secondary mb-4 flex-1 line-clamp-2">{workshop.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-caption text-text-tertiary mb-4">
                      {workshop.date && (
                        <span className="inline-flex items-center gap-1"><CalendarBlank size={14} /> {new Date(workshop.date).toLocaleDateString("fr-FR")}</span>
                      )}
                      {workshop.time && (
                        <span className="inline-flex items-center gap-1"><Clock size={14} /> {workshop.time}</span>
                      )}
                      {workshop.duration && (
                        <span className="inline-flex items-center gap-1"><Clock size={14} /> {workshop.duration}</span>
                      )}
                      {workshop.type && (
                        <span className="inline-flex items-center gap-1"><Monitor size={14} /> {workshop.type}</span>
                      )}
                      {workshop.instructor && (
                        <span className="inline-flex items-center gap-1"><User size={14} /> {workshop.instructor}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                      <span className="text-body-sm font-semibold text-accent">{formatPrice(workshop.price)}</span>
                      <span className="inline-flex items-center gap-1 text-body-sm font-medium text-accent">
                        S'inscrire <ArrowRight size={16} />
                      </span>
                    </div>
                    {workshop.seats !== null && workshop.seats !== undefined && (
                      <div className="mt-2 text-caption text-text-tertiary">
                        {workshop.seats > 0 ? (
                          <span>{workshop.seats} places restantes</span>
                        ) : (
                          <span className="text-[var(--color-danger)]">Complet</span>
                        )}
                      </div>
                    )}
                    {workshop.status && (
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-accent-light px-2.5 py-0.5 text-caption font-medium text-accent">
                          {workshop.status}
                        </span>
                      </div>
                    )}
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          ) : (
            <AnimatedReveal>
              <div className="text-center py-16">
                <p className="text-body text-text-secondary">Aucun atelier programmé pour le moment. Revenez bientôt !</p>
              </div>
            </AnimatedReveal>
          )}
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Envie d'organiser un atelier sur mesure ?"
        subheadline="Nous pouvons concevoir un atelier adapté aux besoins de votre équipe."
        cta={{ label: "Nous contacter", href: "/contact" }}
        variant="accent"
      />
    </>
  )
}
