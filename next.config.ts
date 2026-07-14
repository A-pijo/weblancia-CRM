import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [480, 640, 768, 1024, 1280, 1536],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ["framer-motion", "recharts"],
    useLightningcss: true,
    webpackBuildWorker: true,
  },
  staticPageGenerationTimeout: 120,
  headers: async () => [
    {
      source: "/images/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/fonts/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/:path*.(svg|ico|css|js|json)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/api/rss",
      headers: [
        { key: "Cache-Control", value: "s-maxage=3600, stale-while-revalidate=1800" },
      ],
    },
  ],
};

export default nextConfig;
