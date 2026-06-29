export interface TopicResult {
  title: string
  slug: string
  excerpt: string
  categoryId: number
  tags: string[]
  focusKeyword: string
}

export interface SeoResult {
  ogTitle: string
  ogDescription: string
  twitterCard: string
  robots: string
  canonicalUrl: string | null
}

export interface FaqItem {
  question: string
  answer: string
}

export type Language = "fr" | "en" | "ar"

export interface ArticleParams {
  title: string
  focusKeyword: string
  tags: string[]
  excerpt: string
  existingPosts: { title: string; slug: string; url: string }[]
  categoryTitle: string
  ctaVariation: string
  language: Language
}

export interface ArticleResult {
  content: string
}

export interface AIProvider {
  readonly name: string
  selectTopic(categories: { id: number; title: string; slug: string }[], language: string): Promise<TopicResult>
  generateArticle(params: ArticleParams): Promise<ArticleResult>
  generateSeoMetadata(title: string, excerpt: string, focusKeyword: string, language: string): Promise<SeoResult>
  generateFaq(title: string, content: string, language: string): Promise<FaqItem[]>
  generateImagePrompt(title: string, excerpt: string, tags: string[], language: string): Promise<string>
}
