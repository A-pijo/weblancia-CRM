import Link from "next/link"
import { cn } from "@/lib/utils/cn"
import { SectionHeader } from "@/components/shared/section-header"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import { ServiceCard } from "@/components/cards/service-card"
import type { Service } from "@/types/service"

interface ServicesGridProps {
  items: Service[]
}

function ServicesGrid({ items }: ServicesGridProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <SectionHeader
          title="Our Services"
          description="From strategy to execution, we help businesses build a powerful digital presence."
          align="center"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {items.map((service, index) => (
            <AnimatedReveal key={service.slug} delay={index * 0.08}>
              <ServiceCard service={service} />
            </AnimatedReveal>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/services"
            className={cn(
              "inline-flex items-center gap-2 text-accent hover:text-accent-hover",
              "text-button font-medium transition-colors duration-200",
            )}
          >
            Explore all services &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}

export { ServicesGrid }
