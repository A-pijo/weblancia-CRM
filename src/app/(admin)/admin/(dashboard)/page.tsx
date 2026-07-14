import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/database/prisma"
import { dashboardService } from "@/lib/repositories/services/dashboard.service"
import { DashboardHomeClient } from "./dashboard-client"
import { logger } from "@/lib/logger"

export default async function AdminDashboard() {
  const session = await getSession()
  const rawStats = await dashboardService.getStats()
  const stats = {
    totalProjects: rawStats.projects, activeProjects: rawStats.projects, totalServices: rawStats.services, activeServices: rawStats.services, totalBlogPosts: rawStats.blogPosts, publishedPosts: rawStats.blogPosts, draftPosts: 0, totalCourses: rawStats.courses, publishedCourses: rawStats.courses, totalLeads: rawStats.leads, unreadContacts: rawStats.contacts, totalNewsletter: rawStats.newsletterSubs, totalTestimonials: rawStats.testimonials, totalTeamMembers: rawStats.teamMembers, totalFaq: rawStats.faqCount, totalAcademyResources: 0, totalWorkshops: 0, totalMedia: rawStats.mediaCount, totalUsers: rawStats.users, totalCategories: 0, totalTags: 0, aiGeneratedPosts: 0, unreadProjectRequests: rawStats.projectRequests, unconfirmedBookCalls: rawStats.bookCalls,
  }
  const [recentPosts, recentContacts, unreadContacts, unreadProjects, unconfirmedCalls] = await Promise.all([
    prismaFindMany(prisma.blogPost.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, createdAt: true } })),
    prismaFindMany(prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, name: true, createdAt: true } })),
    prismaCount(prisma.contactRequest.count({ where: { isRead: false } })),
    prismaCount(prisma.startProject.count({ where: { isRead: false } })),
    prismaCount(prisma.bookCall.count({ where: { isConfirmed: false } })),
  ])
  const recentActivity = [
    ...recentPosts.map((p) => ({ id: `post-${p.id}`, user: "System", action: "published a new blog post", detail: p.title, time: timeAgo(p.createdAt) })),
    ...recentContacts.map((c) => ({ id: `contact-${c.id}`, user: c.name, action: "submitted a contact form", detail: "New inquiry received", time: timeAgo(c.createdAt) })),
  ].slice(0, 8)
  const pendingTasks: { label: string; count: number; urgent: boolean }[] = [
    ...(unreadContacts > 0 ? [{ label: "Respond to contact forms", count: unreadContacts, urgent: unreadContacts > 5 }] : []),
    ...(unreadProjects > 0 ? [{ label: "Review new project requests", count: unreadProjects, urgent: unreadProjects > 3 }] : []),
    ...(unconfirmedCalls > 0 ? [{ label: "Confirm book calls", count: unconfirmedCalls, urgent: false }] : []),
  ]
  if (pendingTasks.length === 0) pendingTasks.push({ label: "No pending tasks", count: 0, urgent: false })

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  })()

  const displayName = session?.name ?? "Admin"

  return (
    <DashboardHomeClient
      greeting={greeting}
      displayName={displayName}
      stats={stats}
      recentActivity={recentActivity}
      pendingTasks={pendingTasks}
    />
  )
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return `${seconds} sec ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days > 1 ? "s" : ""} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months > 1 ? "s" : ""} ago`
}

async function prismaFindMany<T>(query: Promise<T[]>): Promise<T[]> {
  try { return await query } catch (e) { logger.error("Dashboard query failed", e, "dashboard"); return [] }
}

async function prismaCount(query: Promise<number>): Promise<number> {
  try { return await query } catch (e) { logger.error("Dashboard count failed", e, "dashboard"); return 0 }
}
