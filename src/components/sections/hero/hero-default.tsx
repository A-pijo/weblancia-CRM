"use client"

import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import { AnimatedReveal } from "@/components/shared/animated-reveal"

interface HeroDefaultProps {
  headline: string
  subheadline: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  align?: "left" | "center"
}

function HeroDefault({
  headline,
  subheadline,
  primaryCta,
  secondaryCta,
  align = "center",
}: HeroDefaultProps) {
  return (
    <section
      className={cn(
        "pt-24 md:pt-32 pb-16 md:pb-24 bg-bg",
        align === "center" ? "text-center" : "text-left",
      )}
    >
      <AnimatedReveal>
        <div
          className={cn(
            "max-w-7xl mx-auto px-5 sm:px-8 lg:px-12",
            align === "center" && "max-w-4xl",
          )}
        >
          <h1
            className={cn(
              "font-serif font-bold text-hero tracking-tight text-text-primary",
              "text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1]",
              "mb-6",
            )}
          >
            {headline}
          </h1>
          <p
            className={cn(
              "text-body-lg text-text-secondary max-w-2xl",
              align === "center" && "mx-auto",
            )}
          >
            {subheadline}
          </p>
          {(primaryCta || secondaryCta) && (
            <div
              className={cn(
                "flex flex-col sm:flex-row gap-4 mt-8",
                align === "center" && "justify-center",
              )}
            >
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className={cn(
                    "inline-flex items-center justify-center h-12 px-6 rounded-radius-md",
                    "bg-accent text-white hover:bg-accent-hover",
                    "text-button font-medium transition-all duration-200",
                    "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-4",
                    "active:scale-[0.97]",
                  )}
                >
                  {primaryCta.label}
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className={cn(
                    "inline-flex items-center justify-center h-12 px-6 rounded-radius-md",
                    "border border-border bg-transparent text-text-primary",
                    "hover:border-accent hover:text-accent",
                    "text-button font-medium transition-all duration-200",
                    "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-4",
                    "active:scale-[0.97]",
                  )}
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </AnimatedReveal>
    </section>
  )
}

export { HeroDefault }
