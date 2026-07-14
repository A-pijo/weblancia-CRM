"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/lib/constants/site"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SocialLinks } from "@/components/shared/social-links"
import { LanguageSwitcher } from "@/components/shared/language-switcher"
import { useLocale } from "@/lib/i18n/provider"
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
      { label: "Authors", href: "/author" },
      { label: "Sitemap", href: "/sitemap" },
    ],
  },
]

const columnTitleKey: Record<string, string> = {
  Services: "footer.services",
  Work: "footer.work",
  Academy: "footer.academy",
  Connect: "footer.connect",
}

export function Footer() {
  const pathname = usePathname()
  const { t } = useLocale()
  if (pathname.startsWith("/admin")) return null

  const currentYear = new Date().getFullYear()
  const copyright = `© ${currentYear} ${siteConfig.name}. ${t("footer.copyright")}`

  const [newsletterEmail, setNewsletterEmail] = useState("")
  const [newsletterHp, setNewsletterHp] = useState("")
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [newsletterError, setNewsletterError] = useState("")

  async function handleNewsletterSubmit(e: FormEvent) {
    e.preventDefault()
    if (newsletterHp) return
    if (!newsletterEmail.trim()) return
    setNewsletterStatus("loading")
    setNewsletterError("")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setNewsletterStatus("success")
        setNewsletterEmail("")
      } else {
        setNewsletterStatus("error")
        setNewsletterError(data.error || "Une erreur est survenue")
      }
    } catch {
      setNewsletterStatus("error")
      setNewsletterError("Erreur de connexion")
    }
  }

  return (
    <footer className="bg-bg-secondary border-t border-border">
      <div className="container-page">
        <div className="py-10 md:py-20 border-b border-border">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-h4 text-text-primary">{t("footer.newsletterTitle")}</h3>
              <p className="text-body-sm text-text-secondary mt-1">
                {t("footer.newsletterText")}
              </p>
            </div>
            <div className="w-full md:w-auto">
              {newsletterStatus === "success" ? (
                <p className="text-accent font-semibold">{t("contact.successText")}</p>
              ) : (
                <form
                  className="flex flex-col sm:flex-row gap-3 w-full md:w-auto"
                  onSubmit={handleNewsletterSubmit}>
                  <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
                    <label htmlFor="nl_hp">Leave empty</label>
                    <input id="nl_hp" type="text" value={newsletterHp} onChange={(e) => setNewsletterHp(e.target.value)} tabIndex={-1} autoComplete="off" />
                  </div>
                  <div className="w-full sm:min-w-[280px]">
                    <Input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder={t("footer.newsletterPlaceholder")}
                      required
                      aria-label={t("footer.newsletterPlaceholder")}
                    />
                    {newsletterStatus === "error" && (
                      <p className="text-caption text-danger mt-1">{newsletterError}</p>
                    )}
                  </div>
                  <Button type="submit" variant="primary" size="default" disabled={newsletterStatus === "loading"}>
                    {newsletterStatus === "loading" ? "..." : t("actions.subscribe")}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {columns.map((column) => (
            <div key={column.title}>
              <h4 className="text-caption font-semibold text-text-primary mb-4 uppercase tracking-wider">
                {t(columnTitleKey[column.title] ?? column.title)}
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
            {copyright}
          </p>
          <nav className="flex items-center gap-4 order-1 md:order-2 flex-wrap">
            <Link href="/legal/terms" className="text-caption text-text-tertiary hover:text-accent transition-colors">Conditions</Link>
            <Link href="/legal/privacy" className="text-caption text-text-tertiary hover:text-accent transition-colors">Confidentialité</Link>
            <Link href="/legal/cookies" className="text-caption text-text-tertiary hover:text-accent transition-colors">Cookies</Link>
            <Link href="/legal/editorial-policy" className="text-caption text-text-tertiary hover:text-accent transition-colors">Éditorial</Link>
            <Link href="/sitemap" className="text-caption text-text-tertiary hover:text-accent transition-colors">Plan du site</Link>
            <LanguageSwitcher />
            <SocialLinks />
          </nav>
        </div>
      </div>
    </footer>
  )
}
