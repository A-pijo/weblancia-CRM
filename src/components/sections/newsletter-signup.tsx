"use client"

import { useState, type FormEvent } from "react"
import { cn } from "@/lib/utils/cn"
import { Container } from "@/components/shared/container"

interface NewsletterSignupProps {
  placeholder?: string
  buttonLabel?: string
}

function NewsletterSignup({
  placeholder = "Enter your email",
  buttonLabel = "Subscribe",
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("")
  const [hpUrl, setHpUrl] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [error, setError] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (hpUrl) return

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setStatus("loading")
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus("success")
      } else {
        setStatus("error")
        setError(data.error || "Une erreur est survenue")
      }
    } catch {
      setStatus("error")
      setError("Erreur de connexion")
    }
  }

  if (status === "success") {
    return (
      <section className="py-12 md:py-16 lg:py-24 bg-bg-secondary">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <p className="text-body text-accent font-semibold">Merci ! Vérifiez votre boîte de réception.</p>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-16 lg:py-24 bg-bg-secondary">
      <Container>
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
              <label htmlFor="hp_url">URL</label>
              <input id="hp_url" type="text" value={hpUrl} onChange={(e) => setHpUrl(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className={cn(
                  "w-full h-12 px-4 rounded-radius-md",
                  "bg-surface border text-text-primary placeholder:text-text-tertiary",
                  "border-border hover:border-border-hover",
                  "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent",
                  "text-body-sm transition-colors duration-200",
                  error && "border-danger",
                )}
              />
              {error && (
                <p className="text-caption text-danger mt-1">{error}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className={cn(
                "inline-flex items-center justify-center h-12 px-6 rounded-radius-md shrink-0",
                "bg-accent text-white hover:bg-accent-hover",
                "text-button font-medium transition-all duration-200",
                "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-4",
                "active:scale-[0.97]",
                status === "loading" && "opacity-50 cursor-not-allowed",
              )}
            >
              {status === "loading" ? "..." : buttonLabel}
            </button>
          </form>
        </div>
      </Container>
    </section>
  )
}

export { NewsletterSignup }
