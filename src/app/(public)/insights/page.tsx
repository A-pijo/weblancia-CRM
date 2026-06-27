import { Metadata } from "next"
import Link from "next/link"
import { HeroDefault } from "@/components/sections/hero/hero-default"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CTABanner } from "@/components/sections/cta-banner"
import { SectionHeader } from "@/components/shared/section-header"
import { BlogCard } from "@/components/cards/blog-card"
import { getPublishedPosts, getBlogCategories } from "@/lib/blog/queries"
import { siteConfig } from "@/lib/constants/site"
import type { Insight } from "@/types/insight"

export const metadata: Metadata = {
  title: "Insights | Weblancia",
  description: "Articles, analyses et tendances du digital : développement web, marketing, design et innovation.",
  alternates: { canonical: `${siteConfig.url}/insights` },
  openGraph: {
    title: "Insights | Weblancia",
    description: "Articles, analyses et tendances du digital : développement web, marketing, design et innovation.",
    url: `${siteConfig.url}/insights`,
  },
}

export default async function InsightsPage() {
  const [dbPosts, categories] = await Promise.all([
    getPublishedPosts(50).catch(() => []),
    getBlogCategories().catch(() => []),
  ])

  const articles: Insight[] = dbPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.excerpt ?? "",
    category: p.category.title,
    author: p.author ?? "Weblancia",
    date: p.publishedAt?.toISOString().split("T")[0] ?? "",
    readTime: p.readingTime ? `${p.readingTime} min` : "5 min",
    image: p.featuredImage ?? undefined,
    content: p.content ?? undefined,
    tags: (p.tags as string[]) ?? [],
    featured: p.isFeatured,
  }))

  return (
    <>
      <HeroDefault
        headline="Insights"
        subheadline="Articles, analyses et tendances pour rester à la pointe du digital."
        primaryCta={{ label: "Voir les articles", href: "#articles" }}
        align="left"
      />
      <SectionWrapper bgSecondary id="articles">
        <Container>
          <AnimatedReveal>
            <SectionHeader
              label="Blog"
              title="Articles récents"
              description="Découvrez nos derniers articles sur le développement web, le marketing digital, le design et l'innovation."
              align="center"
            />
          </AnimatedReveal>
          {articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                  <AnimatedReveal key={article.slug} delay={index * 0.08}>
                    <Link href={`/insights/${article.slug}`} className="block h-full group">
                      <BlogCard post={article} />
                    </Link>
                  </AnimatedReveal>
                ))}
              </div>
            </>
          ) : (
            <AnimatedReveal>
              <div className="text-center py-16">
                <p className="text-body text-text-secondary mb-4">Aucun article publié pour le moment.</p>
                <p className="text-body-sm text-text-tertiary">Revenez bientôt pour découvrir nos prochains articles.</p>
              </div>
            </AnimatedReveal>
          )}
        </Container>
      </SectionWrapper>
      <SectionWrapper>
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedReveal delay={0}>
              <div className="text-center p-6">
                <p className="text-h3 font-bold text-accent mb-2">{articles.length}+</p>
                <p className="text-body-sm text-text-secondary">Articles publiés</p>
              </div>
            </AnimatedReveal>
            <AnimatedReveal delay={0.08}>
              <div className="text-center p-6">
                <p className="text-h3 font-bold text-accent mb-2">{categories.length}</p>
                <p className="text-body-sm text-text-secondary">Catégories couvertes</p>
              </div>
            </AnimatedReveal>
            <AnimatedReveal delay={0.16}>
              <div className="text-center p-6">
                <p className="text-h3 font-bold text-accent mb-2">15+</p>
                <p className="text-body-sm text-text-secondary">Minutes de lecture en moyenne</p>
              </div>
            </AnimatedReveal>
          </div>
        </Container>
      </SectionWrapper>
      <CTABanner
        headline="Ne manquez aucun article"
        subheadline="Inscrivez-vous pour recevoir nos dernières analyses et tendances digitales."
        cta={{ label: "S'abonner", href: "/contact" }}
        variant="subtle"
      />
    </>
  )
}
