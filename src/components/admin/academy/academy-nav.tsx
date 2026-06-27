"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/cn"

const LINKS = [
  { label: "Overview", href: "/admin/academy" },
  { label: "Courses", href: "/admin/academy/courses" },
  { label: "Workshops", href: "/admin/academy/workshops" },
  { label: "Resources", href: "/admin/academy/resources" },
  { label: "Certificates", href: "/admin/academy/certificates" },
  { label: "Categories", href: "/admin/academy/categories" },
]

export function AcademyNav() {
  const pathname = usePathname()

  return (
    <div className="flex border-b border-admin-border/50 gap-0 overflow-x-auto scrollbar-thin">
      {LINKS.map((link) => {
        const active = pathname === link.href
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] shrink-0",
              active
                ? "text-admin-accent border-admin-accent"
                : "text-admin-text-secondary border-transparent hover:text-admin-text-primary",
            )}
          >
            {link.label}
          </Link>
        )
      })}
    </div>
  )
}
