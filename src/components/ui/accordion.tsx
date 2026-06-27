"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils/cn"
import { CaretDown } from "@/components/icons"

export interface AccordionItemProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

function AccordionItem({ title, children, defaultOpen = false }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between py-5 pr-2 text-left transition-colors duration-200",
          "text-[18px]/7 font-semibold text-text-primary",
          "hover:bg-bg-secondary",
        )}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <CaretDown
          size={20}
          className={cn(
            "shrink-0 transition-all duration-300",
            isOpen ? "rotate-180 text-accent" : "text-text-tertiary",
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-300",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-[16px]/6 text-text-secondary">{children}</div>
        </div>
      </div>
    </div>
  )
}

export interface AccordionProps {
  children: ReactNode
  className?: string
}

function Accordion({ children, className }: AccordionProps) {
  return <div className={cn("border-t border-border", className)}>{children}</div>
}

export { Accordion, AccordionItem }
