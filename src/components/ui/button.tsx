"use client"

import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils/cn"

const variantClasses = {
  primary:
    "bg-accent text-white hover:bg-accent-hover active:bg-accent-hover/90 disabled:bg-border disabled:text-text-tertiary",
  secondary:
    "border border-border bg-transparent text-text-primary hover:border-accent hover:text-accent active:border-accent active:bg-accent-light active:text-accent disabled:border-border disabled:text-text-tertiary",
  ghost:
    "bg-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary active:bg-border active:text-text-primary disabled:text-text-tertiary",
  text:
    "bg-transparent text-accent hover:text-accent-hover hover:underline active:text-accent-hover disabled:text-text-tertiary disabled:no-underline",
}

const sizeClasses = {
  lg: "h-14 px-8 gap-2 text-[17px]/6 font-semibold",
  default: "h-12 px-6 gap-2 text-button",
  sm: "h-10 px-5 gap-1.5 text-[13px]/4 font-medium",
  xs: "h-8 px-4 gap-1 text-xs leading-4 font-medium",
}

const iconSizeClasses = {
  lg: "h-6 w-6",
  default: "h-5 w-5",
  sm: "h-[18px] w-[18px]",
  xs: "h-4 w-4",
}

const iconOnlySizeClasses = {
  lg: "h-14 w-14",
  default: "h-12 w-12",
  sm: "h-10 w-10",
  xs: "h-8 w-8",
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variantClasses
  size?: keyof typeof sizeClasses
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  loading?: boolean
}

const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn("animate-spin", className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "default",
      iconBefore,
      iconAfter,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading
    const isIconOnly = Boolean(!children && (iconBefore || iconAfter))

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-radius-md font-medium transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-4",
          "active:scale-[0.97] disabled:pointer-events-none",
          variantClasses[variant],
          isIconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
          className,
        )}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <Spinner className={iconSizeClasses[size]} />
        ) : (
          <>
            {iconBefore && (
              <span className={cn("shrink-0", iconSizeClasses[size])}>{iconBefore}</span>
            )}
            {children && <span>{children}</span>}
            {iconAfter && (
              <span className={cn("shrink-0", iconSizeClasses[size])}>{iconAfter}</span>
            )}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = "Button"

export { Button }
