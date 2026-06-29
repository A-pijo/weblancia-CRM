import { getPublishedPosts } from "@/lib/blog/queries"
import { siteConfig } from "@/lib/constants/site"

export async function GET() {
  const posts = await getPublishedPosts(50)
  const siteUrl = siteConfig.url

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/insights/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/insights/${post.slug}</guid>
      <description><![CDATA[${post.excerpt ?? ""}]]></description>
      <pubDate>${post.publishedAt ? new Date(post.publishedAt).toUTCString() : ""}</pubDate>
      <author>${post.author ?? "Weblancia"}</author>
      ${post.tags ? (post.tags as string[]).map((tag) => `<category>${tag}</category>`).join("\n") : ""}
    </item>`,
    )
    .join("\n")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Weblancia Insights</title>
    <link>${siteUrl}/insights</link>
    <description>Actualités web, marketing digital et conseils SEO pour les entreprises au Maroc</description>
    <language>fr</language>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  })
}
