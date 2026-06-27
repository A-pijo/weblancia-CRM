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
    <div
      className={cn(
        "group bg-surface border border-border rounded-radius-lg p-6",
        "transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-lg",
        "flex flex-col",
      )}
    >
      <Icon size={40} className="text-accent mb-4 shrink-0" aria-hidden="true" />
      <h3 className="text-xl/7 font-semibold mb-2">{service.title}</h3>
      <p className="text-body-sm text-text-secondary line-clamp-2 mb-4">
        {service.description}
      </p>
      <div className="mt-auto">
        <Link
          href={`/services/${service.slug}`}
          className="inline-flex items-center gap-1.5 text-accent hover:text-accent-hover text-button font-medium hover:underline transition-colors duration-200"
        >
          Learn more
        </Link>
      </div>
    </div>
  )
}

export { ServiceCard }
