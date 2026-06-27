"use client"

import { useEffect, useRef, useState } from "react"
import { useReducedMotion, useInView } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/shared/container"
import { AnimatedReveal } from "@/components/shared/animated-reveal"
import type { Stat } from "@/types/common"

interface StatsCounterProps {
  items: Stat[]
}

function useCountUp(end: string, duration: number, startCounting: boolean) {
  const [count, setCount] = useState("0")
  const target = parseInt(end.replace(/[^0-9]/g, ""), 10)
  const suffix = end.replace(/[0-9]/g, "")

  useEffect(() => {
    if (!startCounting || isNaN(target)) {
      setCount(end)
      return
    }

    let startTime: number | null = null
    let rafId: number

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.floor(eased * target)

      setCount(`${current}${suffix}`)

      if (progress < 1) {
        rafId = requestAnimationFrame(animate)
      }
    }

    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [end, duration, startCounting, target, suffix])

  return count
}

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const prefersReducedMotion = useReducedMotion()
  const [startCounting, setStartCounting] = useState(false)

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setStartCounting(true), index * 200)
      return () => clearTimeout(timer)
    }
  }, [isInView, index])

  const displayValue = prefersReducedMotion
    ? stat.number
    : useCountUp(stat.number, 1500, startCounting)

  return (
    <div ref={ref} className="text-center">
      <span className="block font-serif font-bold text-display text-accent mb-2">
        {displayValue}
      </span>
      <span className="text-caption text-text-secondary">{stat.label}</span>
    </div>
  )
}

function StatsCounter({ items }: StatsCounterProps) {
  return (
    <section className="py-12 md:py-16 lg:py-24 bg-bg">
      <Container>
        <AnimatedReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {items.map((stat, index) => (
              <StatItem key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </AnimatedReveal>
      </Container>
    </section>
  )
}

export { StatsCounter }
