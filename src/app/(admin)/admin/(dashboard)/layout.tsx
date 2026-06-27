import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import type { ReactNode } from "react"

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
