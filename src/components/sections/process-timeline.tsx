import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import type { ProcessStep } from "@/types/common"

interface ProcessTimelineProps {
  steps: ProcessStep[]
  title?: string
}

function ProcessTimeline({ steps, title }: ProcessTimelineProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-bg">
      <Container>
        {title && (
          <h2 className="text-h2 font-semibold text-center mb-16">{title}</h2>
        )}
        <div className="max-w-3xl mx-auto">
          {steps.map((step, index) => (
            <AnimatedReveal key={step.step} delay={index * 0.08}>
              <div className="flex gap-8 pb-12 last:pb-0 relative">
                <div className="flex flex-col items-center shrink-0">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full border-2 shrink-0 z-10",
                      index === 0
                        ? "bg-accent border-accent"
                        : "bg-bg border-border",
                    )}
                  />
                  {index < steps.length - 1 && (
                    <div className="w-[2px] flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-4">
                  <span className="text-caption text-accent font-semibold mb-1 block">
                    Step {step.step}
                  </span>
                  <h3 className="text-h4 font-semibold mb-2">{step.title}</h3>
                  <p className="text-body-sm text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export { ProcessTimeline }
