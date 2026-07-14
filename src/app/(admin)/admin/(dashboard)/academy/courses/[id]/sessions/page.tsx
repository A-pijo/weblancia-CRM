"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { SectionCard } from "@/components/admin/section-card"
import { ActionButton } from "@/components/admin/action-button"
import { cn } from "@/lib/utils/cn"

export default function AdminCourseSessionsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const courseId = Number(params.id)

  const [sessions, setSessions] = useState<any[]>([])
  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [form, setForm] = useState({
    title: "",
    meetingLink: "",
    meetingPassword: "",
    trainer: "",
    startDate: "",
    endDate: "",
    timezone: "",
    maxParticipants: "",
  })

  const fetchSessions = useCallback(async () => {
    const res = await fetch(`/api/academy/sessions?courseId=${courseId}`)
    const data = await res.json()
    setSessions(data.data?.items ?? [])
  }, [courseId])

  const fetchCourse = useCallback(async () => {
    const res = await fetch(`/api/academy/courses/${courseId}`)
    if (res.ok) {
      const data = await res.json()
      setCourse(data.data)
    }
  }, [courseId])

  useEffect(() => {
    async function load() {
      setLoading(true)
      await Promise.all([fetchSessions(), fetchCourse()])
      setLoading(false)
    }
    load()
  }, [fetchSessions, fetchCourse])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.startDate) return
    setSubmitting(true)
    try {
      await fetch("/api/academy/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          title: form.title,
          meetingLink: form.meetingLink || undefined,
          meetingPassword: form.meetingPassword || undefined,
          trainer: form.trainer || undefined,
          startDate: form.startDate,
          endDate: form.endDate || undefined,
          timezone: form.timezone || undefined,
          maxParticipants: form.maxParticipants ? Number(form.maxParticipants) : undefined,
        }),
      })
      setForm({ title: "", meetingLink: "", meetingPassword: "", trainer: "", startDate: "", endDate: "", timezone: "", maxParticipants: "" })
      fetchSessions()
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this session?")) return
    await fetch(`/api/academy/sessions/${id}`, { method: "DELETE" })
    fetchSessions()
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Course Sessions" description="Loading..." />
        <div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={course ? `Sessions: ${course.title}` : "Course Sessions"}
        description="Manage sessions for this course"
        actions={
          <ActionButton variant="secondary" onClick={() => router.push(`/admin/academy/courses/${courseId}`)}>
            Back to Course
          </ActionButton>
        }
      />

      <SectionCard title="Add New Session" description="Create a new session for this course">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">Title *</label>
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="Session title" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">Trainer</label>
              <input type="text" value={form.trainer} onChange={(e) => setForm({ ...form, trainer: e.target.value })}
                className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="Trainer name" />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">Timezone</label>
              <input type="text" value={form.timezone} onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="e.g. UTC, EST" />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">Start Date *</label>
              <input type="datetime-local" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors [color-scheme:dark]" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">End Date</label>
              <input type="datetime-local" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">Meeting Link</label>
              <input type="url" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="https://meet.google.com/..." />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">Meeting Password</label>
              <input type="text" value={form.meetingPassword} onChange={(e) => setForm({ ...form, meetingPassword: e.target.value })}
                className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="Password" />
            </div>
            <div>
              <label className="block text-xs font-medium text-admin-text-secondary mb-1.5">Max Participants</label>
              <input type="number" value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })}
                className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary placeholder-admin-text-tertiary outline-none focus:border-admin-text-muted transition-colors"
                placeholder="e.g. 30" min="1" />
            </div>
          </div>
          <div className="flex justify-end">
            <ActionButton disabled={submitting || !form.title || !form.startDate}>
              {submitting ? "Creating..." : "Create Session"}
            </ActionButton>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="Sessions" description={`${sessions.length} session${sessions.length === 1 ? "" : "s"} scheduled`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-admin-border/30">
                <th className="text-left font-medium text-admin-text-secondary py-3 px-3">Title</th>
                <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden sm:table-cell">Trainer</th>
                <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden md:table-cell">Start</th>
                <th className="text-left font-medium text-admin-text-secondary py-3 px-3 hidden md:table-cell">End</th>
                <th className="text-center font-medium text-admin-text-secondary py-3 px-3 hidden lg:table-cell">Max</th>
                <th className="text-right font-medium text-admin-text-secondary py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((s) => (
                <tr key={s.id} className="border-b border-admin-border/20 hover:bg-admin-surface/20 transition-colors">
                  <td className="px-3 py-3">
                    <span className="text-admin-text-primary">{s.title}</span>
                    {s.meetingLink && (
                      <p className="text-xs text-admin-text-tertiary mt-0.5 truncate max-w-[200px]">{s.meetingLink}</p>
                    )}
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className="text-xs text-admin-text-secondary">{s.trainer ?? "—"}</span>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs text-admin-text-secondary">{new Date(s.startDate).toLocaleString()}</span>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs text-admin-text-secondary">{s.endDate ? new Date(s.endDate).toLocaleString() : "—"}</span>
                  </td>
                  <td className="px-3 py-3 text-center hidden lg:table-cell">
                    <span className="text-xs text-admin-text-secondary">{s.maxParticipants ?? "—"}</span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button type="button" onClick={() => handleDelete(s.id)}
                      className="p-1.5 rounded text-admin-text-secondary hover:text-admin-danger hover:bg-admin-danger/10 transition-colors" aria-label="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {sessions.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-12 text-center text-admin-text-secondary text-sm">No sessions created yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  )
}
