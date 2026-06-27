import { cn } from "@/lib/utils/cn"

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  as?: "div" | "article" | "section"
}

function Card({
  children,
  className,
  hover = false,
  as: Component = "div",
}: CardProps) {
  return (
    <Component
      className={cn(
        "bg-surface border border-border rounded-radius-lg p-6",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
    >
      {children}
    </Component>
  )
}

export { Card }
