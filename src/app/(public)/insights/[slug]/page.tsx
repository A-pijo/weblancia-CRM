import { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { Badge } from "@/components/ui/badge"
import { Clock, User, CalendarBlank } from "@/components/icons"
import { Breadcrumbs } from "@/components/layout/breadcrumbs"
import { ArticleJsonLd } from "@/components/shared/json-ld"
import { getBlogPostBySlug, getRelatedPosts } from "@/lib/blog/queries"
import { siteConfig } from "@/lib/constants/site"
import Link from "next/link"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug).catch(() => null)
  if (!post) return { title: "Article non trouvé | Weblancia" }
  return {
    title: post.ogTitle ?? `${post.title} | Weblancia Insights`,
    description: post.ogDescription ?? post.excerpt ?? undefined,
    alternates: { canonical: post.canonicalUrl ?? `${siteConfig.url}/insights/${post.slug}` },
    robots: post.robots ?? undefined,
    openGraph: {
      title: post.ogTitle ?? post.title,
      description: post.ogDescription ?? post.excerpt ?? undefined,
      url: `${siteConfig.url}/insights/${post.slug}`,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author ? [post.author] : undefined,
      images: post.ogImage ? [{ url: post.ogImage }] : post.featuredImage ? [{ url: post.featuredImage }] : undefined,
    },
    twitter: {
      card: (post.twitterCard as "summary_large_image" | "summary") ?? "summary_large_image",
      title: post.ogTitle ?? post.title,
      description: post.ogDescription ?? post.excerpt ?? undefined,
      images: post.ogImage ? [post.ogImage] : post.featuredImage ? [post.featuredImage] : undefined,
    },
  }
}

function renderMarkdown(content: string): string {
  return content
    .replace(/### (.+)/g, "<h3 class='text-lg font-semibold mt-6 mb-2'>$1</h3>")
    .replace(/## (.+)/g, "<h2 class='text-xl font-semibold mt-8 mb-3'>$1</h2>")
    .replace(/# (.+)/g, "<h1 class='text-2xl font-bold mt-10 mb-4'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class='bg-zinc-800 px-1.5 py-0.5 rounded text-accent text-sm'>$1</code>")
    .replace(/^- (.+)/gm, "<li class='ml-5 list-disc text-body mb-1'>$1</li>")
    .replace(/^(\d+)\. (.+)/gm, "<li class='ml-5 list-decimal text-body mb-1'>$2</li>")
    .replace(/\[(.+?)\]\((.+?)\)/g, "<a href='$2' class='text-accent underline hover:no-underline'>$1</a>")
    .replace(/\n\n/g, "</p><p class='mb-4 text-body leading-relaxed'>")
}

export default async function InsightDetailPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug).catch(() => null)
  if (!post) notFound()

  const tags = post.tags as string[] | null
  const related = await getRelatedPosts(post.id, post.categoryId, 3).catch(() => [])

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    author: { "@type": "Person", name: post.author ?? "Weblancia" },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.featuredImage ?? undefined,
  }

  return (
    <SectionWrapper>
      <Container>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <ArticleJsonLd title={post.title} description={post.excerpt ?? ""} url={`${siteConfig.url}/insights/${post.slug}`} image={post.featuredImage ? `${siteConfig.url}${post.featuredImage}` : undefined} datePublished={post.publishedAt?.toISOString() ?? ""} author={post.author ?? "Weblancia"} />
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
              <span className="flex items-center gap-1.5"><User size={16} /> {post.author ?? "Weblancia"}</span>
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
          </article>
        </AnimatedReveal>
      </Container>

      {related.length > 0 && (
        <Container>
          <AnimatedReveal>
            <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border">
              <h2 className="text-h3 font-semibold mb-6">Articles similaires</h2>
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
    </SectionWrapper>
  )
}
