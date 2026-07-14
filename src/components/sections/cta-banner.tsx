import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/shared/container"

interface CTABannerProps {
  headline: string
  subheadline?: string
  cta: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  variant?: "accent" | "subtle"
}

function CTABanner({ headline, subheadline, cta, secondaryCta, variant = "accent" }: CTABannerProps) {
  return (
    <section
      className={cn(
        "py-20 md:py-24 text-center relative overflow-hidden",
        variant === "accent" ? "bg-accent" : "bg-bg-secondary",
      )}
    >
      {variant === "accent" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0%,transparent_70%)]" aria-hidden="true" />
      )}
      <Container>
        <div className="max-w-2xl mx-auto relative">
          <h2
            className={cn(
              "text-h2 lg:text-[clamp(2rem,3vw,2.5rem)]/tight font-bold mb-4",
              variant === "accent" ? "text-white" : "text-text-primary",
            )}
          >
            {headline}
          </h2>
          {subheadline && (
            <p
              className={cn(
                "text-body-lg mb-8",
                variant === "accent" ? "text-white/80" : "text-text-secondary",
              )}
            >
              {subheadline}
            </p>
          )}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={cta.href}
              className={cn(
                "inline-flex items-center justify-center h-12 px-8 rounded-radius-md",
                "text-button font-medium transition-all duration-200",
                "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-4",
                "active:scale-[0.97]",
                variant === "accent"
                  ? "bg-white text-accent hover:bg-white/90"
                  : "bg-accent text-white hover:bg-accent-hover",
              )}
            >
              {cta.label}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={cn(
                  "inline-flex items-center justify-center h-12 px-8 rounded-radius-md",
                  "text-button font-medium transition-all duration-200",
                  "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-4",
                  "active:scale-[0.97]",
                  variant === "accent"
                    ? "border border-white/30 text-white hover:bg-white/10"
                    : "border border-accent text-accent hover:bg-accent hover:text-white",
                )}
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}

export { CTABanner }
