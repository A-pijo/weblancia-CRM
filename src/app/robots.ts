import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/constants/site"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/images/", "/*.jpg", "/*.png", "/*.webp", "/*.avif"],
      },
      {
        userAgent: "Googlebot-Video",
        allow: "/videos/",
      },
      {
        userAgent: "Googlebot-News",
        allow: "/insights/",
      },

    ],
    sitemap: [`${baseUrl}/sitemap.xml`, `${baseUrl}/api/sitemaps/images`],
  }
}
