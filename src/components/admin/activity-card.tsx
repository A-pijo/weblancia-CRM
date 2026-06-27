"use client"

import { motion } from "framer-motion"

interface ActivityItem {
  id: string
  action: string
  detail: string
  time: string
  user: string
}

interface ActivityCardProps {
  items: ActivityItem[]
}

export function ActivityCard({ items }: ActivityCardProps) {
  return (
    <div className="space-y-0.5">
      {items.map((item, i) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-admin-surface transition-colors group"
        >
          <div className="relative mt-2">
            <div className="w-2 h-2 rounded-full bg-admin-accent shrink-0 shadow-sm shadow-admin-accent/30" />
            {i < items.length - 1 && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-6 bg-admin-border" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-admin-text-secondary">
              <span className="font-medium text-admin-text-primary group-hover:text-white transition-colors">{item.user}</span>{" "}
              {item.action}
            </p>
            <p className="text-xs text-admin-text-tertiary mt-0.5 line-clamp-1">{item.detail}</p>
          </div>
          <span className="text-[11px] text-admin-text-muted whitespace-nowrap">{item.time}</span>
        </motion.div>
      ))}
    </div>
  )
}
