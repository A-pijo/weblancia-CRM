import { db } from "@/lib/db"

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  totalServices: number
  activeServices: number
  totalBlogPosts: number
  publishedPosts: number
  draftPosts: number
  totalCourses: number
  publishedCourses: number
  totalLeads: number
  unreadContacts: number
  totalNewsletter: number
  totalTestimonials: number
  totalTeamMembers: number
  totalFaq: number
  totalAcademyResources: number
  totalWorkshops: number
  totalMedia: number
  totalUsers: number
  totalCategories: number
  totalTags: number
  aiGeneratedPosts: number
  unreadProjectRequests: number
  unconfirmedBookCalls: number
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    totalProjects,
    activeProjects,
    totalServices,
    activeServices,
    totalBlogPosts,
    publishedPosts,
    draftPosts,
    totalCourses,
    publishedCourses,
    totalLeads,
    unreadContacts,
    totalNewsletter,
    totalTestimonials,
    totalTeamMembers,
    totalFaq,
    totalAcademyResources,
    totalWorkshops,
    totalMedia,
    totalUsers,
    totalCategories,
    totalTags,
    aiGeneratedPosts,
    unreadProjectRequests,
    unconfirmedBookCalls,
  ] = await Promise.all([
    db.project.count(),
    db.project.count({ where: { isActive: true } }),
    db.service.count(),
    db.service.count({ where: { isActive: true } }),
    db.blogPost.count(),
    db.blogPost.count({ where: { isPublished: true } }),
    db.blogPost.count({ where: { isPublished: false } }),
    db.course.count(),
    db.course.count({ where: { isPublished: true } }),
    db.contactRequest.count(),
    db.contactRequest.count({ where: { isRead: false } }),
    db.newsletterSubscriber.count({ where: { isActive: true } }),
    db.testimonial.count({ where: { isActive: true } }),
    db.teamMember.count({ where: { isActive: true } }),
    db.fAQ.count({ where: { isActive: true } }),
    db.resource.count(),
    db.workshop.count(),
    db.media.count(),
    db.user.count(),
    db.blogCategory.count(),
    db.blogPost.aggregate({
      _sum: { readingTime: true },
    }).then(r => r._sum.readingTime ?? 0).catch(() => 0),
    db.blogPost.count({ where: { focusKeyword: { not: null } } }),
    db.startProject.count({ where: { isRead: false } }),
    db.bookCall.count({ where: { isConfirmed: false } }),
  ])

  return {
    totalProjects,
    activeProjects,
    totalServices,
    activeServices,
    totalBlogPosts,
    publishedPosts,
    draftPosts,
    totalCourses,
    publishedCourses,
    totalLeads,
    unreadContacts,
    totalNewsletter,
    totalTestimonials,
    totalTeamMembers,
    totalFaq,
    totalAcademyResources,
    totalWorkshops,
    totalMedia,
    totalUsers,
    totalCategories,
    totalTags,
    aiGeneratedPosts,
    unreadProjectRequests,
    unconfirmedBookCalls,
  }
}

export interface RecentActivityItem {
  id: string
  user: string
  action: string
  detail: string
  time: string
}

export async function getRecentActivity(): Promise<RecentActivityItem[]> {
  const activity: RecentActivityItem[] = []

  const [recentPosts, recentContacts, recentProjects] = await Promise.all([
    db.blogPost.findMany({ orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, createdAt: true } }),
    db.contactRequest.findMany({ orderBy: { createdAt: "desc" }, take: 2, select: { id: true, name: true, createdAt: true } }),
    db.project.findMany({ orderBy: { createdAt: "desc" }, take: 2, select: { id: true, title: true, createdAt: true } }),
  ])

  for (const post of recentPosts) {
    activity.push({
      id: `post-${post.id}`,
      user: "System",
      action: "published a new blog post",
      detail: post.title,
      time: timeAgo(post.createdAt),
    })
  }

  for (const contact of recentContacts) {
    activity.push({
      id: `contact-${contact.id}`,
      user: contact.name,
      action: "submitted a contact form",
      detail: "New inquiry received",
      time: timeAgo(contact.createdAt),
    })
  }

  for (const project of recentProjects) {
    activity.push({
      id: `project-${project.id}`,
      user: "System",
      action: "added new project",
      detail: project.title,
      time: timeAgo(project.createdAt),
    })
  }

  activity.sort((a, b) => {
    const aTime = parseTimeAgo(a.time)
    const bTime = parseTimeAgo(b.time)
    return aTime - bTime
  })

  return activity.slice(0, 8)
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

function parseTimeAgo(time: string): number {
  const match = time.match(/(\d+)\s*(sec|min|hour|day|month)/)
  if (!match) return Date.now()
  const num = parseInt(match[1], 10)
  const unit = match[2]
  const multipliers: Record<string, number> = { sec: 1000, min: 60000, hour: 3600000, day: 86400000, month: 2592000000 }
  return Date.now() - num * (multipliers[unit] || 0)
}

export interface PendingTask {
  label: string
  count: number
  urgent: boolean
}

export async function getPendingTasks(): Promise<PendingTask[]> {
  const [unreadContacts, unreadProjects, unconfirmedCalls, inactiveNewsletter] = await Promise.all([
    db.contactRequest.count({ where: { isRead: false } }),
    db.startProject.count({ where: { isRead: false } }),
    db.bookCall.count({ where: { isConfirmed: false } }),
    db.newsletterSubscriber.count({ where: { isActive: false } }),
  ])

  const tasks: PendingTask[] = []

  if (unreadContacts > 0) tasks.push({ label: "Respond to contact forms", count: unreadContacts, urgent: unreadContacts > 5 })
  if (unreadProjects > 0) tasks.push({ label: "Review new project requests", count: unreadProjects, urgent: unreadProjects > 3 })
  if (unconfirmedCalls > 0) tasks.push({ label: "Confirm book calls", count: unconfirmedCalls, urgent: false })

  if (tasks.length === 0) {
    tasks.push({ label: "No pending tasks", count: 0, urgent: false })
  }

  return tasks.slice(0, 5)
}
