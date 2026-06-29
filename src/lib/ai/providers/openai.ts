import OpenAI from "openai"
import type { AIProvider, TopicResult, SeoResult, FaqItem, ArticleParams, ArticleResult } from "./base"

const LANGUAGE_MAP: Record<string, string> = {
  fr: "FRENCH",
  en: "ENGLISH",
  ar: "ARABIC",
}

export class OpenAiProvider implements AIProvider {
  readonly name = "openai"
  private client: OpenAI

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey })
  }

  async selectTopic(categories: { id: number; title: string; slug: string }[], language: string): Promise<TopicResult> {
    const lang = LANGUAGE_MAP[language] ?? "FRENCH"
    const categoryList = categories.map((c) => `- ${c.title}`).join("\n")
    const prompt = `You are an SEO content strategist for Weblancia, a Moroccan web agency specializing in web development, digital marketing, and design.

Available blog categories:
${categoryList}

Select the BEST category for a new article, then generate:
1. A compelling, SEO-optimized title (max 100 chars, in ${lang}, targeting Moroccan businesses)
2. A URL slug derived from the title
3. A meta description/excerpt (max 160 chars)
4. The category ID (only from the list above)
5. 3-5 relevant tags as a JSON array of strings
6. A primary focus keyword (1-3 words)

Return ONLY valid JSON with keys: title, slug, excerpt, categoryId (number), tags (string array), focusKeyword (string).
Choose topics that help Moroccan small businesses grow online: SEO tips, web design trends, digital marketing strategies, e-commerce, AI tools, local business success stories.`

    const res = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    })

    const content = res.choices[0]?.message?.content
    if (!content) throw new Error("No content in topic response")
    return JSON.parse(content) as TopicResult
  }

  async generateArticle(params: ArticleParams): Promise<ArticleResult> {
    const lang = LANGUAGE_MAP[params.language] ?? "FRENCH"
    const postsContext = params.existingPosts.length > 0
      ? `\nExisting blog posts (you may link to them naturally):\n${params.existingPosts.map((p) => `- ${p.title}: ${p.url}`).join("\n")}`
      : ""

    const prompt = `You are an expert SEO copywriter for Weblancia, a Moroccan web agency. Write a comprehensive blog article in ${lang}.

Title: ${params.title}
Focus Keyword: "${params.focusKeyword}"
Tags: ${params.tags.join(", ")}
Category: ${params.categoryTitle}${postsContext}

Requirements:
- Write 1500-2500 words
- Target Moroccan small business owners
- Use proper ${lang} (Moroccan context)
- Include: H2 headings, lists, bold text for emphasis
- Minimum structure: 1 H1, 5 H2, 3 H3
- Natural keyword placement (don't over-optimize)
- Practical, actionable advice
- Link to existing Weblancia blog posts naturally where relevant (only use URLs from the provided list, never invent URLs)
- End with the following CTA (vary wording naturally):
  "${params.ctaVariation}"
- Format in markdown

Return ONLY the article markdown content, no preamble.`

    const res = await this.client.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 4096,
    })

    const content = res.choices[0]?.message?.content
    if (!content) throw new Error("No content in writer response")
    return { content }
  }

  async generateSeoMetadata(title: string, excerpt: string, focusKeyword: string, language: string): Promise<SeoResult> {
    const lang = LANGUAGE_MAP[language] ?? "FRENCH"
    const prompt = `Generate SEO metadata for a blog article with:
- Title: "${title}"
- Excerpt: "${excerpt}"
- Focus Keyword: "${focusKeyword}"
- Language: ${lang}

Return ONLY valid JSON with:
- ogTitle: Open Graph title (max 60 chars, compelling, in ${lang})
- ogDescription: Open Graph description (max 160 chars, in ${lang})
- twitterCard: "summary_large_image"
- canonicalUrl: null (auto-generated from slug)
- robots: "index, follow"`

    const res = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    })

    const content = res.choices[0]?.message?.content
    if (!content) throw new Error("No content in SEO response")
    return JSON.parse(content) as SeoResult
  }

  async generateFaq(title: string, content: string, language: string): Promise<FaqItem[]> {
    const lang = LANGUAGE_MAP[language] ?? "FRENCH"
    const excerpt = content.slice(0, 2000)
    const prompt = `Based on the following blog article, generate 3-5 frequently asked questions with answers.

Article Title: ${title}
Article Excerpt: ${excerpt}
Language: ${lang}

Return ONLY valid JSON as an array of objects with keys: question, answer.
Questions should be in ${lang}, address common reader doubts, and provide concise helpful answers (1-3 sentences each).`

    const res = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    })

    const raw = res.choices[0]?.message?.content
    if (!raw) throw new Error("No content in FAQ response")
    const parsed = JSON.parse(raw)
    return (Array.isArray(parsed) ? parsed : parsed.questions ?? []) as FaqItem[]
  }

  async generateImagePrompt(title: string, excerpt: string, tags: string[], language: string): Promise<string> {
    const lang = LANGUAGE_MAP[language] ?? "FRENCH"
    const promptText = `Create a DALL-E 3 prompt for a blog article featured image.

Title: "${title}"
Excerpt: "${excerpt}"
Tags: ${tags.join(", ")}
Language context: ${lang}

Requirements:
- Digital illustration style, professional
- Moroccan-inspired color palette (terracotta, gold, navy)
- No text in the image
- 16:9 aspect ratio
- Modern, clean design suitable for a web agency blog
- Return ONLY the prompt text, one sentence`

    const res = await this.client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: promptText }],
      temperature: 0.8,
      max_tokens: 200,
    })

    const prompt = res.choices[0]?.message?.content?.trim()
    if (!prompt) throw new Error("No prompt in image prompt response")
    return prompt
  }
}
