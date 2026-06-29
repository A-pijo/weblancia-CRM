import { getSession } from "@/lib/auth/session"
import { getDashboardStats, getRecentActivity, getPendingTasks } from "@/lib/dashboard/queries"
import { DashboardHomeClient } from "./dashboard-client"

export default async function AdminDashboard() {
  const session = await getSession()
  const stats = await getDashboardStats()
  const recentActivity = await getRecentActivity()
  const pendingTasks = await getPendingTasks()

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
