"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { PageHeader } from "@/components/admin/page-header"

const cards = [
  {
    label: "Total Contacts",
    href: "/admin/leads/contacts",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    api: "/api/forms/contacts?limit=1",
  },
  {
    label: "Total Project Requests",
    href: "/admin/leads/projects",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
    ),
    api: "/api/forms/projects?limit=1",
  },
  {
    label: "Total Book Calls",
    href: "/admin/leads/book-calls",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    ),
    api: "/api/forms/book-calls?limit=1",
  },
  {
    label: "Newsletter Subscribers",
    href: "/admin/leads/newsletter",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
    ),
    api: "/api/forms/newsletter?limit=1",
  },
]

export default function AdminLeads() {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    cards.forEach(async (card) => {
      try {
        const res = await fetch(card.api)
        const data = await res.json()
        setCounts((prev) => ({ ...prev, [card.label]: data.total ?? 0 }))
      } catch {
        setCounts((prev) => ({ ...prev, [card.label]: 0 }))
      }
    })
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader title="Leads" description="Manage contact requests and inquiries" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link key={card.label} href={card.href} className="block">
            <div className="bg-admin-surface border border-admin-border/30 rounded-2xl p-5 hover:border-admin-text-muted/50 transition-all duration-300 group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-admin-surface/50 flex items-center justify-center text-admin-text-secondary group-hover:bg-admin-surface/50 group-hover:text-admin-text-primary transition-all duration-300">
                  {card.icon}
                </div>
              </div>
              <p className="text-2xl font-bold text-white tracking-tight">{counts[card.label] ?? "—"}</p>
              <p className="text-sm text-admin-text-secondary mt-0.5">{card.label}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
