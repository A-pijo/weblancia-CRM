"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"

function StickyCTA() {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="flex items-center justify-between gap-3 bg-bg/95 backdrop-blur-xl border-t border-border px-4 py-3">
        <span className="text-caption font-medium text-text-primary leading-tight">
          Prêt à démarrer ?
        </span>
        <Link
          href="/start-project"
          className="inline-flex items-center justify-center h-11 px-6 rounded-radius-md bg-accent text-white hover:bg-accent-hover text-button font-medium transition-all duration-200 active:scale-[0.97] shrink-0"
        >
          Commencer
        </Link>
      </div>
    </div>
  )
}

export { StickyCTA }
