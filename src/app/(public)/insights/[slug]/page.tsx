import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Badge } from "@/components/ui/badge"
import { Clock, User, CalendarBlank } from "@/components/icons"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { BlogPostingJsonLd, SpeakableJsonLd } from "@/components/shared/json-ld"
import { XLogo, LinkedinLogo } from "@/components/icons"
import { prisma } from "@/lib/database/prisma"
import { siteConfig } from "@/lib/constants/site"
import { getAuthorByName, getAuthorPageUrl } from "@/lib/data/authors"
import { getSemanticClusters } from "@/lib/semantic/clusters"
import { SemanticLinks } from "@/components/sections/semantic-links"
import Link from "next/link"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  }).catch(() => null)
  if (!post) return { title: "Article non trouvé | Weblancia" }
  return {
    title: post.ogTitle ?? `${post.title} | Weblancia Insights`,
    description: post.ogDescription ?? post.excerpt ?? undefined,
    keywords: `Weblancia, ${post.title}, ${post.category?.title ?? "blog"}, insights, digital, ${post.tags ? (post.tags as string[]).join(", ") : ""}`,
    alternates: { canonical: post.canonicalUrl ?? `${siteConfig.url}/insights/${post.slug}` },
    robots: post.robots ?? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } } as const,
    openGraph: {
      title: post.ogTitle ?? post.title,
      description: post.ogDescription ?? post.excerpt ?? undefined,
      url: `${siteConfig.url}/insights/${post.slug}`,
      siteName: "Weblancia",
      locale: "fr_FR",
      alternateLocale: ["en_US", "ar_SA"],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: post.author ? [post.author] : undefined,
      images: post.ogImage ? [{ url: post.ogImage, width: 1200, height: 630 }] : post.featuredImage ? [{ url: post.featuredImage, width: 1200, height: 630 }] : [{ url: "/images/og/og.svg", width: 1200, height: 630 }],
    },
    twitter: {
      card: (post.twitterCard as "summary_large_image" | "summary") ?? "summary_large_image",
      site: "@weblancia",
      creator: post.author ? `@${post.author.replace(/\s+/g, "").toLowerCase()}` : "@weblancia",
      title: post.ogTitle ?? post.title,
      description: post.ogDescription ?? post.excerpt ?? undefined,
      images: post.ogImage ? [post.ogImage] : post.featuredImage ? [post.featuredImage] : ["/images/og/og.svg"],
    },
    authors: post.author ? [{ name: post.author }] : [{ name: "Weblancia" }],
    creator: post.author ?? "Weblancia",
    publisher: "Weblancia",
    category: post.category?.title ?? "blog",
  }
}

