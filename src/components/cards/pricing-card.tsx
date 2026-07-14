import { cn } from "@/lib/utils/cn"
import { Badge } from "@/components/ui/badge"
import { Check } from "@/components/icons"
import Link from "next/link"

interface PricingTier {
  name: string
  price: string
  description: string
  features: string[]
  cta: string
  featured?: boolean
  href: string
}

interface PricingCardProps {
  tier: PricingTier
}

function PricingCard({ tier }: PricingCardProps) {
  return (
    <div
      className={cn(
        "bg-surface border rounded-radius-xl p-6 flex flex-col relative",
        "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        tier.featured ? "border-accent ring-1 ring-accent" : "border-border",
      )}
    >
      {tier.featured && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
          Most popular
        </Badge>
      )}
      <div className="mb-6">
        <h3 className="text-h3 mb-2">{tier.name}</h3>
        <p className="text-display mb-1">{tier.price}</p>
        <p className="text-body-sm text-text-secondary">{tier.description}</p>
      </div>
      <ul className="space-y-3 mb-8 flex-1">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-body-sm">
            <Check size={18} className="text-accent shrink-0 mt-0.5" aria-hidden="true" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Link
        href={tier.href}
        className={cn(
          "inline-flex items-center justify-center rounded-radius-md font-medium transition-all duration-200",
          "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-4",
          "active:scale-[0.97]",
          "h-12 px-6 gap-2 text-button w-full",
          tier.featured
            ? "bg-accent text-white hover:bg-accent-hover"
            : "border border-border bg-transparent text-text-primary hover:border-accent hover:text-accent",
        )}
      >
        {tier.cta}
      </Link>
    </div>
  )
}

export { PricingCard }
