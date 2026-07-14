import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import { SectionHeader } from "@/components/shared/section-header"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { CaseStudyCard } from "@/components/cards/case-study-card"
import type { WorkItem } from "@/types/work"

interface FeaturedWorkProps {
  items: WorkItem[]
}

function FeaturedWork({ items }: FeaturedWorkProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-bg">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <SectionHeader
          label="Nos réalisations"
          title="Des projets qui parlent d'eux-mêmes"
          description="Chaque projet raconte une histoire de collaboration, de savoir-faire et de résultats mesurables pour nos clients."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {items.map((item, index) => (
            <AnimatedReveal key={item.slug} delay={index * 0.08}>
              <CaseStudyCard item={item} />
            </AnimatedReveal>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/work"
            className={cn(
              "inline-flex items-center justify-center h-12 px-8 rounded-radius-md",
              "border border-accent text-accent hover:bg-accent hover:text-white",
              "text-button font-medium transition-all duration-200",
              "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-4",
              "active:scale-[0.97]",
            )}
          >
            Voir tous nos projets
          </Link>
        </div>
      </div>
    </section>
  )
}

export { FeaturedWork }
