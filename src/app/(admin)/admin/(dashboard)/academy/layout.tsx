import { AcademyNav } from "@/components/admin/academy/academy-nav"

export default function AdminAcademyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <AcademyNav />
      {children}
    </div>
  )
}
