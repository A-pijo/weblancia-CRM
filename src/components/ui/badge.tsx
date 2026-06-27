import { cn } from "@/lib/utils/cn"

const variantClasses = {
  default: "bg-accent-light text-accent",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  outline: "bg-transparent text-text-secondary border border-border",
  tech: "bg-bg-secondary text-text-secondary",
  category: "bg-bg text-text-tertiary border border-border",
  accent: "bg-accent text-white",
} as const

const sizeClasses = {
  default: "px-[10px] py-[4px] text-[12px]/4 font-medium",
  large: "px-3 py-1.5 text-[13px]/[18px] font-medium",
} as const

export interface BadgeProps {
  variant?: keyof typeof variantClasses
  size?: keyof typeof sizeClasses
  children: React.ReactNode
  className?: string
}

function Badge({ variant = "default", size = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-radius-sm font-medium",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {children}
    </span>
  )
}

export { Badge }
