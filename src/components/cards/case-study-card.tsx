import { cn } from "@/lib/utils/cn"
import { Badge } from "@/components/ui/badge"
import type { WorkItem } from "@/types/work"
import Link from "next/link"

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
          <img src={item.featuredImage} alt={item.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500" />
        )}
      </div>
      <div className="p-6">
        <Badge variant="category" className="mb-3">
          {item.industry ?? "Portfolio"}
        </Badge>
        <h3 className="text-xl/7 font-semibold mb-2">{item.title}</h3>
        {topResult && (
          <p className="text-accent font-bold truncate">{topResult.value}</p>
        )}
      </div>
    </Link>
  )
}

export { CaseStudyCard }
