"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { logout } from "@/lib/auth/actions"

export function Header({
  breadcrumbs,
  onMenuToggle,
}: {
  breadcrumbs?: { label: string; href?: string }[]
  onMenuToggle?: () => void
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
        searchInputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
        setUserMenuOpen(false)
        setNotifOpen(false)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const notifications = [
    { id: 1, text: "New lead from Start Project form", time: "2 min ago", unread: true },
    { id: 2, text: "Blog post published", time: "1 hour ago", unread: true },
    { id: 3, text: "New testimonial received", time: "3 hours ago", unread: false },
    { id: 4, text: "Course enrollment completed", time: "5 hours ago", unread: false },
  ]

  return (
    <header className="h-[72px] bg-admin-bg/80 backdrop-blur-xl border-b border-admin-border flex items-center px-6 gap-4 shrink-0">
      <button
        type="button"
        onClick={onMenuToggle}
        className="lg:hidden text-admin-text-secondary hover:text-admin-text-primary transition-colors rounded-xl hover:bg-admin-surface w-10 h-10 flex items-center justify-center"
        aria-label="Toggle menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="hidden md:flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <motion.span
              key={`${crumb.label}-${i}`}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5"
            >
              {i > 0 && <span className="text-admin-text-muted text-xs">/</span>}
              {crumb.href ? (
                <Link href={crumb.href} className="text-admin-text-secondary hover:text-admin-text-primary transition-colors px-1.5 py-0.5 rounded-lg hover:bg-admin-surface">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-admin-text-primary font-medium px-1">{crumb.label}</span>
              )}
            </motion.span>
          ))}
        </nav>
      )}

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border transition-all duration-200 cursor-text",
              searchOpen
                ? "border-admin-accent/30 bg-admin-bg-secondary w-72 max-sm:w-56"
                : "border-admin-border bg-admin-bg-secondary w-48 hover:border-admin-text-muted",
            )}
            onClick={() => { setSearchOpen(true); searchInputRef.current?.focus() }}
            role="searchbox"
            tabIndex={0}
            aria-label="Search"
          >
            <span className="pl-3 text-admin-text-tertiary">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none py-2 pr-3 w-full"
              onFocus={() => setSearchOpen(true)}
              onBlur={() => { if (!searchQuery) setSearchOpen(false) }}
            />
            {!searchOpen && (
              <kbd className="mr-2 text-[10px] text-admin-text-muted bg-admin-surface px-1.5 py-0.5 rounded-md font-mono">⌘K</kbd>
            )}
          </div>
        </div>

        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-all relative"
            aria-label="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-admin-accent" />
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-[320px] max-sm:!right-0 max-sm:w-[calc(100vw-32px)] bg-admin-bg-secondary border border-admin-border rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50"
              >
                  <div className="px-4 py-3 border-b border-admin-border flex items-center justify-between">
                  <span className="text-sm font-medium text-admin-text-primary">Notifications</span>
                  <span className="text-[11px] text-admin-text-tertiary bg-admin-surface px-2 py-0.5 rounded-full">4 new</span>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className={cn(
                        "w-full text-left px-4 py-3 hover:bg-admin-surface transition-colors border-b border-admin-border/50 last:border-0",
                        n.unread && "bg-admin-accent/5",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn("w-2 h-2 rounded-full mt-1.5 shrink-0", n.unread ? "bg-admin-accent" : "bg-transparent")} />
                        <div>
                          <p className="text-sm text-admin-text-primary">{n.text}</p>
                          <p className="text-[11px] text-admin-text-tertiary mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-admin-border">
                  <button type="button" className="w-full text-center text-xs text-admin-text-tertiary hover:text-admin-text-primary transition-colors">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 ml-1 rounded-xl hover:bg-admin-surface transition-all px-2 py-1.5 h-10"
            aria-label="User menu"
            aria-expanded={userMenuOpen}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-admin-accent to-[#A04E32] flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-admin-accent/20">A</div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-admin-text-primary leading-tight">Admin</p>
              <p className="text-[10px] text-admin-text-tertiary">SuperAdmin</p>
            </div>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              animate={{ rotate: userMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.15 }}
              className="text-admin-text-tertiary"
            >
              <polyline points="6 9 12 15 18 9" />
            </motion.svg>
          </button>
          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-56 max-sm:w-[calc(100vw-32px)] bg-admin-bg-secondary border border-admin-border rounded-2xl shadow-2xl shadow-black/50 py-1.5 z-50"
              >
                  <div className="px-4 py-3 border-b border-admin-border">
                  <p className="text-sm font-medium text-admin-text-primary">Admin</p>
                  <p className="text-xs text-admin-text-tertiary mt-0.5">admin@weblancia.com</p>
                </div>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Settings
                </Link>
                <Link
                  href="/admin/seo"
                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-colors"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  SEO Overview
                </Link>
                <form action={logout} className="border-t border-admin-border pt-1.5 mt-1.5">
                  <button
                    type="submit"
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-admin-text-secondary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors rounded-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign out
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}
