"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/lib/constants/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialLinks } from "@/components/shared/social-links"
import { LanguageSwitcher } from "@/components/shared/language-switcher"

interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

const columns: FooterColumn[] = [
  {
    title: "Services",
    links: [
      { label: "Web Development", href: "/services/web-development" },
      { label: "Digital Marketing", href: "/services/digital-marketing" },
      { label: "Branding & Design", href: "/services/branding-design" },
      { label: "Consulting", href: "/services/consulting" },
      { label: "Maintenance", href: "/services/maintenance-support" },
      { label: "Automation", href: "/services/automation" },
      { label: "Audit", href: "/services/audit" },
      { label: "Technology", href: "/services/technology" },
    ],
  },
  {
    title: "Work",
    links: [
      { label: "All Work", href: "/work" },
      { label: "Web Design", href: "/work/web-design" },
      { label: "Branding", href: "/work/branding" },
      { label: "Development", href: "/work/development" },
      { label: "Testimonials", href: "/about" },
    ],
  },
  {
    title: "Academy",
    links: [
      { label: "Courses", href: "/academy/courses" },
      { label: "Workshops", href: "/academy/workshops" },
      { label: "Resources", href: "/academy/resources" },
      { label: "Certificates", href: "/academy/certificates" },
      { label: "Careers", href: "/academy/careers" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Book a Call", href: "/book-call" },
      { label: "Start Project", href: "/start-project" },
      { label: "Consultation", href: "/consultation" },
    ],
  },
]

export function Footer() {
  const pathname = usePathname()
  if (pathname.startsWith("/admin")) return null
  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="container-page">
        <div className="py-10 md:py-20 border-b border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-h4 text-text-primary">Stay in the loop</h3>
              <p className="text-body-sm text-text-secondary mt-1">
                Get the latest insights and resources delivered to your inbox.
              </p>
            </div>
            <form
              className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className="w-full sm:min-w-[280px]">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  required
                  aria-label="Email for newsletter"
                />
              </div>
              <Button type="submit" variant="primary" size="default">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-caption font-semibold text-text-primary mb-4 uppercase tracking-wider">
                {column.title}
              </h4>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-caption text-text-secondary hover:text-accent transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 border-t border-border">
          <p className="text-caption text-text-tertiary order-2 md:order-1">
            {siteConfig.copyright}
          </p>
          <div className="flex items-center gap-6 order-1 md:order-2">
            <LanguageSwitcher />
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  )
}
