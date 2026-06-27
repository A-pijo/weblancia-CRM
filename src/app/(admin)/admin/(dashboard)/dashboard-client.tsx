"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { StatCard } from "@/components/admin/stat-card"
import { SectionCard } from "@/components/admin/section-card"
import { ActivityCard } from "@/components/admin/activity-card"
import { RevenueAreaChart, TrafficLineChart } from "@/components/admin/charts/area-chart"
import { ProjectsBarChart } from "@/components/admin/charts/bar-chart"
import { ProjectStatusPieChart } from "@/components/admin/charts/pie-chart"
import type { ReactNode } from "react"

interface Stat {
  label: string
  value: string
  trend?: { value: string; positive: boolean }
  icon: ReactNode
  delay: number
}

interface Activity {
  id: string
  user: string
  action: string
  detail: string
  time: string
}

export function DashboardHomeClient({
  greeting,
  displayName,
  stats,
  recentActivity,
}: {
  greeting: string
  displayName: string
  stats: Stat[]
  recentActivity: Activity[]
}) {
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
        {stats.slice(0, 5).map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <SectionCard title="Revenue Overview" description="Monthly revenue comparison vs previous year">
            <RevenueAreaChart />
          </SectionCard>
        </div>
        <div className="lg:col-span-4">
          <SectionCard title="Traffic" description="Weekly website traffic">
            <TrafficLineChart />
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.slice(5).map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <SectionCard title="Projects by Service" description="Distribution across service categories">
            <ProjectsBarChart />
          </SectionCard>
        </div>
        <div className="lg:col-span-3">
          <SectionCard title="Project Status" description="Current project lifecycle">
            <div className="relative">
              <ProjectStatusPieChart />
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
              {[
                { label: "Review new testimonials", count: "3", urgent: true },
                { label: "Approve blog comments", count: "7", urgent: false },
                { label: "Update service pricing", count: "2", urgent: true },
                { label: "Complete SEO audit", count: "1", urgent: true },
                { label: "Respond to contact forms", count: "5", urgent: false },
              ].map((task) => (
                <div key={task.label} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-admin-surface transition-colors group cursor-pointer">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${task.urgent ? "bg-admin-accent" : "bg-admin-text-tertiary"}`} />
                  <span className="flex-1 text-sm text-admin-text-secondary group-hover:text-admin-text-primary transition-colors">{task.label}</span>
                  <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${task.urgent ? "bg-admin-accent/10 text-admin-accent" : "bg-admin-surface/50 text-admin-text-secondary"}`}>{task.count}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SectionCard title="Recent Contacts" description="Latest client inquiries">
            <div className="space-y-3">
              {[
                { name: "Jean Dupont", company: "TechStart", type: "Project", time: "1 hour ago" },
                { name: "Marie Laurent", company: "Design Studio", type: "Consultation", time: "3 hours ago" },
                { name: "Pierre Moreau", company: "E-shop Plus", type: "Quote", time: "5 hours ago" },
                { name: "Sophie Bernard", company: "Agence Créa", type: "Support", time: "1 day ago" },
              ].map((contact) => (
                <div key={contact.name} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-admin-surface transition-colors group cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-admin-surface flex items-center justify-center text-xs text-admin-text-secondary font-medium">{contact.name.split(" ").map(n => n[0]).join("")}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-admin-text-primary truncate group-hover:text-white transition-colors">{contact.name}</p>
                    <p className="text-xs text-admin-text-tertiary truncate">{contact.company}</p>
                  </div>
                  <span className="text-[10px] text-admin-text-muted">{contact.time}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
        <div className="lg:col-span-2">
          <SectionCard title="Performance Metrics" description="Key indicators at a glance">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Avg. Session Duration", value: "4m 32s", change: "+12%" },
                { label: "Bounce Rate", value: "32.1%", change: "-5%" },
                { label: "Pages per Session", value: "3.8", change: "+8%" },
                { label: "Goal Completions", value: "247", change: "+22%" },
              ].map((metric) => (
                <div key={metric.label} className="bg-admin-bg-tertiary rounded-lg p-4 border border-admin-border">
                  <p className="text-xs text-admin-text-tertiary mb-1">{metric.label}</p>
                  <div className="flex items-end justify-between">
                    <span className="text-lg font-semibold text-admin-text-primary">{metric.value}</span>
                    <span className="text-xs text-admin-success">{metric.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  )
}
