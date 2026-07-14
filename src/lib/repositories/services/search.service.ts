import { prisma } from "@/lib/database/prisma"

interface SearchResult {
  id: number | string
  title: string
  excerpt: string
  url: string
  type: string
  score: number
}

export class SearchService {
  async globalSearch(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) return []
    const results: SearchResult[] = []

    const searchIn = async <T extends { id: number; title?: string; slug?: string; excerpt?: string; description?: string; shortDescription?: string }>(
      table: string, fields: string[], map: (item: T) => SearchResult
    ) => {
      const likeClauses = fields.map((f) => `LOWER(${f}) LIKE LOWER($1)`).join(" OR ")
      const items = await prisma.$queryRawUnsafe<T[]>(`SELECT * FROM "${table}" WHERE ${likeClauses} LIMIT 10`, `%${query}%`)
      for (const item of items) results.push(map(item))
    }

    await Promise.all([
      searchIn("Service", ["title", "description"], (s) => ({ id: s.id, title: s.title || "", excerpt: s.description || "", url: `/services/${s.slug}`, type: "service", score: 60 })),
      searchIn("Project", ["title", "description"], (s) => ({ id: s.id, title: s.title || "", excerpt: s.description || "", url: `/work/${s.slug}`, type: "project", score: 60 })),
      searchIn("BlogPost", ["title", "excerpt"], (s) => ({ id: s.id, title: s.title || "", excerpt: s.excerpt || "", url: `/insights/${s.slug}`, type: "blog", score: 60 })),
      searchIn("Course", ["title", "shortDescription"], (s) => ({ id: s.id, title: s.title || "", excerpt: s.shortDescription || "", url: `/academy/courses/${s.slug}`, type: "course", score: 60 })),
      searchIn("TeamMember", ["name", "bio"], (s) => ({ id: s.id, title: (s as any).name || "", excerpt: (s as any).bio || "", url: "/about", type: "team", score: 60 })),
      searchIn("FAQ", ["question", "answer"], (s) => ({ id: s.id, title: (s as any).question || "", excerpt: (s as any).answer || "", url: "/faq", type: "faq", score: 60 })),
    ])

    return results.sort((a, b) => b.score - a.score).slice(0, 30)
  }
}

export const searchService = new SearchService()