function renderMarkdown(content: string): string {
  const sanitized = content.replace(/<[^>]*>/g, "")
  return sanitized
    .replace(/### (.+)/g, "<h4 class='text-base font-semibold mt-5 mb-2'>$1</h4>")
    .replace(/## (.+)/g, "<h3 class='text-lg font-semibold mt-7 mb-3'>$1</h3>")
    .replace(/# (.+)/g, "<h2 class='text-xl font-bold mt-9 mb-4'>$1</h2>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class='bg-zinc-800 px-1.5 py-0.5 rounded text-accent text-sm'>$1</code>")
    .replace(/^- (.+)/gm, "<li class='ml-5 list-disc text-body mb-1'>$1</li>")
    .replace(/^(\d+)\. (.+)/gm, "<li class='ml-5 list-decimal text-body mb-1'>$2</li>")
    .replace(/\[(.+?)\]\((.+?)\)/g, (_m: string, text: string, url: string) => {
      const sanitized = url.replace(/^(javascript|data|vbscript):/i, "#blocked-")
      const isExternal = /^https?:\/\//.test(sanitized) && !sanitized.includes(siteConfig.url)
      const attrs = `href='${sanitized}' class='text-accent underline hover:no-underline'${isExternal ? " target='_blank' rel='noopener noreferrer'" : " rel='follow'"}'`
      return `<a ${attrs}>${text}</a>`
    })
    .replace(/\n\n/g, "</p><p class='mb-4 text-body leading-relaxed'>")
}

export const revalidate = 3600

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { category: true },
  }).catch(() => null)
  if (!post) notFound()

  const tags = post.tags as string[] | null
  const authorName = post.author ?? "Weblancia"
  const authorProfile = getAuthorByName(authorName)
  const authorPageUrl = getAuthorPageUrl(authorName)
  const [related, semanticClusters] = await Promise.all([
    prisma.blogPost.findMany({
      where: { isPublished: true, categoryId: post.categoryId, id: { not: post.id } },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }).catch(() => []),
    getSemanticClusters(tags, post.categoryId, post.id).catch(() => ({
      services: [], faq: [], industries: [], cities: [], projects: [], resources: [], relatedPosts: [],
    })),
  ])

  return (
    <SectionWrapper>
      <Container>
        <BlogPostingJsonLd
          title={post.title}
          description={post.excerpt ?? ""}
          url={`${siteConfig.url}/insights/${post.slug}`}
          image={post.featuredImage ? `${siteConfig.url}${post.featuredImage}` : undefined}
          datePublished={post.publishedAt?.toISOString() ?? ""}
          dateModified={post.updatedAt.toISOString()}
          author={authorName}
          authorUrl={`${siteConfig.url}${authorPageUrl}`}
          authorImage={authorProfile?.image ? `${siteConfig.url}${authorProfile.image}` : undefined}
          authorSameAs={[authorProfile?.linkedin, authorProfile?.twitter].filter(Boolean) as string[]}
        />
        <SpeakableJsonLd cssSelector={["h1", ".text-body-lg"]} url={`${siteConfig.url}/insights/${post.slug}`} />
        <Breadcrumbs items={[{ label: "Insights", href: "/insights" }, { label: post.title }]} />
        <AnimatedReveal>
          <article className="max-w-3xl mx-auto mt-4">
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="accent">{post.category.title}</Badge>
                {tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
            {!tags && (
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="accent">{post.category.title}</Badge>
              </div>
            )}
            <h1 className="text-display mb-4">{post.title}</h1>
            <p className="text-body-lg text-text-secondary mb-6">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-4 text-caption text-text-tertiary mb-8 pb-8 border-b border-border">
              <Link href={authorPageUrl} className="flex items-center gap-1.5 hover:text-accent transition-colors"><User size={16} /> {authorName}</Link>
              {post.publishedAt && (
                <span className="flex items-center gap-1.5"><CalendarBlank size={16} /> {new Date(post.publishedAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</span>
              )}
              {post.readingTime && (
                <span className="flex items-center gap-1.5"><Clock size={16} /> {post.readingTime} min de lecture</span>
              )}
            </div>
            {post.featuredImage && (
              <div className="relative aspect-[16/9] rounded-radius-xl overflow-hidden bg-bg-secondary mb-8">
                <Image src={post.featuredImage} alt={post.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
              </div>
            )}
            <div className="text-body text-text-primary leading-relaxed">
              {post.content ? (
                <div dangerouslySetInnerHTML={{ __html: `<p class='mb-4 leading-relaxed'>${renderMarkdown(post.content)}</p>` }} />
              ) : (
                <p className="text-text-secondary italic">Contenu non disponible.</p>
              )}
            </div>
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-border">
              <span className="text-caption text-text-tertiary">Partager :</span>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${siteConfig.url}/insights/${post.slug}`)}`} target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-accent transition-colors" aria-label="Partager sur X">
                <XLogo size={18} />
              </a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`${siteConfig.url}/insights/${post.slug}`)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="text-text-tertiary hover:text-accent transition-colors" aria-label="Partager sur LinkedIn">
                <LinkedinLogo size={18} />
              </a>
            </div>
          </article>
        </AnimatedReveal>
      </Container>

      {authorProfile && authorProfile.name !== "Weblancia" && (
        <Container>
          <AnimatedReveal>
            <div className="max-w-3xl mx-auto mt-12 pt-8 border-t border-border">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-accent-light flex items-center justify-center shrink-0">
                  <span className="text-lg font-semibold text-accent">{authorProfile.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}</span>
                </div>
                <div>
                  <Link href={authorPageUrl} className="font-semibold text-text-primary hover:text-accent transition-colors">{authorProfile.name}</Link>
                  <p className="text-caption text-text-secondary mb-1">{authorProfile.jobTitle}</p>
                  <p className="text-body-sm text-text-tertiary">{authorProfile.shortBio}</p>
                  {authorProfile.linkedin && (
                    <a href={authorProfile.linkedin} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-caption text-accent hover:underline">LinkedIn →</a>
                  )}
                </div>
              </div>
            </div>
          </AnimatedReveal>
        </Container>
      )}

      {related.length > 0 && (
        <Container>
          <AnimatedReveal>
            <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
              <h2 className="text-h2 font-semibold mb-6">Articles similaires</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.id} href={`/insights/${r.slug}`} className="block p-4 bg-surface rounded-radius-lg border border-border hover:border-accent transition-colors">
                    <p className="text-xs text-accent mb-1">{r.category.title}</p>
                    <p className="text-sm font-medium line-clamp-2">{r.title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedReveal>
        </Container>
      )}

      <SemanticLinks clusters={semanticClusters} />
    </SectionWrapper>
  )
}
