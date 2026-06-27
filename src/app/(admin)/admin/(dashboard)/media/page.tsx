import { PageHeader } from "@/components/admin/page-header"
import { SectionCard } from "@/components/admin/section-card"
import { MediaUploader } from "@/components/admin/media/media-uploader"
import { MediaListView } from "./media-list-view"
import { getMediaList } from "@/lib/media/upload"

export const dynamic = "force-dynamic"

export default async function AdminMediaPage() {
  const { items, total } = await getMediaList({ limit: 50 })

  return (
    <div className="space-y-6">
      <PageHeader title="Media" description="Upload and manage your image assets" />

      <SectionCard title="Upload" description="Supported formats: JPG, PNG, WebP, AVIF, SVG — max 10 MB">
        <MediaUploader category="general" />
      </SectionCard>

      <SectionCard
        title="All Media"
        description={`${total} file${total > 1 ? "s" : ""} total`}
      >
        <MediaListView items={JSON.parse(JSON.stringify(items))} />
      </SectionCard>
    </div>
  )
}
