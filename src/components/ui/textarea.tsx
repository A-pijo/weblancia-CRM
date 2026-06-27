"use client"

import { TextareaHTMLAttributes, forwardRef, useId } from "react"
import { cn } from "@/lib/utils/cn"
import { WarningCircle } from "@/components/icons"

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  helperText?: string
  error?: string
  success?: boolean
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, helperText, error, success, id, required, disabled, rows = 4, ...props }, ref) => {
    const generatedId = useId()
    const textareaId = id || generatedId
    const hasError = !!error

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-caption font-medium text-text-secondary"
          >
            {label}
            {required && <span className="ml-0.5 text-danger">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          rows={rows}
          className={cn(
            "w-full px-4 py-3 rounded-radius-md border text-[16px]/6 text-text-primary bg-surface placeholder:text-text-tertiary transition-all duration-200 resize-y",
            "min-h-[6rem] max-h-48",
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
            className,
          )}
          aria-invalid={hasError}
          aria-describedby={
            hasError
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          {...props}
        />
        {hasError && (
          <p
            id={`${textareaId}-error`}
            className="text-[13px]/[18px] text-danger flex items-center gap-1"
            role="alert"
          >
            <WarningCircle size={16} weight="fill" aria-hidden="true" />
            {error}
          </p>
        )}
        {!hasError && helperText && (
          <p id={`${textareaId}-helper`} className="text-[13px]/[18px] text-text-tertiary">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Textarea.displayName = "Textarea"

export { Textarea }
