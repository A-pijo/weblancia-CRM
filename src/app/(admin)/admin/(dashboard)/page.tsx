import { getSession } from "@/lib/auth/session"
import { StatCard } from "@/components/admin/stat-card"
import { SectionCard } from "@/components/admin/section-card"
import { RevenueAreaChart, TrafficLineChart } from "@/components/admin/charts/area-chart"
import { ProjectsBarChart } from "@/components/admin/charts/bar-chart"
import { ProjectStatusPieChart } from "@/components/admin/charts/pie-chart"
import { DashboardHomeClient } from "./dashboard-client"

function Icon({ path }: { path: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d={path} />
    </svg>
  )
}

const icons = {
  projects: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
  services: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
  blog: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  leads: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75",
  revenue: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  traffic: "M22 12h-4l-3 9L9 3l-3 9H2",
  newsletter: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  conversion: "M22 11.08V12a10 10 0 1 1-5.93-9.14 M22 4 12 14.01l-3-3",
  seo: "M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z",
  academic: "M22 10v6M2 10l10-5 10 5-10 5z M6 12v5c3 3 9 3 12 0v-5",
}

const stats = [
  { label: "Revenue", value: "$138,200", trend: { value: "+23%", positive: true }, icon: <Icon path={icons.revenue} />, delay: 0 },
  { label: "Active Projects", value: "18", trend: { value: "+4", positive: true }, icon: <Icon path={icons.projects} />, delay: 0.05 },
  { label: "Services", value: "12", trend: { value: "+2", positive: true }, icon: <Icon path={icons.services} />, delay: 0.1 },
  { label: "Blog Posts", value: "42", trend: { value: "+18%", positive: true }, icon: <Icon path={icons.blog} />, delay: 0.15 },
  { label: "Academy Courses", value: "24", trend: { value: "+6", positive: true }, icon: <Icon path={icons.academic} />, delay: 0.2 },
  { label: "SEO Score", value: "94", trend: { value: "+5%", positive: true }, icon: <Icon path={icons.seo} />, delay: 0.25 },
  { label: "New Leads", value: "156", trend: { value: "+8%", positive: true }, icon: <Icon path={icons.leads} />, delay: 0.3 },
  { label: "Conversion Rate", value: "3.2%", trend: { value: "+0.8%", positive: true }, icon: <Icon path={icons.conversion} />, delay: 0.35 },
  { label: "Traffic", value: "12.4K", trend: { value: "+15%", positive: true }, icon: <Icon path={icons.traffic} />, delay: 0.4 },
  { label: "Newsletter", value: "1,284", trend: { value: "+5%", positive: true }, icon: <Icon path={icons.newsletter} />, delay: 0.45 },
]

const recentActivity = [
  { id: "1", user: "Admin", action: "published a new blog post", detail: "Tendances Web 2025", time: "2 min ago" },
  { id: "2", user: "Admin", action: "updated service page", detail: "SEO & Marketing Digital", time: "15 min ago" },
  { id: "3", user: "Admin", action: "added new project", detail: "E-commerce Fashion Luxe", time: "1 hour ago" },
  { id: "4", user: "Admin", action: "modified testimonial", detail: "Sophie Martin - ABC Corp", time: "3 hours ago" },
  { id: "5", user: "Admin", action: "created FAQ entry", detail: "How long does a website take?", time: "5 hours ago" },
  { id: "6", user: "Admin", action: "updated academy course", detail: "React & Next.js Complete", time: "1 day ago" },
  { id: "7", user: "Admin", action: "uploaded media files", detail: "Portfolio images batch", time: "1 day ago" },
  { id: "8", user: "Admin", action: "responded to lead", detail: "Start Project form - TechStart", time: "2 days ago" },
]

export default async function AdminDashboard() {
  const session = await getSession()

  const greeting = (() => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  })()

  const displayName = session?.name ?? "Admin"

  return (
    <DashboardHomeClient greeting={greeting} displayName={displayName} stats={stats} recentActivity={recentActivity} />
  )
}
