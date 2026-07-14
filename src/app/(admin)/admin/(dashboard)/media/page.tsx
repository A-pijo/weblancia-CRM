import { PageHeader } from "@/components/admin/page-header"
import { SectionCard } from "@/components/admin/section-card"
import { MediaUploader } from "@/components/admin/media/media-uploader"
import { MediaListView } from "./media-list-view"
import { FolderTree } from "@/components/admin/media/folder-tree"
import { AdminErrorState } from "@/components/admin/error-state"
import { getMediaList } from "@/lib/media/upload"
import { prisma } from "@/lib/database/prisma"
import { logger } from "@/lib/logger"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function AdminMediaPage(props: PageProps) {
  try {
    const searchParams = await props.searchParams
    const folderIdParam = searchParams.folderId
    const folderId = folderIdParam ? Number(folderIdParam) : null

    const [mediaResult, folderResult] = await Promise.all([
      getMediaList({ limit: 50, folderId: folderId ?? undefined }),
      prisma.mediaFolder.findMany({
        orderBy: { name: "asc" },
        include: { _count: { select: { media: true, children: true } } },
      }),
    ])

    const folders = folderResult.map((f) => ({
      id: f.id,
      name: f.name,
      slug: f.slug,
      parentId: f.parentId,
      fileCount: (f as unknown as { _count: { media: number; children: number } })._count.media,
      childFolderCount: (f as unknown as { _count: { media: number; children: number } })._count.children,
    }))

    const currentFolder = folderId ? folders.find((f) => f.id === folderId) : null

    return (
      <div className="space-y-6">
        <PageHeader
          title={currentFolder ? `Media — ${currentFolder.name}` : "Media"}
          description="Upload and manage your image assets"
        />

        <div className="flex gap-6">
          <aside className="w-56 shrink-0 hidden lg:block">
            <div className="bg-admin-surface/30 border border-admin-border/20 rounded-xl p-3 sticky top-24">
              <FolderTree folders={folders} currentFolderId={folderId} />
            </div>
          </aside>

          <div className="flex-1 min-w-0 space-y-6">
            <SectionCard title="Upload" description="Supported formats: JPG, PNG, WebP, AVIF, SVG — max 10 MB">
              <MediaUploader category="general" folderId={folderId ?? undefined} />
            </SectionCard>

            <SectionCard
              title={currentFolder ? currentFolder.name : "All Media"}
              description={`${mediaResult.total} file${mediaResult.total > 1 ? "s" : ""} total`}
            >
              <MediaListView
                items={JSON.parse(JSON.stringify(mediaResult.items))}
                folderId={folderId}
                folders={folders}
              />
            </SectionCard>
          </div>
        </div>
      </div>
    )
  } catch (e) {
    logger.error("Failed to load media page", e, "admin")
    return (
      <div className="space-y-6">
        <PageHeader title="Media" description="Upload and manage your image assets" />
        <AdminErrorState message="Impossible de charger la médiathèque. La base de données est peut-être indisponible." />
      </div>
    )
  }
}
