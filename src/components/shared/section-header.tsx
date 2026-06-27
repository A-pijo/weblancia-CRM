import { cn } from "@/lib/utils/cn"

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  align?: "center" | "left"
}

function SectionHeader({ label, title, description, align = "center" }: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl mb-12 lg:mb-16",
        align === "center" && "mx-auto text-center",
        align === "left" && "text-left",
      )}
    >
      {label && (
        <p className="text-caption tracking-wider text-accent uppercase mb-3">
          {label}
        </p>
      )}
      <h2 className="text-h2 lg:text-[clamp(1.75rem,2.5vw,2rem)]/tight font-semibold mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-body text-text-secondary max-w-prose">
          {description}
        </p>
      )}
    </div>
  )
}

export { SectionHeader }
