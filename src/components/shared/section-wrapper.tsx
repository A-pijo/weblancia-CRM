import { cn } from "@/lib/utils/cn"

interface SectionWrapperProps {
  children: React.ReactNode
  className?: string
  bgSecondary?: boolean
  id?: string
}

function SectionWrapper({ children, className, bgSecondary, id }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-12 md:py-16 lg:py-24",
        bgSecondary ? "bg-bg-secondary" : "bg-bg",
        className,
      )}
    >
      {children}
    </section>
  )
}

export { SectionWrapper }
