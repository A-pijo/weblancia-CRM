"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { ActionButton } from "@/components/admin/action-button"
import { AdminErrorState } from "@/components/admin/error-state"
import { StatCard } from "@/components/admin/stat-card"
import { cn } from "@/lib/utils/cn"
import { logger } from "@/lib/logger"

export default function AdminAcademyPage() {
  const router = useRouter()
  const [counts, setCounts] = useState({ courses: 0, workshops: 0, resources: 0, certificates: 0, categories: 0 })
  const [recentCourses, setRecentCourses] = useState<any[]>([])
  const [recentWorkshops, setRecentWorkshops] = useState<any[]>([])
  const [recentResources, setRecentResources] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const [coursesRes, workshopsRes, resourcesRes, certsRes, catsRes] = await Promise.all([
          fetch("/api/academy/courses?page=1&limit=5"),
          fetch("/api/academy/workshops?page=1&limit=5"),
          fetch("/api/academy/resources?page=1&limit=5"),
          fetch("/api/academy/certificates?page=1&limit=1"),
          fetch("/api/academy/categories?page=1&limit=1"),
        ])
        const responses = [coursesRes, workshopsRes, resourcesRes, certsRes, catsRes]
        for (const res of responses) {
          if (!res.ok) {
            const body = await res.json().catch(() => null)
            throw new Error(body?.error?.message ?? `Erreur ${res.status}`)
          }
        }
        const courses = await coursesRes.json()
        const workshops = await workshopsRes.json()
        const resources = await resourcesRes.json()
        const certs = await certsRes.json()
        const cats = await catsRes.json()

        setCounts({
          courses: courses.total ?? 0,
          workshops: workshops.total ?? 0,
          resources: resources.total ?? 0,
          certificates: certs.total ?? 0,
          categories: cats.total ?? 0,
        })
        setRecentCourses(courses.items ?? [])
        setRecentWorkshops(workshops.items ?? [])
        setRecentResources(resources.items ?? [])
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Impossible de charger l'académie."
        logger.error(msg, e, "admin")
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const cards = [
    { label: "Total Courses", value: String(counts.courses), href: "/admin/academy/courses", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a2.5 2.5 0 0 1 0-5H20" /></svg> },
    { label: "Total Workshops", value: String(counts.workshops), href: "/admin/academy/workshops", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg> },
    { label: "Total Resources", value: String(counts.resources), href: "/admin/academy/resources", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg> },
    { label: "Total Certificates", value: String(counts.certificates), href: "/admin/academy/certificates", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7" /><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" /></svg> },
    { label: "Total Categories", value: String(counts.categories), href: "/admin/academy/categories", icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h6v6H4z" /><path d="M14 4h6v6h-6z" /><path d="M4 14h6v6H4z" /><path d="M14 14h6v6h-6z" /></svg> },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Academy" description="Manage courses, workshops, resources, and certificates"
        actions={<ActionButton onClick={() => router.push("/admin/academy/courses/new")}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          New Course
        </ActionButton>}
      />

      {loading ? (
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      ) : error ? (
        <AdminErrorState message={error} onRetry={() => window.location.reload()} fullPage />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {cards.map((card) => (
              <button key={card.label} type="button" onClick={() => router.push(card.href)} className="text-left cursor-pointer">
                <StatCard label={card.label} value={card.value} icon={card.icon} />
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RecentSection title="Recent Courses" items={recentCourses} href="/admin/academy/courses" onView={(c: any) => router.push(`/admin/academy/courses/${c.id}`)} />
            <RecentSection title="Recent Workshops" items={recentWorkshops} href="/admin/academy/workshops" onView={(w: any) => router.push(`/admin/academy/workshops/${w.id}`)} />
            <RecentSection title="Recent Resources" items={recentResources} href="/admin/academy/resources" onView={(r: any) => router.push(`/admin/academy/resources/${r.id}`)} />
          </div>
        </>
      )}
    </div>
  )
}

function RecentSection({ title, items, href, onView }: { title: string; items: any[]; href: string; onView: (item: any) => void }) {
  const router = useRouter()

  return (
    <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-admin-text-primary">{title}</h3>
        <button type="button" onClick={() => router.push(href)} className="text-xs text-admin-accent hover:text-admin-accent-hover transition-colors">View all</button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-admin-text-tertiary py-2">No items found</p>
      ) : (
        <div className="space-y-1">
          {items.map((item: any) => (
            <button key={item.id} type="button" onClick={() => onView(item)}
              className="w-full flex items-center justify-between py-2 px-3 rounded-lg hover:bg-admin-surface/30 transition-colors text-left">
              <span className="text-sm text-admin-text-secondary truncate flex-1">{item.title}</span>
              <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ml-2",
                item.isPublished ? "bg-admin-success/10 text-admin-success" : "bg-admin-surface text-admin-text-secondary"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", item.isPublished ? "bg-admin-success" : "bg-admin-text-muted")} />
                {item.isPublished ? "Live" : "Draft"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
