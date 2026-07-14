import dynamic from "next/dynamic"
import type { ReactNode } from "react"

const AnimatedRevealClient = dynamic(
  () => import("./animated-reveal").then((m) => ({ default: m.AnimatedReveal })),
  { ssr: false },
)

interface Props {
  children: ReactNode
  className?: string
  delay?: number
  stagger?: boolean
  staggerDelay?: number
}

export function AnimatedRevealWrapper({ children, className, delay, stagger, staggerDelay }: Props) {
  return (
    <AnimatedRevealClient className={className} delay={delay} stagger={stagger} staggerDelay={staggerDelay}>
      {children}
    </AnimatedRevealClient>
  )
}
