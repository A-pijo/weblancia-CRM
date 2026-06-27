import { cn } from "@/lib/utils/cn"

interface ContainerProps {
  children: React.ReactNode
  className?: string
  as?: "div" | "section" | "article"
}

function Container({ children, className, as: Component = "div" }: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12",
        className,
      )}
    >
      {children}
    </Component>
  )
}

export { Container }
