"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: string
  trend?: { value: string; positive: boolean }
  icon: ReactNode
  delay?: number
}

export function StatCard({ label, value, trend, icon, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      whileHover={{ y: -4, borderColor: "rgba(200, 101, 68, 0.3)" }}
      className="bg-admin-surface border border-admin-border rounded-xl p-5 hover:border-admin-accent/20 transition-all duration-300 relative overflow-hidden group shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#C86544]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl bg-admin-accent/10 flex items-center justify-center text-admin-accent group-hover:bg-admin-accent/20 transition-all duration-300">
            {icon}
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                trend.positive
                  ? "text-admin-success bg-admin-success/10"
                  : "text-admin-danger bg-admin-danger/10",
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-admin-text-primary tracking-tight">{value}</p>
        <p className="text-sm text-admin-text-secondary mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}
