"use client"

import { useRef } from "react"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { cn } from "@/lib/utils/cn"

interface AnimatedRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  stagger?: boolean
  staggerDelay?: number
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
}

function AnimatedReveal({ children, className, delay = 0, stagger, staggerDelay = 0.08 }: AnimatedRevealProps) {
  const prefersReducedMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  if (prefersReducedMotion) {
    return <div className={cn(className)}>{children}</div>
  }

  if (stagger) {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: staggerDelay, delayChildren: delay },
          },
        }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: defaultVariants.hidden,
        visible: {
          ...defaultVariants.visible,
          transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

export { AnimatedReveal }
