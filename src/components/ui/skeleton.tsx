import { cn } from "@/lib/utils/cn"

export interface SkeletonProps {
  className?: string
  width?: string | number
  height?: string | number
  rounded?: "sm" | "md" | "lg" | "xl" | "full"
}

const roundedClasses = {
  sm: "rounded-radius-sm",
  md: "rounded-radius-md",
  lg: "rounded-radius-lg",
  xl: "rounded-radius-xl",
  full: "rounded-full",
}

function Skeleton({ className, width, height, rounded = "md" }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-border",
        roundedClasses[rounded],
        className,
      )}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
      aria-hidden="true"
    />
  )
}

export { Skeleton }
