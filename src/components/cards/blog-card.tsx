import { cn } from "@/lib/utils/cn"
import { Badge } from "@/components/ui/badge"
import type { Insight } from "@/types/insight"
import { CalendarBlank, Clock, User } from "@/components/icons"

interface BlogCardProps {
  post: Insight
}

function BlogCard({ post }: BlogCardProps) {
  const hasImage = !!post.image

  return (
    <article
      className={cn(
        "bg-surface border border-border rounded-radius-lg overflow-hidden",
        "transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg",
        "group",
      )}
    >
      {hasImage ? (
        <div className="relative aspect-video overflow-hidden bg-zinc-100" />
      ) : (
        <div className="relative aspect-video bg-accent-light flex items-center justify-center">
          <span className="text-4xl font-bold text-accent">{post.category.charAt(0).toUpperCase()}</span>
        </div>
      )}
      <div className="p-6">
        <Badge variant="category" className="mb-3">
          {post.category}
        </Badge>
        <h3 className="text-xl/7 font-semibold line-clamp-2 mb-2">{post.title}</h3>
        <p className="text-body-sm text-text-secondary line-clamp-2 mb-4">
          {post.description}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-caption text-text-tertiary">
          <span className="inline-flex items-center gap-1">
            <User size={14} aria-hidden="true" />
            {post.author}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarBlank size={14} aria-hidden="true" />
            {post.date}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={14} aria-hidden="true" />
            {post.readTime}
          </span>
        </div>
      </div>
    </article>
  )
}

export { BlogCard }
