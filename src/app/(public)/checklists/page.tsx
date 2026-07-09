import { Metadata } from "next"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { siteConfig } from "@/lib/constants/site"
import { WebPageJsonLd } from "@/components/shared/json-ld"

const checklists = [
  { title: "Checklist SEO : 50 points à vérifier", description: "Auditez votre site web avec notre checklist SEO complète : technique, contenu, netlinking et SEO local.", href: "/services/seo" },
  { title: "Checklist création de site web", description: "Les 30 étapes essentielles pour lancer votre site web avec succès.", href: "/services/web-development" },
  { title: "Checklist campagne Google Ads", description: "Optimisez vos campagnes Google Ads avec notre checklist de 25 points.", href: "/services/digital-marketing" },
  { title: "Checklist branding : construire votre marque", description: "Les 20 étapes pour créer une identité de marque forte et cohérente.", href: "/services/branding-design" },
  { title: "Checklist refonte de site web", description: "Ne rien oublier lors de la refonte de votre site web avec notre checklist complète.", href: "/consultation/refonte-site" },
  { title: "Checklist lancement e-commerce", description: "Les 40 points à vérifier avant de lancer votre boutique en ligne.", href: "/plateforme/shopify/web-development" },
]

export const metadata: Metadata = {
  title: "Checklists | Weblancia",
  description: "Nos checklists pratiques pour auditer, planifier et optimiser votre présence digitale : SEO, web, marketing, branding et e-commerce.",
  alternates: { canonical: `${siteConfig.url}/checklists` },
  openGraph: { title: "Checklists | Weblancia", description: "Nos checklists pratiques pour votre transformation digitale.", url: `${siteConfig.url}/checklists`, siteName: "Weblancia", locale: "fr_FR" },
  robots: { index: true, follow: true },
}

export default function ChecklistsPage() {
  return (
    <>
      <WebPageJsonLd name="Checklists | Weblancia" description="Nos checklists pratiques pour auditer, planifier et optimiser votre présence digitale." url={`${siteConfig.url}/checklists`} />
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Checklists" }]} />
          <AnimatedReveal>
            <div className="mt-4 mb-8">
              <h1 className="text-display mb-4">Checklists</h1>
              <p className="text-body-lg text-text-secondary max-w-2xl mb-6">
                Des checklists pratiques pour ne rien oublier dans vos projets digitaux. Utilisez-les comme base pour vos audits et lancements.
              </p>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>

      <SectionWrapper bgSecondary>
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {checklists.map((item, i) => (
              <AnimatedReveal key={i} delay={i * 0.05}>
                <Link href={item.href} className="block bg-surface border border-border rounded-radius-lg p-6 hover:border-accent transition-colors h-full">
                  <h3 className="text-h3 mb-2">{item.title}</h3>
                  <p className="text-body-sm text-text-secondary">{item.description}</p>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
