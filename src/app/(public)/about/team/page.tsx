import type { Metadata } from "next"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { TeamCard } from "@/components/cards/team-card"
import type { TeamMember } from "@/types/team"
import { siteConfig } from "@/lib/constants/site"
import { getActiveTeamMembers } from "@/lib/team/queries"

export const metadata: Metadata = {
  title: "Notre Équipe | Weblancia",
  description: "Rencontrez l'équipe de Weblancia : des experts passionnés par le digital et l'innovation.",
  alternates: { canonical: `${siteConfig.url}/about/team` },
  openGraph: {
    title: "Notre Équipe | Weblancia",
    description: "Rencontrez l'équipe de Weblancia : des experts passionnés par le digital et l'innovation.",
    url: `${siteConfig.url}/about/team`,
  },
}

const values = [
  { title: "Excellence", description: "Nous visons la qualité maximale dans chaque projet, de la conception à la livraison." },
  { title: "Innovation", description: "Nous explorons constamment les nouvelles technologies pour offrir des solutions avant-gardistes." },
  { title: "Transparence", description: "Communication claire et honnête avec nos clients à chaque étape du projet." },
  { title: "Engagement", description: "Nous nous impliquons pleinement dans la réussite de chaque projet comme s'il était le nôtre." },
]

export default async function TeamPage() {
  const teamMembers: TeamMember[] = await getActiveTeamMembers()

  return (
    <>
      <HeroDefault
        headline="Notre Équipe"
        subheadline="Des experts passionnés par le digital et l'innovation, mobilisés pour votre réussite."
        align="left"
      />
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Qui sommes-nous"
              title="Une équipe d'experts passionnés"
              description="Chez Weblancia, chaque membre de notre équipe apporte son expertise unique pour transformer vos idées en solutions digitales performantes."
              align="center"
            />
          </AnimatedReveal>
          {teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {teamMembers.map((member, index) => (
                <AnimatedReveal key={member.name} delay={index * 0.08}>
                  <div id={`member-${member.id}`}>
                    <TeamCard member={member} />
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          ) : (
            <AnimatedReveal>
              <div className="text-center py-16">
                <p className="text-body text-text-secondary">Les profils détaillés de notre équipe sont en cours de préparation.</p>
              </div>
            </AnimatedReveal>
          )}
        </Container>
      </SectionWrapper>
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Nos valeurs"
              title="Ce qui nous anime"
              description="Des principes forts qui guident chacune de nos actions et décisions."
              align="center"
            />
          </AnimatedReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <AnimatedReveal key={value.title} delay={index * 0.08}>
                <div className="bg-surface border border-border rounded-radius-lg p-6 text-center h-full">
                  <h3 className="text-body font-semibold mb-2">{value.title}</h3>
                  <p className="text-body-sm text-text-secondary">{value.description}</p>
                </div>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Vous aussi, rejoignez l'aventure"
        subheadline="Nous recrutons des talents passionnés par le digital."
        cta={{ label: "Voir les offres", href: "/about/careers" }}
        variant="accent"
      />
    </>
  )
}
