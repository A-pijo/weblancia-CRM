import Link from "next/link"
import { Container } from "@/components/shared/container"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import type { SemanticClusters } from "@/lib/semantic/clusters"

interface SemanticLinkSection {
  title: string
  items: { label: string; href: string }[]
}

function buildSections(clusters: SemanticClusters): SemanticLinkSection[] {
  const sections: SemanticLinkSection[] = []

  if (clusters.services.length > 0) {
    sections.push({
      title: "Services associés",
      items: clusters.services.map((s) => ({ label: s.title, href: s.slug })),
    })
  }

  if (clusters.industries.length > 0) {
    sections.push({
      title: "Solutions par secteur",
      items: clusters.industries.map((ind) => ({
        label: `Solutions ${ind.name}`,
        href: `/industrie/${ind.slug}/${ind.serviceSlug}`,
      })),
    })
  }

  if (clusters.cities.length > 0) {
    sections.push({
      title: "Disponible dans votre ville",
      items: clusters.cities.map((c) => ({
        label: `Services à ${c.name}`,
        href: `/ville/${c.slug}/${c.serviceSlug}`,
      })),
    })
  }

  if (clusters.relatedPosts.length > 0) {
    sections.push({
      title: "Articles connexes",
      items: clusters.relatedPosts.map((p) => ({
        label: p.title,
        href: `/insights/${p.slug}`,
      })),
    })
  }

  if (clusters.projects.length > 0) {
    sections.push({
      title: "Réalisations similaires",
      items: clusters.projects.map((p) => ({
        label: p.title,
        href: `/work/${p.slug}`,
      })),
    })
  }

  if (clusters.faq.length > 0) {
    sections.push({
      title: "Questions fréquentes",
      items: clusters.faq.map((f) => ({ label: f.question, href: "/contact#faq" })),
    })
  }

  if (clusters.resources.length > 0) {
    sections.push({
      title: "Ressources complémentaires",
      items: clusters.resources.map((r) => ({
        label: r.title,
        href: `/academy/resources/${r.slug}`,
      })),
    })
  }

  return sections
}

export function SemanticLinks({ clusters }: { clusters: SemanticClusters }) {
  const sections = buildSections(clusters)
  if (sections.length === 0) return null

  return (
    <SectionWrapper bgSecondary>
      <Container>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-h2 font-semibold mb-8">Pour aller plus loin</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {sections.map((section) => (
              <div key={section.title} className="bg-surface border border-border rounded-radius-lg p-5">
                <h3 className="text-sm font-semibold text-accent uppercase tracking-wider mb-3">{section.title}</h3>
                <ul className="flex flex-col gap-2">
                  {section.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className="text-body-sm text-text-primary hover:text-accent transition-colors line-clamp-2"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </SectionWrapper>
  )
}
