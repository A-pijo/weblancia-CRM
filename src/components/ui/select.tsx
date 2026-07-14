"use client"

import { SelectHTMLAttributes, forwardRef, useId } from "react"
import { cn } from "@/lib/utils/cn"
import { CaretDown } from "@/components/icons"

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, placeholder, id, required, disabled, ...props }, ref) => {
    const generatedId = useId()
    const selectId = id || generatedId
    const hasError = !!error

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-caption font-medium text-text-secondary"
          >
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            className={cn(
              "w-full h-12 pl-4 pr-10 rounded-radius-md border text-[16px]/6 text-text-primary bg-surface transition-all duration-200 appearance-none cursor-pointer",
              "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20",
              hasError &&
                "border-danger focus:border-danger focus:ring-danger/20",
              disabled &&
                "bg-bg-secondary text-text-tertiary cursor-not-allowed",
              !hasError &&
                !disabled &&
                "border-border hover:border-border-hover",
              !props.value && "text-text-tertiary",
              className,
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${selectId}-error`
                : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
            <CaretDown size={20} aria-hidden="true" />
          </div>
        </div>
        {hasError && (
          <p id={`${selectId}-error`} className="text-[13px]/[18px] text-danger" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = "Select"

export { Select }
