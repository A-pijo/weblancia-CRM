"use client"

import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { TestimonialCard } from "@/components/cards/testimonial-card"
import type { Testimonial } from "@/types/common"

interface TestimonialCarouselProps {
  items: Testimonial[]
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function TestimonialCarousel({ items }: TestimonialCarouselProps) {
  if (!items.length) return null

  if (items.length === 1) {
    const t = items[0]
    return (
      <section className="py-12 md:py-16 lg:py-24 bg-bg-secondary">
        <Container>
          <AnimatedReveal>
            <div className="max-w-3xl mx-auto text-center">
              <div className="w-20 h-20 rounded-full bg-accent-light flex items-center justify-center mx-auto mb-6">
                <span className="text-xl font-semibold text-accent">
                  {getInitials(t.author)}
                </span>
              </div>
              <blockquote className="text-h4 lg:text-[clamp(1.25rem,2vw,1.5rem)]/relaxed font-serif italic mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p className="text-body font-semibold">{t.author}</p>
              <p className="text-caption text-text-tertiary">
                {t.role}, {t.company}
              </p>
              {t.result && (
                <p className="text-accent font-bold mt-4">{t.result}</p>
              )}
            </div>
          </AnimatedReveal>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-bg-secondary">
      <Container>
        <AnimatedReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <TestimonialCard key={index} testimonial={item} />
            ))}
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  )
}

export { TestimonialCarousel }
