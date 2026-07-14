import { cn } from "@/lib/utils/cn"
import {
  Code,
  Palette,
  DeviceMobile,
  ShoppingCart,
  PenNib,
  Globe,
  Gear,
  Lightning,
  BookOpen,
  ChartBar,
  Megaphone,
  Camera,
  type IconProps,
} from "@/components/icons"
import type { Service } from "@/types/service"
import Link from "next/link"

const iconMap: Record<string, React.ComponentType<IconProps>> = {
  Code,
  Palette,
  DeviceMobile,
  ShoppingCart,
  PenNib,
  Globe,
  Gear,
  Lightning,
  BookOpen,
  ChartBar,
  Megaphone,
  Camera,
}

interface ServiceCardProps {
  service: Service
}

function ServiceCard({ service }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Code

  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group block bg-surface border border-border rounded-radius-lg p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg",
        "flex flex-col relative overflow-hidden",
      )}
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full -mr-8 -mt-8 transition-transform duration-300 group-hover:scale-150" />
      <div className="relative">
        <div className="w-12 h-12 rounded-radius-md bg-accent-light flex items-center justify-center mb-4">
          <Icon size={24} className="text-accent shrink-0" aria-hidden="true" />
        </div>
        <h3 className="text-xl/7 font-semibold mb-2 group-hover:text-accent transition-colors">{service.title}</h3>
        <p className="text-body-sm text-text-secondary line-clamp-2 mb-4">
          {service.description}
        </p>
      </div>
      <div className="mt-auto relative">
        <span className="inline-flex items-center gap-1.5 text-accent group-hover:text-accent-hover text-button font-medium transition-all duration-200 group-hover:gap-2.5">
          En savoir plus
          <span aria-hidden="true" className="text-lg leading-none transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
        </span>
      </div>
    </Link>
  )
}

export { ServiceCard }
