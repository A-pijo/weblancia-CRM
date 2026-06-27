"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils/cn"
import { logout } from "@/lib/auth/actions"

const icons = {
  overview: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  work: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M12 3v7",
  services: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  blog: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  portfolio: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z",
  testimonials: "M7 13c-1.67 0-3-.9-3-2s1.33-2 3-2c.12 0 .24 0 .36.04M22 11c0 4.42-3.58 8-8 8h-3.5M7 17c-1.67 0-3-.9-3-2s1.33-2 3-2M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
  faq: "M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3 M12 17h.01",
  leads: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  media: "M15 3h6v6 M9 21H3v-6 M21 3l-7 7 M3 21l7-7",
  seo: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  users: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M2.1 21a8 8 0 0 1 15.8 0 M16 4.44a5 5 0 0 1 0 9.12 M19.7 21a8 8 0 0 0 0-10M22 9.33a12 12 0 0 1 0 5.34",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  academy: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
  search: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
}

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

const NAV_ITEMS: (NavItem | "divider")[] = [
  { label: "Overview", href: "/admin", icon: icons.overview },
  { label: "Projects", href: "/admin/work", icon: icons.work },
  { label: "Services", href: "/admin/services", icon: icons.services },
  { label: "Blog", href: "/admin/blog", icon: icons.blog, badge: 3 },
  { label: "Academy", href: "/admin/academy", icon: icons.academy },
  { label: "Testimonials", href: "/admin/testimonials", icon: icons.testimonials },
  { label: "FAQ", href: "/admin/faq", icon: icons.faq },
  { label: "Team", href: "/admin/team", icon: icons.users },
  { label: "Media", href: "/admin/media", icon: icons.media },
  "divider",
  { label: "SEO", href: "/admin/seo", icon: icons.seo },
  { label: "Leads", href: "/admin/leads", icon: icons.leads, badge: 12 },
  { label: "Users", href: "/admin/users", icon: icons.users },
  { label: "Settings", href: "/admin/settings", icon: icons.settings },
]

const ACADEMY_SUB_ITEMS = [
  { label: "Overview", href: "/admin/academy" },
  { label: "Courses", href: "/admin/academy/courses" },
  { label: "Workshops", href: "/admin/academy/workshops" },
  { label: "Resources", href: "/admin/academy/resources" },
  { label: "Certificates", href: "/admin/academy/certificates" },
  { label: "Categories", href: "/admin/academy/categories" },
]

