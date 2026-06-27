"use client"

import { useState } from "react"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { SectionWrapper } from "@/components/shared/section-wrapper"
import { Container } from "@/components/shared/container"
import { CaseStudyCard } from "@/components/cards/case-study-card"
import { cn } from "@/lib/utils/cn"
import type { WorkItem } from "@/types/work"

interface WorkFilterGridProps {
  items: WorkItem[]
  industries: string[]
}

function WorkFilterGrid({ items, industries }: WorkFilterGridProps) {
  const [activeFilter, setActiveFilter] = useState<string | null>(null)

  const filteredItems =
    activeFilter === null
      ? items
      : items.filter((item) => item.industry === activeFilter)

  return (
    <SectionWrapper bgSecondary>
      <Container>
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveFilter(null)}
            className={cn(
              "px-4 py-2 rounded-radius-md text-button font-medium transition-all duration-200",
              activeFilter === null
                ? "bg-accent text-white"
                : "bg-surface text-text-secondary border border-border hover:border-accent hover:text-accent",
            )}
          >
            Tous
          </button>
          {industries.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveFilter(ind)}
              className={cn(
                "px-4 py-2 rounded-radius-md text-button font-medium transition-all duration-200",
                activeFilter === ind
                  ? "bg-accent text-white"
                  : "bg-surface text-text-secondary border border-border hover:border-accent hover:text-accent",
              )}
            >
              {ind}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <AnimatedReveal key={item.slug} delay={index * 0.08}>
              <CaseStudyCard item={item} />
            </AnimatedReveal>
          ))}
        </div>
      </Container>
    </SectionWrapper>
  )
}

export { WorkFilterGrid }
