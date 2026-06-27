"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight } from "@/components/icons"
import { Card } from "@/components/ui/card"

export function ServiceCards({ services }: { services: { slug: string; title: string; description: string }[] }) {
  return (
    <>
      {services.map((service) => (
        <motion.div key={service.slug} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <Link href={`/services/${service.slug}`}>
            <Card className="h-full hover:border-accent transition-all duration-200 p-6 group">
              <h3 className="text-h4 font-semibold mb-2 group-hover:text-accent transition-colors">{service.title}</h3>
              <p className="text-body-sm text-text-secondary mb-4">{service.description}</p>
              <span className="text-caption text-accent inline-flex items-center gap-1 font-medium">
                En savoir plus <ArrowRight size={16} />
              </span>
            </Card>
          </Link>
        </motion.div>
      ))}
    </>
  )
}
