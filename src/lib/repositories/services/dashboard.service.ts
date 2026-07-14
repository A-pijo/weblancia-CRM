import { prisma } from "@/lib/database/prisma"

export class DashboardService {
  async getStats() {
    const [projects, services, blogPosts, courses, leads, testimonials, teamMembers, faqCount, mediaCount, users, contacts, bookCalls, projectRequests, newsletterSubs] = await Promise.all([
      prisma.project.count(), prisma.service.count(), prisma.blogPost.count(), prisma.course.count(), prisma.lead.count(), prisma.testimonial.count(), prisma.teamMember.count(),
      prisma.fAQ.count(), prisma.media.count(), prisma.user.count(), prisma.contactRequest.count(), prisma.bookCall.count(), prisma.startProject.count(), prisma.newsletterSubscriber.count(),
    ])
    return { projects, services, blogPosts, courses, leads, testimonials, teamMembers, faqCount, mediaCount, users, contacts, bookCalls, projectRequests, newsletterSubs }
  }

  async getRecentActivity(limit = 10) {
    const [recentLeads, recentContacts, recentBlogPosts] = await Promise.all([
      prisma.lead.findMany({ orderBy: { createdAt: "desc" }, take: limit, select: { id: true, name: true, email: true, status: true, createdAt: true } }),
      prisma.contactRequest.findMany({ orderBy: { createdAt: "desc" }, take: limit, select: { id: true, name: true, email: true, isRead: true, createdAt: true } }),
      prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: limit, select: { id: true, title: true, publishedAt: true } }),
    ])
    return { recentLeads, recentContacts, recentBlogPosts }
  }
}

export const dashboardService = new DashboardService()
