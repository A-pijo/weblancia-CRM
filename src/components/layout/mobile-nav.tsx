"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { X, CaretDown, CaretRight } from "@/components/icons"
import { cn } from "@/lib/utils/cn"
import {
  mainNavLinks,
  servicesMegaMenu,
  academyMegaMenu,
  type MegaMenuColumn,
} from "@/lib/constants/navigation"
import { Button } from "@/components/ui/button"
import { SocialLinks } from "@/components/shared/social-links"
import { LanguageSwitcher } from "@/components/shared/language-switcher"
import { useLocale } from "@/lib/i18n/provider"

const navLabelKey: Record<string, string> = {
  Home: "nav.work",
  Work: "nav.work",
  Services: "nav.services",
  Academy: "nav.academy",
  Insights: "nav.insights",
  About: "nav.about",
}

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

function SubmenuAccordion({ title, columns, onItemClick }: { title: string; columns: MegaMenuColumn[]; onItemClick: () => void }) {
  const [expanded, setExpanded] = useState(false)
  const { t } = useLocale()

  return (
    <div>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full py-3 text-left"
      >
        <span className="text-h5">{t(navLabelKey[title] ?? title)}</span>
        <CaretDown
          size={20}
          className={cn(
            "text-text-tertiary transition-transform duration-200",
            expanded && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pb-3 space-y-3">
              {columns.map((column) => (
                <div key={column.title}>
                  <h4 className="text-caption font-semibold text-text-secondary mb-2">
                    {t(navLabelKey[column.title] ?? column.title)}
                  </h4>
                  <ul className="space-y-2 pl-2">
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-caption text-text-secondary hover:text-accent transition-colors duration-200"
                          onClick={() => {
                            setExpanded(false)
                            onItemClick()
                          }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLocale()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  const topLinks = [
    { label: "Home", href: "/" },
    ...mainNavLinks,
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-overlay z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-bg z-[70] flex flex-col overflow-y-auto"
          >
            <div className="flex items-center justify-between h-16 px-4 border-b border-border">
              <Link
                href="/"
                className="font-display text-h4 text-text-primary"
                onClick={onClose}
              >
                Weblancia
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="text-text-secondary hover:text-text-primary transition-colors duration-200"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 px-4 py-4">
              <nav className="space-y-1">
                {topLinks.map((link) => {
                  if (link.label === "Services") {
                    return <SubmenuAccordion key="Services" title="Services" columns={servicesMegaMenu} onItemClick={onClose} />
                  }
                  if (link.label === "Academy") {
                    return <SubmenuAccordion key="Academy" title="Academy" columns={academyMegaMenu} onItemClick={onClose} />
                  }
                  const isActive = pathname === link.href || pathname.startsWith(link.href + "/")
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={cn(
                        "flex items-center justify-between py-3 text-h5 transition-colors duration-200",
                        isActive ? "text-accent" : "text-text-primary hover:text-accent",
                      )}
                      onClick={onClose}
                    >
                      {t(navLabelKey[link.label] ?? link.label)}
                      <CaretRight size={20} className={cn(isActive ? "text-accent" : "text-text-tertiary")} />
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="px-4 pb-8 space-y-4 border-t border-border pt-6">
              <div className="flex flex-col gap-3">
                <Button
                  variant="secondary"
                  size="default"
                  onClick={() => { onClose(); router.push("/contact") }}
                >
                  {t("nav.contact")}
                </Button>
                <Button
                  variant="primary"
                  size="default"
                  onClick={() => { onClose(); router.push("/start-project") }}
                >
                  {t("nav.startProject")}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <LanguageSwitcher />
                <SocialLinks />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
