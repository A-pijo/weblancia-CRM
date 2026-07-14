"use client"

import { useState } from "react"
import { cn } from "@/lib/utils/cn"
import { getInitials } from "@/lib/utils/string"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { TestimonialCard } from "@/components/cards/testimonial-card"
import { CaretRight } from "@/components/icons"
import type { Testimonial } from "@/types/common"

interface TestimonialCarouselProps {
  items: Testimonial[]
}

function TestimonialCarousel({ items }: TestimonialCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!items.length) return null

  const showNav = items.length > 3

  function next() {
    setActiveIndex((prev) => (prev + 1 >= items.length ? 0 : prev + 1))
  }

  function prev() {
    setActiveIndex((prev) => (prev - 1 < 0 ? items.length - 1 : prev - 1))
  }

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
          {showNav ? (
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                  >
                    {items.map((item, index) => (
                      <div key={index} className="w-full shrink-0 px-4">
                        <TestimonialCard testimonial={item} />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:border-accent transition-colors"
                  aria-label="Témoignage précédent"
                >
                  <CaretRight size={16} className="rotate-180" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center hover:border-accent transition-colors"
                  aria-label="Témoignage suivant"
                >
                  <CaretRight size={16} />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 mt-8" role="tablist" aria-label="Sélection du témoignage">
                {items.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={`Témoignage ${index + 1}`}
                    onClick={() => setActiveIndex(index)}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-300",
                      index === activeIndex
                        ? "bg-accent w-6"
                        : "bg-text-tertiary/30 hover:bg-text-tertiary/50",
                    )}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <TestimonialCard key={index} testimonial={item} />
              ))}
            </div>
          )}
        </AnimatedReveal>
      </Container>
    </section>
  )
}

export { TestimonialCarousel }
