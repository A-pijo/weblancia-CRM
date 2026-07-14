import { prisma } from "@/lib/database/prisma"
import { logger } from "@/lib/logger"

function safeCount<T>(query: Promise<T>): Promise<number> {
  return query.then((r) => (typeof r === "number" ? r : 0)).catch((e) => {
    logger.error("Dashboard count query failed", e, "dashboard")
    return 0
  })
}

function safeFindMany<T>(query: Promise<T[]>): Promise<T[]> {
  return query.catch((e) => {
    logger.error("Dashboard findMany query failed", e, "dashboard")
    return []
  })
}

export class DashboardService {
  async getStats() {
    const [projects, services, blogPosts, courses, leads, testimonials, teamMembers, faqCount, mediaCount, users, contacts, bookCalls, projectRequests, newsletterSubs] = await Promise.all([
      safeCount(prisma.project.count()), safeCount(prisma.service.count()), safeCount(prisma.blogPost.count()), safeCount(prisma.course.count()),
      safeCount(prisma.lead.count()), safeCount(prisma.testimonial.count()), safeCount(prisma.teamMember.count()),
      safeCount(prisma.fAQ.count()), safeCount(prisma.media.count()), safeCount(prisma.user.count()), safeCount(prisma.contactRequest.count()),
      safeCount(prisma.bookCall.count()), safeCount(prisma.startProject.count()), safeCount(prisma.newsletterSubscriber.count()),
    ])
    return { projects, services, blogPosts, courses, leads, testimonials, teamMembers, faqCount, mediaCount, users, contacts, bookCalls, projectRequests, newsletterSubs }
  }

  async getRecentActivity(limit = 10) {
    const [recentLeads, recentContacts, recentBlogPosts] = await Promise.all([
      safeFindMany(prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: limit, select: { id: true, name: true, email: true, status: true, createdAt: true } })),
      safeFindMany(prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" }, take: limit, select: { id: true, name: true, email: true, isRead: true, createdAt: true } })),
      safeFindMany(prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: limit, select: { id: true, title: true, publishedAt: true } })),
    ])
    return { recentLeads, recentContacts, recentBlogPosts }
  }
}

export const dashboardService = new DashboardService()
