import { NextResponse } from "next/server"
import { prisma } from "@/lib/database/prisma"
import { siteConfig } from "@/lib/constants/site"

export async function GET() {
  const baseUrl = siteConfig.url

  const [projects, blogPosts, courses] = await Promise.all([
    prisma.project.findMany({ where: { isActive: true }, select: { slug: true, featuredImage: true, title: true } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, featuredImage: true, title: true } }),
    prisma.course.findMany({ select: { slug: true, thumbnail: true, title: true } }),
  ])

  const images = [
    ...projects.filter((p) => p.featuredImage).map((p) => ({ loc: `${baseUrl}/work/${p.slug}`, image: `${baseUrl}${p.featuredImage}`, title: p.title })),
    ...blogPosts.filter((p) => p.featuredImage).map((p) => ({ loc: `${baseUrl}/insights/${p.slug}`, image: `${baseUrl}${p.featuredImage}`, title: p.title })),
    ...courses.filter((c) => c.thumbnail).map((c) => ({ loc: `${baseUrl}/academy/courses/${c.slug}`, image: `${baseUrl}${c.thumbnail}`, title: c.title })),
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  ${images
    .map(
      (item) => `  <url>
    <loc>${item.loc}</loc>
    <image:image>
      <image:loc>${item.image}</image:loc>
      <image:title><![CDATA[${item.title}]]></image:title>
    </image:image>
  </url>`
    )
    .join("\n")}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}
