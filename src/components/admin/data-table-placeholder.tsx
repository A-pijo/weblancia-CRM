import { cn } from "@/lib/utils/cn"

interface DataTablePlaceholderProps {
  columns?: number
  rows?: number
}

export function DataTablePlaceholder({ columns = 5, rows = 6 }: DataTablePlaceholderProps) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 px-5 py-3 border-b border-admin-border/30">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={cn("h-3 rounded bg-admin-surface/60 animate-pulse", i === 0 ? "w-32" : "flex-1")}
          />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex items-center gap-4 px-5 py-3.5 border-b border-admin-border/20"
        >
          {Array.from({ length: columns }).map((_, col) => (
            <div
              key={col}
              className={cn(
                "h-3 rounded bg-admin-surface/40 animate-pulse",
                col === 0 ? "w-28" : "flex-1",
              )}
              style={{ animationDelay: `${(row + col) * 50}ms` }}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
