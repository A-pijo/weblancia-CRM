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

export interface RecentActivityItem {
  id: string
  user: string
  action: string
  detail: string
  time: string
}

export interface PendingTask {
  label: string
  count: number
  urgent: boolean
}
