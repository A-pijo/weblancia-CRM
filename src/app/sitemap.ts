import type { MetadataRoute } from "next"
import { prisma } from "@/lib/database/prisma"
import { siteConfig } from "@/lib/constants/site"
import { cities } from "@/lib/data/cities"
import { industries } from "@/lib/data/industries"
import { problems } from "@/lib/data/problems"
import { technologies } from "@/lib/data/technologies"
import { platforms } from "@/lib/data/platforms"

const baseUrl = siteConfig.url

const staticRoutes = [
  { url: "", priority: 1, changeFrequency: "weekly" as const },
  { url: "/work", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/services", priority: 0.9, changeFrequency: "weekly" as const },
  { url: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/about/team", priority: 0.6, changeFrequency: "monthly" as const },
  {   url: "/about/mission", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/about/press", priority: 0.4, changeFrequency: "yearly" as const },
  { url: "/about/careers", priority: 0.6, changeFrequency: "weekly" as const },
  { url: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/consultation", priority: 0.7, changeFrequency: "monthly" as const },
  { url: "/consultation/strategie-digitale", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/consultation/site-ecommerce", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/consultation/seo-marketing", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/consultation/audit-performance", priority: 0.6, changeFrequency: "monthly" as const },
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
  { url: "/legal/editorial-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/legal/correction-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/legal/fact-checking", priority: 0.3, changeFrequency: "yearly" as const },
  { url: "/author", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/author/yassine-el-khazouni", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/author/sara-benali", priority: 0.5, changeFrequency: "monthly" as const },
  { url: "/search", priority: 0.3, changeFrequency: "monthly" as const },
  { url: "/register", priority: 0.3, changeFrequency: "yearly" as const },
  {   url: "/sitemap", priority: 0.6, changeFrequency: "monthly" as const },
  ...cities.flatMap((city) => [
    { url: `/ville/${city.slug}/seo`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `/ville/${city.slug}/web-development`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `/ville/${city.slug}/digital-marketing`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `/ville/${city.slug}/branding-design`, priority: 0.5, changeFrequency: "monthly" as const },
  ]),
  ...industries.flatMap((industry) => [
    { url: `/industrie/${industry.slug}/seo`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `/industrie/${industry.slug}/web-development`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `/industrie/${industry.slug}/digital-marketing`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `/industrie/${industry.slug}/branding-design`, priority: 0.5, changeFrequency: "monthly" as const },
  ]),
  ...problems.flatMap((p) => [
    { url: `/probleme/${p.slug}/seo`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `/probleme/${p.slug}/web-development`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `/probleme/${p.slug}/digital-marketing`, priority: 0.5, changeFrequency: "monthly" as const },
    { url: `/probleme/${p.slug}/branding-design`, priority: 0.5, changeFrequency: "monthly" as const },
  ]),
  ...technologies.flatMap((t) => [
    { url: `/technologie/${t.slug}/seo`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `/technologie/${t.slug}/web-development`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `/technologie/${t.slug}/digital-marketing`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `/technologie/${t.slug}/branding-design`, priority: 0.4, changeFrequency: "monthly" as const },
  ]),
  ...platforms.flatMap((p) => [
    { url: `/plateforme/${p.slug}/seo`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `/plateforme/${p.slug}/web-development`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `/plateforme/${p.slug}/digital-marketing`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `/plateforme/${p.slug}/branding-design`, priority: 0.4, changeFrequency: "monthly" as const },
  ]),
  { url: "/consultation/refonte-site", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/consultation/marketing-digital", priority: 0.6, changeFrequency: "monthly" as const },
  { url: "/consultation/transformation-digitale", priority: 0.6, changeFrequency: "monthly" as const },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles, courses, workshops, resources, certificates, categories, services] = await Promise.all([
    prisma.project.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, publishedAt: true, updatedAt: true } }).catch(() => []),
    prisma.course.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.workshop.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.resource.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.certificate.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
    prisma.serviceCategory.findMany({ orderBy: { displayOrder: "asc" } }).catch(() => []),
    prisma.service.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }).catch(() => []),
  ])

  const projectRoutes = projects.map((item) => ({
    url: `${baseUrl}/work/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

  const articleRoutes = articles.map((item) => ({
    url: `${baseUrl}/insights/${item.slug}`,
    lastModified: item.publishedAt ?? item.updatedAt ?? new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const courseRoutes = courses.map((item) => ({
    url: `${baseUrl}/academy/courses/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  const workshopRoutes = workshops.map((item) => ({
    url: `${baseUrl}/academy/workshops/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  const resourceRoutes = resources.map((item) => ({
    url: `${baseUrl}/academy/resources/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  const certificateRoutes = certificates.map((item) => ({
    url: `${baseUrl}/academy/certificates/${item.slug}`,
    lastModified: item.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }))

  const serviceCategoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/services/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const serviceDetailRoutes = services.map((svc) => ({
    url: `${baseUrl}/services/${svc.slug}`,
    lastModified: svc.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }))

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
    ...workshopRoutes,
    ...resourceRoutes,
    ...certificateRoutes,
    ...serviceCategoryRoutes,
    ...serviceDetailRoutes,
  ]
}
