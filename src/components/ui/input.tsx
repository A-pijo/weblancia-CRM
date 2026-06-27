"use client"

import { InputHTMLAttributes, forwardRef, useId } from "react"
import { cn } from "@/lib/utils/cn"
import { WarningCircle } from "@/components/icons"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  error?: string
  success?: boolean
  icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, success, icon, id, required, disabled, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id || generatedId
    const hasError = !!error

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-caption font-medium text-text-secondary"
          >
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none [&>svg]:h-5 [&>svg]:w-5">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            className={cn(
              "w-full h-12 px-4 rounded-radius-md border text-[16px]/6 text-text-primary bg-surface placeholder:text-text-tertiary transition-all duration-200",
              "focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20",
              hasError &&
                "border-danger focus:border-danger focus:ring-danger/20",
              success &&
                !hasError &&
                "border-success focus:border-success focus:ring-success/20",
              disabled &&
                "bg-bg-secondary text-text-tertiary cursor-not-allowed",
              !hasError &&
                !success &&
                !disabled &&
                "border-border hover:border-border-hover",
              icon && "pl-10",
              className,
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...props}
          />
        </div>
        {hasError && (
          <p
            id={`${inputId}-error`}
            className="text-[13px]/[18px] text-danger flex items-center gap-1"
            role="alert"
          >
            <WarningCircle size={16} weight="fill" aria-hidden="true" />
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p id={`${inputId}-helper`} className="text-[13px]/[18px] text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export { Input }
