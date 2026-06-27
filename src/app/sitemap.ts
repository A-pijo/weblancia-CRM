import type { MetadataRoute } from "next"
import { db } from "@/lib/db"
import { getServiceCategories } from "@/lib/services/queries"

const baseUrl = "https://weblancia.ma"

const staticRoutes = [
  { url: "", priority: 1, changeFrequency: "weekly" as const },
  { url: "/work", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/services", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/about/team", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/about/mission", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/about/careers", priority: 0.6, changeFrequency: "weekly" as const },
  { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/consultation", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/start-project", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/book-call", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/insights", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/academy", priority: 0.8, changeFrequency: "weekly" as const },
  { url: "/academy/courses", priority: 0.7, changeFrequency: "weekly" as const },
  { url: "/academy/workshops", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/academy/resources", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/academy/certificates", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/academy/careers", priority: 0.6, changeFrequency: "weekly" as const },
  { url: "/legal", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/legal/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/legal/privacy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/legal/cookies", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/search", priority: 0.3, changeFrequency: "monthly" as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles, courses, resources, categories] = await Promise.all([
    db.project.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    db.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, publishedAt: true } }).catch(() => []),
    db.course.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    db.resource.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    getServiceCategories().catch(() => []),
  ])

  const projectRoutes = projects.map((item) => ({
    url: `${baseUrl}/work/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const articleRoutes = articles.map((item) => ({
    url: `${baseUrl}/insights/${item.slug}`,
    lastModified: item.publishedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const courseRoutes = courses.map((item) => ({
    url: `${baseUrl}/academy/courses/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const resourceRoutes = resources.map((item) => ({
    url: `${baseUrl}/academy/resources/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  const serviceRoutes = categories.flatMap((cat) => [
    {
      url: `${baseUrl}/services/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ])

  const staticMapped = staticRoutes.map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }))

  return [
    ...staticMapped,
    ...projectRoutes,
    ...articleRoutes,
    ...courseRoutes,
    ...resourceRoutes,
    ...serviceRoutes,
  ]
}
