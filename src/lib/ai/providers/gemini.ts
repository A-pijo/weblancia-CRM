import { GoogleGenerativeAI } from "@google/generative-ai"
import type { AIProvider, TopicResult, SeoResult, FaqItem, ArticleParams, ArticleResult } from "./base"

const LANGUAGE_MAP: Record<string, string> = {
  fr: "French",
  en: "English",
  ar: "Arabic",
}

const LANGUAGE_INSTRUCT: Record<string, string> = {
  fr: "Écris en français (langue cible : français).",
  en: "Write in English (target language: English).",
  ar: "اكتب باللغة العربية (اللغة المستهدفة: العربية).",
}

export class GeminiProvider implements AIProvider {
  readonly name = "gemini"
  private model

  constructor(apiKey: string) {
    const genAI = new GoogleGenerativeAI(apiKey)
    this.model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
      },
    })
  }

  private jsonModel(apiKey: string, temperature = 0.3) {
    const genAI = new GoogleGenerativeAI(apiKey)
    return genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature,
        maxOutputTokens: 2048,
        responseMimeType: "application/json",
      },
    })
  }

  private langInstruct(language: string): string {
    return LANGUAGE_INSTRUCT[language] ?? LANGUAGE_INSTRUCT.fr
  }

  async selectTopic(categories: { id: number; title: string; slug: string }[], language: string): Promise<TopicResult> {
    const langName = LANGUAGE_MAP[language] ?? LANGUAGE_MAP.fr
    const li = this.langInstruct(language)
    const categoryList = categories.map((c) => `- ${c.title}`).join("\n")

    const prompt = `${li}

You are an SEO content strategist for Weblancia, a Moroccan web agency specializing in web development, digital marketing, and design.

Available blog categories:
${categoryList}

Select the BEST category for a new article, then generate:
1. A compelling, SEO-optimized title (max 100 chars, in ${langName}, targeting Moroccan businesses)
2. A URL slug derived from the title (lowercase, hyphens, no special chars)
3. A meta description/excerpt (max 160 chars)
4. The category ID (only from the list above)
5. 3-5 relevant tags as a JSON array of strings
6. A primary focus keyword (1-3 words)

Return ONLY valid JSON with keys: title, slug, excerpt, categoryId (number), tags (string array), focusKeyword (string).
Choose topics that help Moroccan small businesses grow online: SEO tips, web design trends, digital marketing strategies, e-commerce, AI tools, local business success stories.`

    const apiKey = process.env.GEMINI_API_KEY ?? ""
    const model = this.jsonModel(apiKey, 0.3)
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    if (!text) throw new Error("No content in topic response")
    return JSON.parse(text) as TopicResult
  }

  async generateArticle(params: ArticleParams): Promise<ArticleResult> {
    const li = this.langInstruct(params.language)
    const postsContext = params.existingPosts.length > 0
      ? `\nExisting blog posts (you may link to them naturally, ONLY use URLs from this list, never invent URLs):\n${params.existingPosts.map((p) => `- ${p.title}: ${p.url}`).join("\n")}`
      : ""

    const prompt = `${li}

You are an expert SEO copywriter for Weblancia, a Moroccan web agency. Write a comprehensive blog article.

Title: ${params.title}
Focus Keyword: "${params.focusKeyword}"
Tags: ${params.tags.join(", ")}
Category: ${params.categoryTitle}${postsContext}

Requirements:
- Write 1500-2500 words
- Target Moroccan small business owners
- Use proper ${LANGUAGE_MAP[params.language] ?? "French"} (Moroccan context)
- Include: H2 headings, lists, bold text for emphasis
- Minimum structure: 1 H1 (the title), 5 H2, 3 H3
- Natural keyword placement (don't over-optimize)
- Practical, actionable advice
- Link to existing Weblancia blog posts naturally where relevant (only use URLs from the provided list)
- End with the following call-to-action (vary wording naturally, do not repeat it verbatim):
  "${params.ctaVariation}"
- Format in markdown

Return ONLY the article markdown content, no preamble, no JSON wrapper.`

    const result = await this.model.generateContent(prompt)
    const text = result.response.text()
    if (!text) throw new Error("No content in article response")
    return { content: text }
  }

  private async jsonGenerate(prompt: string, temperature = 0.3): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY ?? ""
    const model = this.jsonModel(apiKey, temperature)
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    if (!text) throw new Error("No content in JSON response")
    return text
  }

  async generateSeoMetadata(title: string, excerpt: string, focusKeyword: string, language: string): Promise<SeoResult> {
    const li = this.langInstruct(language)
    const langName = LANGUAGE_MAP[language] ?? LANGUAGE_MAP.fr

    const prompt = `${li}
Generate SEO metadata for a blog article with:
- Title: "${title}"
- Excerpt: "${excerpt}"
- Focus Keyword: "${focusKeyword}"
- Language: ${langName}

Return ONLY valid JSON with:
- ogTitle: Open Graph title (max 60 chars, compelling, in ${langName})
- ogDescription: Open Graph description (max 160 chars, in ${langName})
- twitterCard: "summary_large_image"
- canonicalUrl: null
- robots: "index, follow"`

    const text = await this.jsonGenerate(prompt, 0.3)
    return JSON.parse(text) as SeoResult
  }

  async generateFaq(title: string, content: string, language: string): Promise<FaqItem[]> {
    const li = this.langInstruct(language)
    const langName = LANGUAGE_MAP[language] ?? LANGUAGE_MAP.fr
    const excerpt = content.slice(0, 2000)

    const prompt = `${li}
Based on the following blog article, generate 3-5 frequently asked questions with answers.

Article Title: ${title}
Article Excerpt: ${excerpt}
Language: ${langName}

Return ONLY valid JSON as an array of objects with keys: question, answer.
Questions should be in ${langName}, address common reader doubts, and provide concise helpful answers (1-3 sentences each).`

    const text = await this.jsonGenerate(prompt, 0.5)
    const parsed = JSON.parse(text)
    return (Array.isArray(parsed) ? parsed : parsed.questions ?? []) as FaqItem[]
  }

  async generateImagePrompt(title: string, excerpt: string, tags: string[], language: string): Promise<string> {
    const li = this.langInstruct(language)

    const prompt = `${li}
Create a detailed text prompt for generating a blog article featured image (this prompt will be used by an image generation AI like DALL-E or Midjourney).

Title: "${title}"
Excerpt: "${excerpt}"
Tags: ${tags.join(", ")}

Requirements:
- Digital illustration style, professional
- Moroccan-inspired color palette (terracotta, gold, navy)
- No text in the image
- 16:9 aspect ratio
- Modern, clean design suitable for a web agency blog
- Return ONLY the prompt text, one single sentence, in English (AI image generators work best with English prompts)`

    const result = await this.model.generateContent(prompt)
    const text = result.response.text()?.trim()
    if (!text) throw new Error("No prompt in image prompt response")
    return text
  }
}
