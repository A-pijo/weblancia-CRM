"use client"

import { cn } from "@/lib/utils/cn"
import { AnimatedReveal } from "@/components/shared/animated-reveal"

interface TrustBarProps {
  logos?: { name: string; width: number; height: number }[]
}

function TrustBar({ logos }: TrustBarProps) {
  return (
    <section className="py-12 bg-bg-secondary">
      <AnimatedReveal>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {logos && logos.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {logos.map((logo) => (
                <div
                  key={logo.name}
                  className="opacity-50 hover:opacity-70 transition-opacity duration-200 max-w-[140px]"
                  style={{ height: `${Math.min(logo.height, 32)}px` }}
                >
                  <div
                    className="bg-text-tertiary rounded w-full"
                    style={{
                      maxWidth: `${Math.min(logo.width, 140)}px`,
                      height: `${logo.height}px`,
                      maxHeight: "32px",
                    }}
                    aria-label={logo.name}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-body text-text-secondary text-center">
              Trusted by <span className="font-semibold text-text-primary">50+ businesses</span> across Morocco
            </p>
          )}
        </div>
      </AnimatedReveal>
    </section>
  )
}

export { TrustBar }
