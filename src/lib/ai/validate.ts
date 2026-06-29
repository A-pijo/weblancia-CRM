import { aiConfig } from "./config"
import type { TopicResult, SeoResult } from "./providers/base"
import { logger } from "./logger"

interface ValidationResult {
  valid: boolean
  errors: string[]
}

export function validateArticle(content: string, topic: TopicResult, seo: SeoResult): ValidationResult {
  const errors: string[] = []
  const wordCount = content.trim().split(/\s+/).length

  if (wordCount < aiConfig.quality.minWords) {
    errors.push(`Article trop court : ${wordCount} mots (minimum ${aiConfig.quality.minWords})`)
  }

  const h2Count = (content.match(/^##\s/gm) || []).length
  if (h2Count < aiConfig.quality.minH2) {
    errors.push(`Pas assez de H2 : ${h2Count} trouvés (minimum ${aiConfig.quality.minH2})`)
  }

  const h3Count = (content.match(/^###\s/gm) || []).length
  if (h3Count < aiConfig.quality.minH3) {
    errors.push(`Pas assez de H3 : ${h3Count} trouvés (minimum ${aiConfig.quality.minH3})`)
  }

  if (!topic.slug || !/^[a-z0-9-]+$/.test(topic.slug)) {
    errors.push(`Slug invalide : "${topic.slug}"`)
  }

  if (!topic.categoryId || topic.categoryId < 1) {
    errors.push("Catégorie manquante ou invalide")
  }

  if (!topic.excerpt || topic.excerpt.length < 50) {
    errors.push("Description (excerpt) trop courte ou manquante")
  }

  if (!seo.ogTitle || seo.ogTitle.length < 10) {
    errors.push("SEO ogTitle manquant ou trop court")
  }

  if (!seo.ogDescription || seo.ogDescription.length < 50) {
    errors.push("SEO ogDescription manquant ou trop court")
  }

  if (!topic.tags || topic.tags.length < 2) {
    errors.push("Pas assez de tags (minimum 2)")
  }

  const result: ValidationResult = {
    valid: errors.length === 0,
    errors,
  }

  if (!result.valid) {
    logger.warn("Quality validation failed", { errors: result.errors.join("; ") })
  }

  return result
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}
