"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { List, MagnifyingGlass } from "@/components/icons"
import { cn } from "@/lib/utils/cn"
import {
  mainNavLinks,
  servicesMegaMenu,
  academyMegaMenu,
} from "@/lib/constants/navigation"
import { siteConfig } from "@/lib/constants/site"
import { Button } from "@/components/ui/button"
import { MegaMenu } from "./mega-menu"
import { MobileNav } from "./mobile-nav"
import { SearchOverlay } from "./search-overlay"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  if (pathname.startsWith("/admin")) return null
  const [scrolled, setScrolled] = useState(false)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  function handleMegaOpen(name: string) {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    setActiveMega(name)
  }

  function handleMegaClose() {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
    hoverTimerRef.current = setTimeout(() => {
      setActiveMega(null)
    }, 200)
  }

  const megaLabels = ["Services", "Academy"]

  return (
    <>
      <motion.header
        animate={{
          backgroundColor: scrolled
            ? "rgba(250, 248, 245, 0.9)"
            : "rgba(250, 248, 245, 0)",
          borderBottom: scrolled
            ? "1px solid var(--color-border)"
            : "1px solid transparent",
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          scrolled && "backdrop-blur-xl",
        )}
      >
        <div className="relative">
          <div className="flex items-center justify-between h-16 lg:h-[72px] container-page">
            <Link
              href="/"
              className="font-display text-h4 text-text-primary shrink-0"
            >
              {siteConfig.name}
            </Link>

            <nav className="hidden lg:flex items-center gap-0.5">
              {mainNavLinks.map((link) => {
                const isMega = megaLabels.includes(link.label)
                return (
                  <div
                    key={link.label}
                    onMouseEnter={() => isMega && handleMegaOpen(link.label.toLowerCase())}
                    onMouseLeave={isMega ? handleMegaClose : undefined}
                  >
                    {isMega ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (activeMega === link.label.toLowerCase()) {
                            setActiveMega(null)
                          } else {
                            setActiveMega(link.label.toLowerCase())
                          }
                        }}
                        className={cn(
                          "px-4 py-2 text-nav text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-radius-md",
                          activeMega === link.label.toLowerCase() && "text-text-primary",
                        )}
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        href={link.href}
                        className="inline-block px-4 py-2 text-nav text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-radius-md"
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                aria-label="Search"
              >
                <MagnifyingGlass size={20} />
              </button>
              <Button variant="secondary" size="sm" onClick={() => router.push("/contact")}>
                Contact
              </Button>
              <Button variant="primary" size="sm" onClick={() => router.push("/start-project")}>
                Start Project
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-text-secondary hover:text-text-primary transition-colors duration-200"
              aria-label="Open menu"
            >
              <List size={24} />
            </button>
          </div>

          {(activeMega === "services" || activeMega === "academy") && (
            <div
              className="absolute left-0 right-0 px-4"
              onMouseEnter={() => {
                if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
              }}
              onMouseLeave={handleMegaClose}
            >
              <div className="container-page">
                {activeMega === "services" && (
                  <MegaMenu
                    items={servicesMegaMenu}
                    isOpen={true}
                    onClose={() => setActiveMega(null)}
                  />
                )}
                {activeMega === "academy" && (
                  <MegaMenu
                    items={academyMegaMenu}
                    isOpen={true}
                    onClose={() => setActiveMega(null)}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </motion.header>

      <MobileNav isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
