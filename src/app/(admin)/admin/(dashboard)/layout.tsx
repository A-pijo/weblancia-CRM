import dynamic from "next/dynamic"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth/session"
import type { ReactNode } from "react"
import type { Metadata } from "next"

const DashboardLayout = dynamic(() => import("@/components/admin/dashboard-layout").then((m) => m.DashboardLayout))

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Administration | Weblancia",
}

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  if (!session) redirect("/admin/login")

  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}
