import { PageHeader } from "@/components/admin/page-header"
import { SectionCard } from "@/components/admin/section-card"
import { prisma } from "@/lib/database/prisma"

function missingTags(m: { description: string | null; ogImage: string | null } | null): string[] {
  if (!m) return ["Meta Description", "OG Image"]
  const tags: string[] = []
  if (!m.description) tags.push("Meta Description")
  if (!m.ogImage) tags.push("OG Image")
  return tags
}

const contentGroups = [
  { key: "services", label: "Services", editPrefix: "/admin/services/" },
  { key: "projects", label: "Projects", editPrefix: "/admin/work/" },
  { key: "posts", label: "Blog Posts", editPrefix: "/admin/blog/" },
  { key: "courses", label: "Courses", editPrefix: "/admin/academy/courses/" },
  { key: "resources", label: "Resources", editPrefix: "/admin/academy/resources/" },
] as const

export default async function SEOCenterPage() {
  const [services, projects, posts, courses, resources] = await Promise.all([
    prisma.service.findMany({ where: { isActive: true }, include: { seoMetadata: true }, orderBy: { title: "asc" } }),
    prisma.project.findMany({ where: { isActive: true }, include: { seoMetadata: true }, orderBy: { title: "asc" } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, include: { seoMetadata: true }, orderBy: { title: "asc" } }),
    prisma.course.findMany({ where: { isPublished: true }, include: { seoMetadata: true }, orderBy: { title: "asc" } }),
    prisma.resource.findMany({ where: { isPublished: true }, include: { seoMetadata: true }, orderBy: { title: "asc" } }),
  ])

  const allData = { services, projects, posts, courses, resources } as Record<string, { id: number; title: string; seoMetadata: { description: string | null; ogImage: string | null } | null }[]>

  let totalPages = 0
  let totalWithSeo = 0
  const needsAttention: { id: number; title: string; type: string; missing: string[]; editUrl: string }[] = []

  for (const group of contentGroups) {
    const items = allData[group.key]
    totalPages += items.length
    for (const item of items) {
      const meta = item.seoMetadata
      const tags = missingTags(meta)
      if (tags.length === 0) {
        totalWithSeo++
      } else {
        needsAttention.push({
          id: item.id,
          title: item.title,
          type: group.label,
          missing: tags,
          editUrl: `${group.editPrefix}${item.id}`,
        })
      }
    }
  }

  const missingSeo = totalPages - totalWithSeo
  const recentItems = needsAttention.slice(0, 20)

  const statIcons = [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z",
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="SEO Center" description="Monitor and manage SEO metadata across your site" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Pages", value: totalPages },
          { label: "With SEO", value: totalWithSeo },
          { label: "Missing SEO", value: missingSeo },
        ].map((stat, i) => (
          <div key={stat.label} className="bg-admin-surface border border-admin-border rounded-xl p-5 hover:border-admin-accent/20 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-admin-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-admin-accent/10 flex items-center justify-center text-admin-accent mb-3 group-hover:bg-admin-accent/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d={statIcons[i]} />
                </svg>
              </div>
              <p className="text-2xl font-bold text-admin-text-primary tracking-tight">{stat.value}</p>
              <p className="text-sm text-admin-text-secondary mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {contentGroups.map((group) => {
          const items = allData[group.key]
          const withSeo = items.filter((i) => i.seoMetadata?.description && i.seoMetadata?.ogImage).length
          const missingCount = items.length - withSeo
          const missingItems = items.filter((i) => !i.seoMetadata?.description || !i.seoMetadata?.ogImage)
          return (
            <SectionCard
              key={group.key}
              title={group.label}
              description={`${items.length} total · ${withSeo} with SEO · ${missingCount} missing`}
            >
              {missingCount > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-[10px] text-admin-text-tertiary font-medium uppercase tracking-wider mb-2">Missing Metadata</p>
                  {missingItems.slice(0, 5).map((item) => {
                    const tags = missingTags(item.seoMetadata)
                    return (
                      <a
                        key={item.id}
                        href={`${group.editPrefix}${item.id}`}
                        className="flex items-center justify-between py-2 px-3 rounded-lg bg-admin-bg-tertiary/50 hover:bg-admin-bg-tertiary transition-colors group/item"
                      >
                        <span className="text-sm text-admin-text-primary group-hover/item:text-admin-accent transition-colors truncate">{item.title}</span>
                        <div className="flex gap-1.5 shrink-0 ml-3">
                          {tags.map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-admin-accent/10 text-admin-accent whitespace-nowrap">{t}</span>
                          ))}
                        </div>
                      </a>
                    )
                  })}
                  {missingCount > 5 && (
                    <p className="text-xs text-admin-text-tertiary text-center pt-1">+{missingCount - 5} more items</p>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-admin-success">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  All items have SEO metadata
                </div>
              )}
            </SectionCard>
          )
        })}
      </div>

      {recentItems.length > 0 && (
        <SectionCard title="Pages Needing SEO Attention" description="Items missing meta descriptions or OG images">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-admin-text-secondary text-xs uppercase tracking-wider border-b border-admin-border/30">
                  <th className="pb-2.5 pr-4 font-medium">Title</th>
                  <th className="pb-2.5 pr-4 font-medium">Type</th>
                  <th className="pb-2.5 pr-4 font-medium">Missing</th>
                  <th className="pb-2.5 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentItems.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="border-b border-admin-border/20 last:border-0">
                    <td className="py-2.5 pr-4 text-admin-text-primary max-w-[200px] truncate">{item.title}</td>
                    <td className="py-2.5 pr-4 text-admin-text-secondary">{item.type}</td>
                    <td className="py-2.5 pr-4">
                      <div className="flex gap-1.5 flex-wrap">
                        {item.missing.map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-admin-accent/10 text-admin-accent">{t}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <a href={item.editUrl} className="text-admin-accent hover:text-admin-accent/80 text-xs font-medium transition-colors">Edit &rarr;</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  )
}
