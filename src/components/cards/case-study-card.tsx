import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import { Badge } from "@/components/ui/badge"
import type { WorkItem } from "@/types/work"

interface CaseStudyCardProps {
  item: WorkItem
}

function CaseStudyCard({ item }: CaseStudyCardProps) {
  const topResult = item.results?.[0]

  return (
    <Link
      href={`/work/${item.slug}`}
      className={cn(
        "block bg-surface rounded-radius-lg overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        "group",
      )}
    >
      <div className="relative aspect-video overflow-hidden rounded-radius-md bg-bg-secondary">
        {item.featuredImage && (
          <Image src={item.featuredImage} alt="" aria-hidden="true" fill className="object-cover group-hover:scale-[1.03] transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
        )}
      </div>
      <div className="p-6">
        <Badge variant="category" className="mb-3">
          {item.industry ?? "Portfolio"}
        </Badge>
        <h2 className="text-h2 font-semibold mb-2">{item.title}</h2>
        {topResult && (
          <p className="text-accent font-bold truncate">{topResult.value}</p>
        )}
      </div>
    </Link>
  )
}

export { CaseStudyCard }
