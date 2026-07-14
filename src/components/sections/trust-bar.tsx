"use client"

import { cn } from "@/lib/utils/cn"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CheckCircle } from "@/components/icons"

const defaultClients = [
  "Maroc Telecom", "Attijariwafa Bank", "OCP Group", "Royal Air Maroc",
  "CIH Bank", "Marsa Maroc", "Managem", "CGI Maroc",
]

const trustSignals = [
  "8+ ans d'expérience", "50+ projets livrés", "4.9/5 satisfaction",
]

interface TrustBarProps {
  logos?: { name: string; width: number; height: number }[]
  showStats?: boolean
}

function TrustBar({ logos, showStats = true }: TrustBarProps) {
  return (
    <section className="py-12 bg-bg-secondary">
      <AnimatedReveal>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {showStats && (
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-8">
              {trustSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-1.5">
                  <CheckCircle size={16} className="text-accent shrink-0" />
                  <span className="text-body-sm text-text-secondary">{signal}</span>
                </div>
              ))}
            </div>
          )}

          <p className={cn(
            "text-caption text-text-tertiary text-center mb-6 uppercase tracking-wider font-medium",
            logos && logos.length > 0 ? "" : "sr-only",
          )}>
            Ils nous font confiance
          </p>

          {logos && logos.length > 0 ? (
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {logos.map((logo) => (
                <div
                  key={logo.name}
                  className="opacity-50 hover:opacity-70 transition-opacity duration-200"
                  style={{ height: `${Math.min(logo.height, 32)}px` }}
                >
                  <div
                    className="bg-text-tertiary rounded w-full"
                    style={{
                      maxWidth: `${Math.min(logo.width, 140)}px`,
                      width: `${logo.width}px`,
                      height: `${logo.height}px`,
                      maxHeight: "32px",
                    }}
                    aria-label={logo.name}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {defaultClients.map((name) => (
                <div
                  key={name}
                  className="h-10 flex items-center justify-center px-4 rounded-radius-md bg-surface border border-border"
                >
                  <span className="text-caption text-text-tertiary font-medium truncate">{name}</span>
                </div>
              ))}
            </div>
          )}

          <p className="text-caption text-text-tertiary text-center mt-8">
            <span className="font-semibold text-text-primary">50+ entreprises</span> nous font confiance à travers le Maroc
          </p>
        </div>
      </AnimatedReveal>
    </section>
  )
}

export { TrustBar }
