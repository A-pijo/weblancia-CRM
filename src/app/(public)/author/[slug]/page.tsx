import { Metadata } from "next"
import { notFound } from "next/navigation"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { siteConfig } from "@/lib/constants/site"
import { getAuthorBySlug, authors } from "@/lib/data/authors"
import { prisma } from "@/lib/database/prisma"
import { PersonJsonLd, WebPageJsonLd } from "@/components/shared/json-ld"
import Link from "next/link"
import type { Insight } from "@/types/insight"
import { getAuthorSlug } from "@/lib/data/authors"

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return authors.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) return { title: "Auteur non trouvé | Weblancia" }
  return {
    title: `${author.name} | Auteur Weblancia`,
    description: author.shortBio,
    alternates: { canonical: `${siteConfig.url}/author/${author.slug}` },
    openGraph: { title: `${author.name} | Auteur Weblancia`, description: author.shortBio, url: `${siteConfig.url}/author/${author.slug}`, siteName: "Weblancia", locale: "fr_FR", images: [{ url: author.image ?? "/images/og/og.svg", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", site: "@weblancia", creator: "@weblancia", title: `${author.name} | Auteur Weblancia`, description: author.shortBio, images: [author.image ?? "/images/og/og.svg"] },
    robots: { index: true, follow: true },
  }
}

export default async function AuthorProfilePage({ params }: Props) {
  const { slug } = await params
  const author = getAuthorBySlug(slug)
  if (!author) notFound()

  const dbPosts = await prisma.blogPost.findMany({
    where: { isPublished: true, author: author.name },
    orderBy: { publishedAt: "desc" },
    include: { category: true },
    take: 20,
  }).catch(() => [])

  const articles: Insight[] = dbPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.excerpt ?? "",
    category: p.category.title,
    author: p.author ?? "Weblancia",
    authorSlug: getAuthorSlug(p.author ?? "Weblancia"),
    date: p.publishedAt?.toISOString().split("T")[0] ?? "",
    readTime: p.readingTime ? `${p.readingTime} min` : "5 min",
    image: p.featuredImage ?? undefined,
    tags: (p.tags as string[]) ?? [],
  }))

  const sameAs = [author.linkedin, author.twitter, author.github].filter(Boolean) as string[]
  const authorPageUrl = `${siteConfig.url}/author/${author.slug}`

  return (
    <>
      <PersonJsonLd name={author.name} jobTitle={author.jobTitle} url={authorPageUrl} sameAs={sameAs.length > 0 ? sameAs : undefined} image={author.image ? `${siteConfig.url}${author.image}` : undefined} />
      <WebPageJsonLd name={`${author.name} | Auteur Weblancia`} description={author.shortBio} url={authorPageUrl} />
      <SectionWrapper>
        <Container>
          <Breadcrumbs items={[{ label: "Auteurs", href: "/author" }, { label: author.name }]} />
          <AnimatedReveal>
            <div className="flex flex-col md:flex-row items-start gap-6 mt-4 mb-8">
              <div className="w-24 h-24 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold text-accent">{author.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</span>
              </div>
              <div>
                <h1 className="text-display mb-2">{author.name}</h1>
                <p className="text-body font-medium text-accent mb-2">{author.jobTitle}</p>
                <p className="text-body text-text-secondary max-w-2xl mb-3">{author.bio}</p>
                <div className="flex flex-wrap gap-3">
                  {author.linkedin && <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="text-caption text-accent hover:underline">LinkedIn</a>}
                  {author.twitter && <a href={author.twitter} target="_blank" rel="noopener noreferrer" className="text-caption text-accent hover:underline">Twitter</a>}
                  {author.github && <a href={author.github} target="_blank" rel="noopener noreferrer" className="text-caption text-accent hover:underline">GitHub</a>}
                </div>
              </div>
            </div>
          </AnimatedReveal>
        </Container>
      </SectionWrapper>
      <SectionWrapper bgSecondary>
        <Container>
          <AnimatedReveal>
            <h2 className="text-h2 mb-6">Articles de {author.name}</h2>
          </AnimatedReveal>
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <AnimatedReveal key={article.slug} delay={index * 0.08}>
                  <Link href={`/insights/${article.slug}`} className="block bg-surface border border-border rounded-radius-lg p-6 hover:border-accent transition-colors h-full">
                    <p className="text-xs text-accent mb-1">{article.category}</p>
                    <h3 className="text-body font-semibold line-clamp-2 mb-2">{article.title}</h3>
                    <p className="text-body-sm text-text-secondary line-clamp-2 mb-3">{article.description}</p>
                    <p className="text-caption text-text-tertiary">{article.date} · {article.readTime}</p>
                  </Link>
                </AnimatedReveal>
              ))}
            </div>
          ) : (
            <p className="text-body text-text-secondary">Aucun article publié pour le moment.</p>
          )}
        </Container>
      </SectionWrapper>
    </>
  )
}
