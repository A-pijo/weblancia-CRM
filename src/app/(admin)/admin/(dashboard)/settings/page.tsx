"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/admin/page-header"
import { cn } from "@/lib/utils/cn"

interface SettingsForm {
  companyName: string
  companyTagline: string
  companyDescription: string
  siteUrl: string
  logoUrl: string
  email: string
  emailAcademy: string
  emailCareers: string
  phone: string
  addressCity: string
  addressCountry: string
  businessHours: string
  socialFacebook: string
  socialInstagram: string
  socialLinkedin: string
  socialXTwitter: string
  socialYoutube: string
  socialTiktok: string
  whatsappNumber: string
  googleMapsUrl: string
  defaultSeoTitle: string
  defaultSeoDescription: string
}

const TABS = ["General", "Contact", "Social", "SEO"] as const

const inputClass = "w-full h-10 px-3 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors"
const textareaClass = "w-full px-3 py-2 bg-admin-surface/50 border border-admin-border rounded-lg text-sm text-admin-text-primary outline-none focus:border-admin-text-muted transition-colors min-h-[80px]"
const labelClass = "text-sm text-admin-text-secondary"
const sectionCardClass = "bg-[#141414] border border-admin-border/50 rounded-xl p-6"

export default function AdminSettings() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("General")
  const [form, setForm] = useState<SettingsForm | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          setForm(data.settings)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const update = <K extends keyof SettingsForm>(key: K, value: SettingsForm[K]) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  const handleSave = async () => {
    if (!form) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setMessage({ type: "success", text: "Settings saved successfully." })
        setForm(data.settings)
      } else {
        setMessage({ type: "error", text: data.error ?? "Failed to save settings" })
      }
    } catch {
      setMessage({ type: "error", text: "Network error" })
    } finally {
      setSaving(false)
      setTimeout(() => setMessage(null), 4000)
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Settings" description="Manage site configuration" />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-6 w-6 border-2 border-admin-accent border-t-transparent rounded-full" />
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div>
        <PageHeader title="Settings" description="Manage site configuration" />
        <div className={sectionCardClass}>
          <p className="text-sm text-admin-text-secondary">Failed to load settings.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage site configuration"
        actions={
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-10 px-6 bg-admin-accent text-white text-sm font-medium rounded-lg hover:bg-admin-accent-hover disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        }
      />

      {message && (
        <div
          className={cn(
            "mb-6 px-4 py-3 rounded-lg text-sm",
            message.type === "success"
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20",
          )}
        >
          {message.text}
        </div>
      )}

      <div className="flex border-b border-admin-border/50 gap-0 mb-6">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-[1px] shrink-0",
              tab === t
                ? "text-admin-accent border-admin-accent"
                : "text-admin-text-secondary border-transparent hover:text-admin-text-primary",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "General" && (
        <div className={sectionCardClass}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className={labelClass}>Company Name</label>
              <input className={inputClass} value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Tagline</label>
              <input className={inputClass} value={form.companyTagline} onChange={(e) => update("companyTagline", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2 mt-5">
            <label className={labelClass}>Company Description</label>
            <textarea className={textareaClass} rows={3} value={form.companyDescription} onChange={(e) => update("companyDescription", e.target.value)} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <div className="space-y-2">
              <label className={labelClass}>Site URL</label>
              <input className={inputClass} value={form.siteUrl} onChange={(e) => update("siteUrl", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Logo URL</label>
              <input className={inputClass} value={form.logoUrl} onChange={(e) => update("logoUrl", e.target.value)} placeholder="/images/logo.png" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <div className="space-y-2">
              <label className={labelClass}>Business Hours</label>
              <input className={inputClass} value={form.businessHours} onChange={(e) => update("businessHours", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {tab === "Contact" && (
        <div className={sectionCardClass}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className={labelClass}>Email (General)</label>
              <input className={inputClass} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Email (Academy)</label>
              <input className={inputClass} type="email" value={form.emailAcademy} onChange={(e) => update("emailAcademy", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Email (Careers)</label>
              <input className={inputClass} type="email" value={form.emailCareers} onChange={(e) => update("emailCareers", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>WhatsApp Number</label>
              <input className={inputClass} value={form.whatsappNumber} onChange={(e) => update("whatsappNumber", e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5">
            <div className="space-y-2">
              <label className={labelClass}>Address (City)</label>
              <input className={inputClass} value={form.addressCity} onChange={(e) => update("addressCity", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Address (Country)</label>
              <input className={inputClass} value={form.addressCountry} onChange={(e) => update("addressCountry", e.target.value)} />
            </div>
          </div>
          <div className="space-y-2 mt-5">
            <label className={labelClass}>Google Maps URL</label>
            <input className={inputClass} value={form.googleMapsUrl} onChange={(e) => update("googleMapsUrl", e.target.value)} />
          </div>
        </div>
      )}

      {tab === "Social" && (
        <div className={sectionCardClass}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className={labelClass}>Facebook URL</label>
              <input className={inputClass} value={form.socialFacebook} onChange={(e) => update("socialFacebook", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>Instagram URL</label>
              <input className={inputClass} value={form.socialInstagram} onChange={(e) => update("socialInstagram", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>LinkedIn URL</label>
              <input className={inputClass} value={form.socialLinkedin} onChange={(e) => update("socialLinkedin", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>X / Twitter URL</label>
              <input className={inputClass} value={form.socialXTwitter} onChange={(e) => update("socialXTwitter", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>YouTube URL</label>
              <input className={inputClass} value={form.socialYoutube} onChange={(e) => update("socialYoutube", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelClass}>TikTok URL</label>
              <input className={inputClass} value={form.socialTiktok} onChange={(e) => update("socialTiktok", e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {tab === "SEO" && (
        <div className={sectionCardClass}>
          <div className="space-y-2">
            <label className={labelClass}>Default SEO Title</label>
            <input className={inputClass} value={form.defaultSeoTitle} onChange={(e) => update("defaultSeoTitle", e.target.value)} />
          </div>
          <div className="space-y-2 mt-5">
            <label className={labelClass}>Default SEO Description</label>
            <textarea className={textareaClass} rows={3} value={form.defaultSeoDescription} onChange={(e) => update("defaultSeoDescription", e.target.value)} />
          </div>
        </div>
      )}
    </div>
  )
}
