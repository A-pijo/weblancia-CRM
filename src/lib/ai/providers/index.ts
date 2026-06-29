import type { AIProvider } from "./base"
import { OpenAiProvider } from "./openai"
import { GeminiProvider } from "./gemini"

export type { AIProvider, TopicResult, SeoResult, FaqItem, ArticleParams, ArticleResult } from "./base"
export { OpenAiProvider } from "./openai"
export { GeminiProvider } from "./gemini"

let cachedProvider: AIProvider | null = null

export function getProvider(): AIProvider | null {
  if (cachedProvider) return cachedProvider

  const providerName = (process.env.AI_PROVIDER ?? "gemini").toLowerCase()
  const openaiKey = process.env.OPENAI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY

  switch (providerName) {
    case "openai": {
      if (!openaiKey) {
        console.warn("[AI] AI_PROVIDER=openai but OPENAI_API_KEY is not set")
        return null
      }
      cachedProvider = new OpenAiProvider(openaiKey)
      return cachedProvider
    }
    case "gemini":
    default: {
      if (!geminiKey) {
        console.warn("[AI] AI_PROVIDER=gemini but GEMINI_API_KEY is not set")
        return null
      }
      cachedProvider = new GeminiProvider(geminiKey)
      return cachedProvider
    }
  }
}

export function resetProvider(): void {
  cachedProvider = null
}
