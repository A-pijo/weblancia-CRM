import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/shared/container"

interface CTABannerProps {
  headline: string
  subheadline?: string
  cta: { label: string; href: string }
  variant?: "accent" | "subtle"
}

function CTABanner({ headline, subheadline, cta, variant = "accent" }: CTABannerProps) {
  return (
    <section
      className={cn(
        "py-20 md:py-24 text-center",
        variant === "accent" ? "bg-accent" : "bg-bg-secondary",
      )}
    >
      <Container>
        <div className="max-w-2xl mx-auto">
          <h2
            className={cn(
              "text-h1 lg:text-[clamp(2rem,3vw,2.5rem)]/tight font-bold mb-4",
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
        </div>
      </Container>
    </section>
  )
}

export { CTABanner }
