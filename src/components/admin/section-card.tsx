"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface SectionCardProps {
  title: string
  description?: string
  action?: ReactNode
  children?: ReactNode
}

export function SectionCard({ title, description, action, children }: SectionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-admin-surface border border-admin-border rounded-xl overflow-hidden hover:border-admin-border-hover/50 transition-colors shadow-lg"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-admin-border">
        <div>
          <h3 className="text-sm font-semibold text-admin-text-primary">{title}</h3>
          {description && (
            <p className="text-xs text-admin-text-tertiary mt-0.5">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children && <div className="p-5">{children}</div>}
    </motion.div>
  )
}
