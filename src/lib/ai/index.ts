import { getProvider, type FaqItem } from "./providers"
import { aiConfig, isAiAvailable } from "./config"
import { logger } from "./logger"
import { withRetry } from "./retry"
import { validateArticle, estimateTokens } from "./validate"
import { calculateReadingTime } from "@/lib/validations/blog"
import { getBlogCategories, getBlogPostBySlug, getPublishedPosts, createBlogPost } from "@/lib/blog/queries"
import { revalidatePath } from "next/cache"
import { sendEmail } from "@/lib/email"
import { env } from "@/lib/env"

export interface GeneratedPost {
  id: number
  title: string
  slug: string
  url: string
}

export interface GenerationReport {
  success: boolean
  post?: GeneratedPost
  faq?: FaqItem[]
  imagePrompt?: string
  wordCount?: number
  estimatedTokens?: number
  error?: string
  durationMs: number
}

function getCtaVariation(postCount: number): string {
  const variations = aiConfig.ctaVariations
  const index = postCount % variations.length
  return variations[index]
}

export async function generateAndPublishArticle(): Promise<GenerationReport> {
  const start = Date.now()
  logger.start()

  if (!isAiAvailable()) {
    const msg = `AI provider "${aiConfig.provider}" not configured — check ${aiConfig.provider === "gemini" ? "GEMINI_API_KEY" : "OPENAI_API_KEY"} env var`
    logger.error(msg)
    return { success: false, error: msg, durationMs: Date.now() - start }
  }

  const provider = getProvider()!
  logger.info(`Using provider: ${provider.name}`)

  try {
    const categories = await getBlogCategories()
    if (!categories || categories.length === 0) {
      return { success: false, error: "No blog categories found", durationMs: Date.now() - start }
    }
    logger.info(`Loaded ${categories.length} categories`)

    const existingPosts = await getPublishedPosts(20)
    logger.info(`Loaded ${existingPosts.length} existing posts for internal linking`)

    const ctaVariation = getCtaVariation(existingPosts.length)
    const language = aiConfig.language as "fr" | "en" | "ar"

    let topic!: Awaited<ReturnType<typeof provider.selectTopic>>
    let topicAttempts = 0
    const maxTopicAttempts = 3

    while (topicAttempts < maxTopicAttempts) {
      topicAttempts++
      logger.info(`Selecting topic (attempt ${topicAttempts}/${maxTopicAttempts})...`)

      const result = await withRetry(
        () => provider.selectTopic(
          categories.map((c) => ({ id: c.id, title: c.title, slug: c.slug })),
          language,
        ),
        "Topic selection",
      )
      logger.info(`Topic selected: "${result.title}" (slug: ${result.slug})`)

      const existing = await getBlogPostBySlug(result.slug).catch(() => null)
      if (!existing) {
        topic = result
        break
      }
      logger.warn(`Duplicate slug found: "${result.slug}", generating different topic...`)
    }

    if (topicAttempts >= maxTopicAttempts && !topic) {
      return {
        success: false,
        error: "Could not find unique topic after 3 attempts — duplicate prevention triggered",
        durationMs: Date.now() - start,
      }
    }

    const categoryTitle = categories.find((c) => c.id === topic.categoryId)?.title ?? "General"

    const postLinks = existingPosts.map((p) => ({
      title: p.title,
      slug: p.slug,
      url: `${env.SITE_URL}/insights/${p.slug}`,
    }))

    logger.info("Generating article...")
    const { content } = await withRetry(
      () => provider.generateArticle({
        title: topic.title,
        focusKeyword: topic.focusKeyword,
        tags: topic.tags,
        excerpt: topic.excerpt,
        existingPosts: postLinks,
        categoryTitle,
        ctaVariation,
        language,
      }),
      "Article generation",
    )
    logger.info(`Article generated (${content.trim().split(/\s+/).length} words)`)

    logger.info("Generating SEO metadata...")
    const seo = await withRetry(
      () => provider.generateSeoMetadata(topic.title, topic.excerpt, topic.focusKeyword, language),
      "SEO generation",
    )
    logger.info("SEO metadata generated")

    logger.info("Generating FAQ...")
    const faq = await withRetry(
      () => provider.generateFaq(topic.title, content, language),
      "FAQ generation",
    )
    logger.info(`FAQ generated (${faq.length} questions)`)

    logger.info("Generating image prompt...")
    const imagePrompt = await provider.generateImagePrompt(topic.title, topic.excerpt, topic.tags, language)
    logger.info("Image prompt generated")

    logger.info("Validating quality...")
    const validation = validateArticle(content, topic, seo)
    if (!validation.valid) {
      logger.error("Validation failed, discarding article", { errors: validation.errors.join("; ") })
      return {
        success: false,
        error: `Validation failed: ${validation.errors.join("; ")}`,
        durationMs: Date.now() - start,
      }
    }
    logger.info("Quality validation passed")

    const readingTime = calculateReadingTime(content)
    const estimatedTokens = estimateTokens(content)

    logger.info("Saving article...")
    const post = await createBlogPost({
      title: topic.title,
      slug: topic.slug,
      excerpt: topic.excerpt,
      content,
      categoryId: topic.categoryId,
      author: "Weblancia",
      publishedAt: new Date().toISOString(),
      isPublished: true,
      isFeatured: false,
      readingTime,
      tags: topic.tags,
      featuredImage: aiConfig.defaultCoverImage,
      focusKeyword: topic.focusKeyword,
      canonicalUrl: null,
      robots: seo.robots ?? "index, follow",
      ogTitle: seo.ogTitle,
      ogDescription: seo.ogDescription,
      ogImage: null,
      twitterCard: seo.twitterCard ?? "summary_large_image",
    })
    logger.info(`Article published: "${topic.title}" (ID: ${post.id})`)

    const url = `${env.SITE_URL}/insights/${topic.slug}`

    try {
      revalidatePath("/insights")
      revalidatePath(`/insights/${topic.slug}`)
      revalidatePath("/sitemap.xml")
    } catch {}

    try {
      await sendEmail({
        to: env.NOTIFICATION_EMAIL,
        subject: `Nouvel article publié : ${topic.title}`,
        body: [
          `Un nouvel article a été généré et publié automatiquement via ${provider.name} :`,
          ``,
          `Titre : ${topic.title}`,
          `URL : ${url}`,
          `Catégorie : ${categoryTitle}`,
          `Mots-clés : ${topic.focusKeyword}`,
          `Temps de lecture : ${readingTime} min`,
          `Tags : ${topic.tags.join(", ")}`,
          `Tokens estimés : ~${estimatedTokens}`,
          ``,
          `---`,
          `Généré en ${((Date.now() - start) / 1000).toFixed(1)}s`,
        ].join("\n"),
      })
    } catch (emailError) {
      console.error("[AI] Failed to send notification email:", emailError instanceof Error ? emailError.message : String(emailError))
    }

    logger.done(Date.now() - start, { title: topic.title, id: post.id, tokens: estimatedTokens })

    return {
      success: true,
      post: { id: post.id, title: topic.title, slug: topic.slug, url },
      faq,
      imagePrompt,
      wordCount: content.trim().split(/\s+/).length,
      estimatedTokens,
      durationMs: Date.now() - start,
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    logger.error("Generation failed", { error: message })
    return { success: false, error: message, durationMs: Date.now() - start }
  }
}
