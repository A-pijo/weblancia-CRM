"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import dynamic from "next/dynamic"
import { StatCard } from "@/components/admin/stat-card"
import { SectionCard } from "@/components/admin/section-card"
import { ActivityCard } from "@/components/admin/activity-card"
import type { DashboardStats, RecentActivityItem, PendingTask } from "@/types/dashboard"

const RevenueAreaChart = dynamic(() => import("@/components/admin/charts/area-chart").then((m) => m.RevenueAreaChart), { ssr: false })
const TrafficLineChart = dynamic(() => import("@/components/admin/charts/area-chart").then((m) => m.TrafficLineChart), { ssr: false })
const ProjectsBarChart = dynamic(() => import("@/components/admin/charts/bar-chart").then((m) => m.ProjectsBarChart), { ssr: false })
const ProjectStatusPieChart = dynamic(() => import("@/components/admin/charts/pie-chart").then((m) => m.ProjectStatusPieChart), { ssr: false })

interface DashboardHomeClientProps {
  greeting: string
  displayName: string
  stats: DashboardStats
  recentActivity: RecentActivityItem[]
  pendingTasks: PendingTask[]
}

export function DashboardHomeClient({ greeting, displayName, stats, recentActivity, pendingTasks }: DashboardHomeClientProps) {
  const topCards = [
    { label: "Active Projects", value: String(stats.activeProjects), icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10" },
    { label: "Services", value: String(stats.totalServices), icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" },
    { label: "Published Posts", value: String(stats.publishedPosts), icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8" },
    { label: "Total Leads", value: String(stats.totalLeads), icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" },
    { label: "Academy Courses", value: String(stats.publishedCourses), icon: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5" },
  ]

  const bottomCards = [
    { label: "Unread Messages", value: String(stats.unreadContacts), icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6" },
    { label: "Newsletter", value: String(stats.totalNewsletter), icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
    { label: "Draft Posts", value: String(stats.draftPosts), icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" },
    { label: "Testimonials", value: String(stats.totalTestimonials), icon: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" },
    { label: "Team Members", value: String(stats.totalTeamMembers), icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold text-admin-text-primary tracking-tight">
            {greeting}, {displayName}
          </h1>
          <p className="text-sm text-admin-text-secondary mt-1">Here&apos;s a complete overview of your business performance.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {topCards.map((card, i) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={<Icon path={card.icon} />} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SectionCard title="Projects Overview" description="Projects by month">
            <RevenueAreaChart data={[]} />
          </SectionCard>
        </div>
        <div className="lg:col-span-4">
          <SectionCard title="Leads by Type" description="Distribution across lead types">
            <TrafficLineChart data={[]} />
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {bottomCards.map((card, i) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={<Icon path={card.icon} />} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <SectionCard title="Projects by Service" description="Distribution across service categories">
            <ProjectsBarChart data={[]} />
          </SectionCard>
        </div>
        <div className="lg:col-span-3">
          <SectionCard title="Project Status" description="Current project lifecycle">
            <div className="relative">
              <ProjectStatusPieChart data={[]} />
            </div>
          </SectionCard>
        </div>
        <div className="lg:col-span-4">
          <SectionCard title="Quick Actions" description="Common admin tasks">
            <div className="space-y-2">
              {[
                { label: "New Service", icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z", href: "/admin/services/new", desc: "Add a new service offering" },
                { label: "New Project", icon: "M12 4v16m8-8H4", href: "/admin/work/new", desc: "Showcase your work" },
                { label: "New Blog", icon: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z", href: "/admin/blog/new", desc: "Write and publish content" },
                { label: "Upload Media", icon: "M15 3h6v6 M9 21H3v-6 M21 3l-7 7 M3 21l7-7", href: "/admin/media", desc: "Add images and files" },
                { label: "Add Course", icon: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5", href: "/admin/academy/courses/new", desc: "Create a new course" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-admin-surface transition-colors group"
                >
                  <div className="w-9 h-9 rounded-lg bg-admin-surface flex items-center justify-center text-admin-text-secondary group-hover:text-admin-accent group-hover:bg-admin-accent/10 transition-all duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={item.icon} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-admin-text-primary group-hover:text-white transition-colors">{item.label}</p>
                    <p className="text-xs text-admin-text-tertiary">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SectionCard title="Recent Activity" description="Latest actions across your platform">
            <ActivityCard items={recentActivity} />
          </SectionCard>
        </div>
        <div>
          <SectionCard title="Pending Tasks" description="Items requiring attention">
            <div className="space-y-3">
              {pendingTasks.length === 0 ? (
                <p className="text-sm text-admin-text-tertiary px-3 py-2">No pending tasks</p>
              ) : (
                pendingTasks.map((task) => (
                  <div key={task.label} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-admin-surface transition-colors group cursor-pointer">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${task.urgent ? "bg-admin-accent" : task.count === 0 ? "bg-admin-success" : "bg-admin-text-tertiary"}`} />
                    <span className="flex-1 text-sm text-admin-text-secondary group-hover:text-admin-text-primary transition-colors">{task.label}</span>
                    {task.count > 0 && (
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${task.urgent ? "bg-admin-accent/10 text-admin-accent" : "bg-admin-surface/50 text-admin-text-secondary"}`}>{task.count}</span>
                    )}
                  </div>
                ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <SectionCard title="Database Summary" description="All counts from the database">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: "Total Projects", value: stats.totalProjects },
                { label: "Active Services", value: stats.activeServices },
                { label: "Blog Posts", value: stats.totalBlogPosts },
                { label: "Published", value: stats.publishedPosts },
                { label: "Drafts", value: stats.draftPosts },
                { label: "Courses", value: stats.totalCourses },
                { label: "Workshops", value: stats.totalWorkshops },
                { label: "Resources", value: stats.totalAcademyResources },
                { label: "Total Leads", value: stats.totalLeads },
                { label: "Newsletter", value: stats.totalNewsletter },
                { label: "Team Members", value: stats.totalTeamMembers },
                { label: "Testimonials", value: stats.totalTestimonials },
                { label: "FAQ Entries", value: stats.totalFaq },
                { label: "Media Files", value: stats.totalMedia },
                { label: "Users", value: stats.totalUsers },
                { label: "Categories", value: stats.totalCategories },
                { label: "AI Generated", value: stats.aiGeneratedPosts },
              ].map((item) => (
                <div key={item.label} className="bg-admin-bg-tertiary rounded-lg p-3 border border-admin-border">
                  <p className="text-xs text-admin-text-tertiary mb-1">{item.label}</p>
                  <span className="text-lg font-semibold text-admin-text-primary">{item.value}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}

function Icon({ path }: { path: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}
