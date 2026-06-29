import { PageHeader } from "@/components/admin/page-header"
import Link from "next/link"
import { db } from "@/lib/db"

async function getLeadCounts() {
  const [contacts, projects, bookCalls, newsletter] = await Promise.all([
    db.contactRequest.count(),
    db.startProject.count(),
    db.bookCall.count(),
    db.newsletterSubscriber.count(),
  ])
  return { contacts, projects, bookCalls, newsletter }
}

export default async function AdminLeads() {
  const counts = await getLeadCounts()

  const cards = [
    { label: "Total Contacts", value: counts.contacts, href: "/admin/leads/contacts", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" },
    { label: "Project Requests", value: counts.projects, href: "/admin/leads/projects", icon: "M2 3h20v14H2z M8 21h8 M12 17v4" },
    { label: "Book Calls", value: counts.bookCalls, href: "/admin/leads/book-calls", icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" },
    { label: "Newsletter", value: counts.newsletter, href: "/admin/leads/newsletter", icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" description="Manage contact requests and inquiries" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="block">
            <div className="bg-admin-surface border border-admin-border/30 rounded-2xl p-5 hover:border-admin-text-muted/50 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-admin-surface/50 flex items-center justify-center text-admin-text-secondary group-hover:bg-admin-surface/50 group-hover:text-admin-text-primary transition-all duration-300">
                  <Icon path={card.icon} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{card.value}</p>
              <p className="text-sm text-admin-text-secondary mt-0.5">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function Icon({ path }: { path: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}
