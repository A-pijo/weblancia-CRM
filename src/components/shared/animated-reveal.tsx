"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils/cn"

interface AnimatedRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  stagger?: boolean
  staggerDelay?: number
}

function AnimatedReveal({ children, className, delay = 0, stagger, staggerDelay = 0.08 }: AnimatedRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        isVisible
          ? "animate-in"
          : "opacity-0",
        className,
      )}
      style={{
        animationDelay: stagger ? undefined : `${delay}s`,
        animationDuration: "0.5s",
        animationFillMode: "both",
        animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        ...(stagger ? {
          transitionDelay: `${delay}s`,
          transitionDuration: "0.5s",
        } : {}),
      }}
    >
      {children}
    </div>
  )
}

export { AnimatedReveal }