export function Sidebar({ collapsed, onToggle, mobileOpen }: { collapsed: boolean; onToggle: () => void; mobileOpen?: boolean }) {
  const pathname = usePathname()
  const academyActive = pathname.startsWith("/admin/academy")
  const [academyOpen, setAcademyOpen] = useState(academyActive)

  const NavLink = ({ item }: { item: NavItem }) => {
    const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
    return (
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
          collapsed ? "justify-center h-11 w-11 mx-auto" : "px-3 h-10",
          active ? "text-admin-text-primary" : "text-admin-text-secondary hover:text-admin-text-primary",
        )}
        title={collapsed ? item.label : undefined}
      >
        <div className={cn(
          "absolute inset-0 rounded-xl transition-all duration-200",
          active ? "bg-admin-accent/10" : "hover:bg-admin-surface",
        )} />
        {active && (
          <motion.div
            layoutId="nav-active"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-admin-accent rounded-r-full shadow-sm shadow-admin-accent/30"
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}
        <div className="relative flex items-center gap-3 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("shrink-0", active ? "text-admin-accent" : "")}
          >
            <path d={item.icon} />
          </svg>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.15 }}
              >
                {item.label}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {item.badge && !collapsed && (
          <span className="ml-auto relative z-10 bg-admin-accent/10 text-admin-accent text-[10px] font-semibold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-40 h-screen bg-admin-bg border-r border-admin-border flex flex-col",
        "max-lg:z-50 transition-transform duration-300",
        mobileOpen ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
      )}
      style={{ width: collapsed ? 72 : 280 }}
    >
      <div className={cn(
        "flex items-center border-b border-admin-border shrink-0",
        collapsed ? "h-[72px] justify-center px-0" : "h-[72px] px-5 justify-between",
      )}>
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-admin-accent to-[#A04E32] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-admin-accent/20 shrink-0">W</div>
          {!collapsed && (
            <div>
              <span className="text-base font-semibold text-admin-text-primary tracking-tight">Weblancia</span>
              <p className="text-[10px] text-admin-text-tertiary tracking-wider uppercase">Admin Panel</p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-admin-text-tertiary hover:text-admin-text-primary hover:bg-admin-surface transition-all"
            aria-label="Collapse sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        )}
        {collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute -right-3 top-6 w-6 h-6 flex items-center justify-center rounded-full bg-admin-bg-secondary border border-admin-border text-admin-text-secondary hover:text-admin-text-primary transition-all shadow-lg"
            aria-label="Expand sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-2 space-y-0.5 scrollbar-thin">
        {NAV_ITEMS.map((item, i) => {
          if (item === "divider") {
            return (
              <div key={`div-${i}`} className={cn(
                "h-px bg-admin-border my-3",
                collapsed ? "mx-3" : "mx-3",
              )} />
            )
          }
          if (item.label === "Academy") {
            return (
              <div key="academy" className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setAcademyOpen(!academyOpen)}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200 w-full",
                    collapsed ? "justify-center h-11 w-11 mx-auto" : "px-3 h-10",
                    academyActive ? "text-admin-text-primary" : "text-admin-text-secondary hover:text-admin-text-primary",
                  )}
                  title={collapsed ? "Academy" : undefined}
                >
                  <div className={cn(
                    "absolute inset-0 rounded-xl transition-all duration-200",
                    academyActive ? "bg-admin-accent/10" : "hover:bg-admin-surface",
                  )} />
                  {academyActive && (
                    <motion.div
                      layoutId="nav-active"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-admin-accent rounded-r-full shadow-sm shadow-admin-accent/30"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                  <div className="relative flex items-center gap-3 w-full z-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={20}
                      height={20}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={cn("shrink-0", academyActive ? "text-admin-accent" : "")}
                    >
                      <path d={icons.academy} />
                    </svg>
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex-1 text-left"
                        >
                          Academy
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {!collapsed && (
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
                        animate={{ rotate: academyOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="shrink-0 text-admin-text-tertiary"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </motion.svg>
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {!collapsed && academyOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-3 space-y-0.5 pt-0.5 border-l border-admin-border pl-3">
                        {ACADEMY_SUB_ITEMS.map((sub) => {
                          const subActive = pathname === sub.href
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              className={cn(
                                "flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-150 py-1.5 pl-2 relative",
                                subActive ? "text-admin-accent" : "text-admin-text-secondary hover:text-admin-text-primary",
                              )}
                            >
                              <div className={cn(
                                "absolute inset-0 rounded-lg transition-all duration-150",
                                subActive ? "bg-admin-accent/10" : "hover:bg-admin-surface",
                              )} />
                              <span className="relative z-10">{sub.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          }
          return <NavLink key={item.href} item={item} />
        })}
      </div>

      <div className={cn(
        "border-t border-admin-border py-4 shrink-0",
        collapsed ? "px-0 flex flex-col items-center gap-3" : "px-4",
      )}>
        {collapsed ? (
          <>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-admin-accent to-[#A04E32] flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-admin-accent/20">A</div>
            <form action={logout}>
              <button type="submit" className="w-9 h-9 rounded-xl flex items-center justify-center text-admin-text-tertiary hover:text-admin-text-primary hover:bg-admin-surface transition-all" aria-label="Sign out">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icons.logout} />
                </svg>
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-admin-accent to-[#A04E32] flex items-center justify-center text-white text-xs font-semibold shadow-lg shadow-admin-accent/20 shrink-0">A</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-admin-text-primary truncate">Admin</p>
                <p className="text-[11px] text-admin-text-tertiary truncate flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-admin-success inline-block" />
                  SuperAdmin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <Link
                href="/admin/settings"
                className="flex-1 flex items-center justify-center gap-2 h-8 rounded-lg text-xs text-admin-text-secondary hover:text-admin-text-primary hover:bg-admin-surface transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={icons.settings} />
                </svg>
                Settings
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 h-8 px-3 rounded-lg text-xs text-admin-text-secondary hover:text-admin-danger hover:bg-admin-danger/10 transition-all w-full"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icons.logout} />
                  </svg>
                  Sign out
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
