import { Metadata } from "next"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { SearchPageClient } from "./search-page-client"
import { siteConfig } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Recherche | Weblancia",
  description: "Recherchez des projets, services, articles et formations sur Weblancia.",
  alternates: { canonical: `${siteConfig.url}/search` },
  openGraph: {
    title: "Recherche | Weblancia",
    description: "Recherchez des projets, services, articles et formations sur Weblancia.",
    url: `${siteConfig.url}/search`,
  },
}

export default function SearchPage() {
  return (
    <SectionWrapper>
      <Container>
        <AnimatedReveal>
          <h1 className="text-h1 mb-4">Recherche</h1>
          <p className="text-body text-text-secondary max-w-2xl mb-8">
            Trouvez rapidement des projets, services, articles et formations parmi notre contenu.
          </p>
        </AnimatedReveal>
        <SearchPageClient />
      </Container>
    </SectionWrapper>
  )
}
