"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PageHeader } from "@/components/admin/page-header"
import { cn } from "@/lib/utils/cn"
import { LEAD_STATUSES } from "@/lib/validation/leads"

interface User { id: number; name: string; email: string }
interface Note { id: number; content: string; createdAt: string; author: User }
interface TimelineEntry { id: number; action: string; description: string | null; createdAt: string; author: User | null }
interface Lead {
  id: number; name: string; company: string | null; email: string | null; phone: string | null
  whatsapp: string | null; website: string | null; country: string | null; city: string | null
  ipAddress: string | null; browser: string | null; device: string | null; preferredLanguage: string | null
  source: string; service: string | null; message: string | null; budget: string | null
  status: string; assignedToId: number | null; assignedTo: User | null; createdAt: string
  notes: Note[]; timeline: TimelineEntry[]
}

export default function LeadDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [lead, setLead] = useState<Lead | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [sendingEmail, setSendingEmail] = useState(false)

  useEffect(() => {
    async function load() {
      const [leadRes, usersRes] = await Promise.all([
        fetch(`/api/leads/${params.id}`),
        fetch("/api/users").then((r) => r.json()).catch(() => ({ items: [] })),
      ])
      if (leadRes.ok) setLead(await leadRes.json())
      const u = usersRes.items ?? usersRes
      setUsers(Array.isArray(u) ? u : [])
      setLoading(false)
    }
    load()
  }, [params.id])

  async function handleStatusChange(status: string) {
    const res = await fetch(`/api/leads/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "status", status }) })
    if (res.ok) {
      const updated = await res.json()
      setLead((prev) => prev ? { ...prev, status: updated.status } : prev)
      refreshTimeline()
    }
  }

  async function handleAssign(userId: string) {
    const res = await fetch(`/api/leads/${params.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ _action: "assign", assignedToId: userId ? Number(userId) : null }) })
    if (res.ok) {
      const updated = await res.json()
      const assignedUser = users.find((u) => u.id === Number(userId))
      setLead((prev) => prev ? { ...prev, assignedTo: assignedUser ?? null, assignedToId: userId ? Number(userId) : null } : prev)
      refreshTimeline()
    }
  }

  async function addNote() {
    if (!newNote.trim()) return
    const res = await fetch(`/api/leads/${params.id}/notes`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: newNote.trim() }) })
    if (res.ok) {
      setNewNote("")
      refreshTimeline()
      const leadRes = await fetch(`/api/leads/${params.id}`)
      if (leadRes.ok) setLead(await leadRes.json())
    }
  }

  async function refreshTimeline() {
    const res = await fetch(`/api/leads/${params.id}`)
    if (res.ok) {
      const updated = await res.json()
      setLead((prev) => prev ? { ...prev, timeline: updated.timeline } : prev)
    }
  }

  function copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
  }

  if (loading || !lead) {
    return <div className="space-y-6"><PageHeader title="Lead Details" description="Loading..." /><div className="flex items-center justify-center py-12"><div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" /></div></div>
  }

  const statusColors: Record<string, string> = { New: "bg-blue-500/10 text-blue-400", Contacted: "bg-yellow-500/10 text-yellow-400", Qualified: "bg-purple-500/10 text-purple-400", "Proposal Sent": "bg-cyan-500/10 text-cyan-400", Won: "bg-green-500/10 text-green-400", Lost: "bg-red-500/10 text-red-400", Spam: "bg-gray-500/10 text-gray-400" }

  const InfoRow = ({ label, value }: { label: string; value: string | null }) => value ? <div className="flex justify-between py-1.5 border-b border-admin-border/10"><span className="text-xs text-admin-text-tertiary">{label}</span><span className="text-xs text-admin-text-primary text-right max-w-[60%] truncate" title={value}>{value}</span></div> : null

  return (
    <div className="space-y-6">
      <PageHeader title={lead.name} description={`Lead #${lead.id} · ${lead.source}`} actions={
        <button onClick={() => router.push("/admin/leads")} className="h-9 px-4 bg-admin-surface border border-admin-border rounded-lg text-sm text-admin-text-secondary hover:text-admin-text-primary transition-colors">Back to Leads</button>
      } />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-4">
            <h3 className="text-sm font-medium text-admin-text-primary mb-3">Quick Actions</h3>
            <div className="flex flex-wrap gap-2">
              {lead.phone && (
                <>
                  <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-surface text-xs text-admin-text-primary hover:bg-admin-accent/10 hover:text-admin-accent transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                    Call
                  </a>
                  <button onClick={() => copyToClipboard(lead.phone!, "phone")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-surface text-xs text-admin-text-primary hover:bg-admin-accent/10 hover:text-admin-accent transition-colors">
                    {copiedField === "phone" ? "Copied!" : "Copy Phone"}
                  </button>
                  {lead.whatsapp && (
                    <a href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-surface text-xs text-admin-text-primary hover:bg-admin-green/10 hover:text-green-400 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                      WhatsApp
                    </a>
                  )}
                </>
              )}
              {lead.email && (
                <>
                  <a href={`mailto:${lead.email}?subject=Weblancia%20-%20${encodeURIComponent(lead.name)}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-surface text-xs text-admin-text-primary hover:bg-admin-accent/10 hover:text-admin-accent transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                    Email
                  </a>
                  <button onClick={() => copyToClipboard(lead.email!, "email")} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-surface text-xs text-admin-text-primary hover:bg-admin-accent/10 hover:text-admin-accent transition-colors">
                    {copiedField === "email" ? "Copied!" : "Copy Email"}
                  </button>
                </>
              )}
              {lead.website && (
                <a href={lead.website.startsWith("http") ? lead.website : `https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-admin-surface text-xs text-admin-text-primary hover:bg-admin-accent/10 hover:text-admin-accent transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  Website
                </a>
              )}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-admin-text-primary mb-3">Contact Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <div>
                <InfoRow label="Name" value={lead.name} />
                <InfoRow label="Company" value={lead.company} />
                <InfoRow label="Email" value={lead.email} />
                <InfoRow label="Phone" value={lead.phone} />
                <InfoRow label="WhatsApp" value={lead.whatsapp} />
                <InfoRow label="Website" value={lead.website} />
              </div>
              <div>
                <InfoRow label="Country" value={lead.country} />
                <InfoRow label="City" value={lead.city} />
                <InfoRow label="IP Address" value={lead.ipAddress} />
                <InfoRow label="Browser" value={lead.browser} />
                <InfoRow label="Device" value={lead.device} />
                <InfoRow label="Language" value={lead.preferredLanguage} />
              </div>
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-admin-text-primary mb-3">Lead Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <div>
                <InfoRow label="Source" value={lead.source} />
                <InfoRow label="Service" value={lead.service} />
                <InfoRow label="Budget" value={lead.budget} />
              </div>
              <div>
                <InfoRow label="Status" value={lead.status} />
                <InfoRow label="Submitted" value={formatDate(lead.createdAt)} />
                <InfoRow label="Assigned To" value={lead.assignedTo?.name ?? null} />
              </div>
            </div>
            {lead.message && (
              <div className="mt-3 pt-3 border-t border-admin-border/10">
                <p className="text-xs text-admin-text-tertiary mb-1">Message</p>
                <p className="text-xs text-admin-text-primary whitespace-pre-wrap">{lead.message}</p>
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-admin-text-primary mb-3">Internal Notes</h3>
            <div className="flex gap-2 mb-4">
              <textarea value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add a note..."
                className="flex-1 px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors resize-none"
                rows={2} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); addNote() } }} />
              <button onClick={addNote} disabled={!newNote.trim()} className="px-4 py-2 bg-admin-accent text-white text-sm rounded-lg hover:bg-admin-accent-hover disabled:opacity-50 transition-colors h-fit">Add</button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {lead.notes.length === 0 && <p className="text-xs text-admin-text-tertiary text-center py-4">No notes yet</p>}
              {lead.notes.map((note) => (
                <div key={note.id} className="bg-admin-surface/30 rounded-lg p-3 border border-admin-border/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-admin-text-primary">{note.author.name}</span>
                    <span className="text-[10px] text-admin-text-tertiary">{formatDate(note.createdAt)}</span>
                  </div>
                  <p className="text-xs text-admin-text-secondary whitespace-pre-wrap">{note.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Assignment */}
          <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-admin-text-primary mb-3">Manage Lead</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-admin-text-tertiary block mb-1">Status</label>
                <select value={lead.status} onChange={(e) => handleStatusChange(e.target.value)} className={cn("w-full h-9 px-3 rounded-lg text-sm font-medium outline-none cursor-pointer border-0", statusColors[lead.status] ?? "bg-admin-surface text-admin-text-secondary")}>
                  {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-admin-text-tertiary block mb-1">Assigned To</label>
                <select value={lead.assignedToId ?? ""} onChange={(e) => handleAssign(e.target.value)} className="w-full h-9 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors">
                  <option value="">Unassigned</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-[#141414] border border-admin-border/50 rounded-xl p-5">
            <h3 className="text-sm font-medium text-admin-text-primary mb-3">Activity Timeline</h3>
            <div className="space-y-0 max-h-[500px] overflow-y-auto">
              {lead.timeline.length === 0 && <p className="text-xs text-admin-text-tertiary text-center py-4">No activity yet</p>}
              {lead.timeline.map((entry, i) => {
                const actionIcons: Record<string, string> = { created: "bg-blue-500", status_changed: "bg-yellow-500", assigned: "bg-purple-500", note_added: "bg-cyan-500", viewed: "bg-gray-500" }
                return (
                  <div key={entry.id} className="relative flex gap-3 pb-4 last:pb-0">
                    {i < lead.timeline.length - 1 && <div className="absolute left-[7px] top-4 bottom-0 w-px bg-admin-border/30" />}
                    <div className={cn("w-[15px] h-[15px] rounded-full mt-0.5 shrink-0 ring-2 ring-[#141414]", actionIcons[entry.action] ?? "bg-admin-text-muted")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-admin-text-primary">{entry.description ?? entry.action}</p>
                      <p className="text-[10px] text-admin-text-tertiary mt-0.5">
                        {formatDate(entry.createdAt)}
                        {entry.author && <span> · {entry.author.name}</span>}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
