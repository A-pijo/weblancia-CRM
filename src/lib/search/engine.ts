import { db } from "@/lib/db"

export interface SearchResult {
  title: string
  description: string
  href: string
  category: "Services" | "Projects" | "Blog" | "Courses" | "Team" | "FAQ"
  score: number
}

function score(query: string, ...fields: (string | null | undefined)[]): number {
  const lower = query.toLowerCase()
  let max = 0
  for (const raw of fields) {
    if (!raw) continue
    const val = raw.toLowerCase()
    if (val === lower) return 100
    if (val.startsWith(lower)) max = Math.max(max, 80)
    if (val.includes(lower)) max = Math.max(max, 60)
  }
  return max
}

function scoreContains(query: string, ...fields: (string | null | undefined)[]): number {
  const lower = query.toLowerCase()
  for (const raw of fields) {
    if (!raw) continue
    if (raw.toLowerCase().includes(lower)) return 40
  }
  return 0
}

export async function globalSearch(query: string): Promise<SearchResult[]> {
  const lower = query.trim().toLowerCase()
  if (!lower) return []

  const results: SearchResult[] = []

  const [services, projects, posts, courses, members, faqs] = await Promise.all([
    db.service.findMany({ where: { isActive: true, OR: [{ title: { contains: lower } }, { description: { contains: lower } }] } }),
    db.project.findMany({ where: { isActive: true, OR: [{ title: { contains: lower } }, { description: { contains: lower } }, { client: { contains: lower } }] } }),
    db.blogPost.findMany({ where: { isPublished: true, OR: [{ title: { contains: lower } }, { excerpt: { contains: lower } }, { author: { contains: lower } }] } }),
    db.course.findMany({ where: { isPublished: true, OR: [{ title: { contains: lower } }, { shortDescription: { contains: lower } }, { instructor: { contains: lower } }] } }),
    db.teamMember.findMany({ where: { isActive: true, OR: [{ name: { contains: lower } }, { role: { contains: lower } }, { bio: { contains: lower } }] } }),
    db.fAQ.findMany({ where: { isActive: true, OR: [{ question: { contains: lower } }, { answer: { contains: lower } }] } }),
  ])

  for (const s of services) {
    const s1 = score(query, s.title)
    const s2 = s1 < 100 ? scoreContains(query, s.description) : 0
    results.push({ title: s.title, description: s.description ?? "", href: `/services/${s.slug}`, category: "Services", score: Math.max(s1, s2) })
  }

  for (const p of projects) {
    const s1 = score(query, p.title)
    const s2 = s1 < 100 ? scoreContains(query, p.description, p.client) : 0
    results.push({ title: p.title, description: p.description ?? "", href: `/work/${p.slug}`, category: "Projects", score: Math.max(s1, s2) })
  }

  for (const b of posts) {
    const s1 = score(query, b.title)
    const s2 = s1 < 100 ? scoreContains(query, b.excerpt, b.author) : 0
    results.push({ title: b.title, description: b.excerpt ?? "", href: `/insights/${b.slug}`, category: "Blog", score: Math.max(s1, s2) })
  }

  for (const c of courses) {
    const s1 = score(query, c.title)
    const s2 = s1 < 100 ? scoreContains(query, c.shortDescription, c.instructor) : 0
    results.push({ title: c.title, description: c.shortDescription ?? "", href: `/academy/courses/${c.slug}`, category: "Courses", score: Math.max(s1, s2) })
  }

  for (const m of members) {
    const s1 = score(query, m.name, m.role)
    const s2 = s1 < 100 ? scoreContains(query, m.bio) : 0
    results.push({ title: m.name, description: `${m.role}${m.bio ? ` — ${m.bio}` : ""}`, href: `/about/team#member-${m.id}`, category: "Team", score: Math.max(s1, s2) })
  }

  for (const f of faqs) {
    const s1 = score(query, f.question)
    const s2 = s1 < 100 ? scoreContains(query, f.answer) : 0
    results.push({ title: f.question, description: f.answer, href: `/contact#faq-${f.id}`, category: "FAQ", score: Math.max(s1, s2) })
  }

  return results.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title)).slice(0, 30)
}
