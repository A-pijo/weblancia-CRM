import { Metadata } from "next"
import Link from "next/link"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { siteConfig } from "@/lib/constants/site"
import { authors } from "@/lib/data/authors"
import { WebPageJsonLd } from "@/components/shared/json-ld"

export const metadata: Metadata = {
  title: "Nos Auteurs | Weblancia",
  description: "Découvrez les auteurs qui partagent leur expertise en développement web, marketing digital, design et SEO sur le blog Weblancia.",
  keywords: ["Weblancia", "auteurs", "blog", "experts", "digital"],
  alternates: { canonical: `${siteConfig.url}/author` },
  openGraph: { title: "Nos Auteurs | Weblancia", description: "Découvrez les auteurs du blog Weblancia.", url: `${siteConfig.url}/author`, siteName: "Weblancia", locale: "fr_FR", alternateLocale: ["en_US", "ar_SA"], images: [{ url: "/images/og/og.svg", width: 1200, height: 630 }] },
  twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: "Nos Auteurs | Weblancia", description: "Les experts qui écrivent sur le blog Weblancia.", images: ["/images/og/og.svg"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
}

export default function AuthorsPage() {
  return (
    <>
      <WebPageJsonLd name="Nos Auteurs | Weblancia" description="Découvrez les auteurs du blog Weblancia" url={`${siteConfig.url}/author`} />
      <SectionWrapper>
        <Container>
          <AnimatedReveal>
            <h1 className="text-h1 mb-4">Nos Auteurs</h1>
            <p className="text-body text-text-secondary max-w-2xl mb-8">
              Nos articles sont rédigés par des experts passionnés, spécialistes dans leur domaine.
            </p>
          </AnimatedReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.filter((a) => a.name !== "Weblancia").map((author, index) => (
              <AnimatedReveal key={author.slug} delay={index * 0.08}>
                <Link href={`/author/${author.slug}`} className="block bg-surface border border-border rounded-radius-lg p-6 hover:border-accent transition-colors h-full">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 rounded-full bg-accent-light flex items-center justify-center">
                      <span className="text-lg font-semibold text-accent">{author.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</span>
                    </div>
                    <div>
                      <h2 className="text-body font-semibold">{author.name}</h2>
                      <p className="text-caption text-text-secondary">{author.jobTitle}</p>
                    </div>
                  </div>
                  <p className="text-body-sm text-text-tertiary line-clamp-3">{author.shortBio}</p>
                </Link>
              </AnimatedReveal>
            ))}
          </div>
        </Container>
      </SectionWrapper>
    </>
  )
}
