export interface Insight {
  slug: string
  title: string
  description: string
  category: string
  author: string
  date: string
  readTime: string
  image?: string
  content?: string
  tags?: string[]
  featured?: boolean
}
