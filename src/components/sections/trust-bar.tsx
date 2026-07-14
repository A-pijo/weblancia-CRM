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
            <>
              <p className="text-caption text-text-tertiary text-center mb-8 uppercase tracking-wider font-medium">
                Ils nous font confiance
              </p>
              <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                {logos.map((logo) => (
                  <div
                    key={logo.name}
                    className="opacity-50 hover:opacity-70 transition-opacity duration-200"
                    style={{ height: `${Math.min(logo.height, 32)}px` }}
                  >
                    <div
                      className="bg-text-tertiary rounded"
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
            </>
          ) : (
            <p className="text-body text-text-secondary text-center">
              Trusted by growing businesses
            </p>
          )}
        </div>
      </AnimatedReveal>
    </section>
  )
}

export { TrustBar }
