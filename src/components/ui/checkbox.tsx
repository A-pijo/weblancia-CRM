"use client"

import { InputHTMLAttributes, forwardRef, useId } from "react"
import { cn } from "@/lib/utils/cn"
import { Check } from "@/components/icons"

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string
  error?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, disabled, checked, id, ...props }, ref) => {
    const generatedId = useId()
    const checkboxId = id || generatedId

    return (
      <label
        htmlFor={checkboxId}
        className={cn(
          "inline-flex items-center gap-2 cursor-pointer group",
          disabled && "cursor-not-allowed",
          props.className,
        )}
      >
        <div className="relative flex items-center justify-center shrink-0">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-5 w-5 rounded-radius-sm border transition-all duration-150",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-focus-ring peer-focus-visible:ring-offset-2",
              error && !checked && "border-danger",
              !error && !disabled && "border-border group-hover:border-border-hover",
              checked && "bg-accent border-accent",
              disabled && "bg-bg-secondary border-border",
            )}
          >
            <Check
              size={20}
              weight="bold"
              className={cn(
                "h-full w-full p-0.5 text-white transition-transform duration-150",
                checked ? "scale-100" : "scale-0",
              )}
              aria-hidden="true"
            />
          </div>
        </div>
        <span
          className={cn(
            "text-[16px]/6 text-text-primary select-none",
            disabled && "text-text-tertiary",
          )}
        >
          {label}
        </span>
      </label>
    )
  },
)

Checkbox.displayName = "Checkbox"

export { Checkbox }
