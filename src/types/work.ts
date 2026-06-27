export interface WorkItem {
  id: number
  slug: string
  title: string
  client: string | null
  industry: string | null
  description: string | null
  featuredImage: string | null
  technologies: string[] | null
  clientTestimonial: { quote: string; author: string; role: string } | null
  results: { label: string; value: string }[] | null
  date: string | null
  isFeatured: boolean
  images: { url: string; alt: string | null }[]
}
