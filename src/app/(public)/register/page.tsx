"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { Container } from "@/components/shared/container"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [hpWebsite, setHpWebsite] = useState("")

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    if (hpWebsite) return
    setLoading(true)
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error?.message ?? data.error ?? "Registration failed")
      }
    } catch {
      setError("Connection error")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="py-20">
        <Container>
          <div className="max-w-md mx-auto text-center space-y-4">
            <h1 className="text-h1 text-text-primary">Account Created</h1>
            <p className="text-body text-text-secondary">Your account has been created. An administrator will activate it shortly. You will receive an email notification.</p>
            <Link href="/" className="text-accent hover:underline text-body-sm">Return to home</Link>
          </div>
        </Container>
      </section>
    )
  }

  return (
    <section className="py-20">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-h1 text-text-primary mb-2">Create Account</h1>
          <p className="text-body-sm text-text-secondary mb-8">Register to access the admin panel.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
              <label htmlFor="website">Website</label>
              <input id="website" type="text" value={hpWebsite} onChange={(e) => setHpWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>
            <div>
              <label htmlFor="name" className="block text-caption text-text-primary mb-1">Name</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full h-12 px-4 rounded-radius-md bg-surface border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent text-body-sm" />
            </div>
            <div>
              <label htmlFor="email" className="block text-caption text-text-primary mb-1">Email</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-12 px-4 rounded-radius-md bg-surface border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent text-body-sm" />
            </div>
            <div>
              <label htmlFor="password" className="block text-caption text-text-primary mb-1">Password</label>
              <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="w-full h-12 px-4 rounded-radius-md bg-surface border border-border text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent text-body-sm" />
            </div>
            {error && <p className="text-caption text-danger">{error}</p>}
            <button type="submit" disabled={loading} className="w-full h-12 rounded-radius-md bg-accent text-white hover:bg-accent-hover text-button font-medium transition-all disabled:opacity-50">
              {loading ? "..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-caption text-text-secondary mt-6">
            Already have an account? <Link href="/admin/login" className="text-accent hover:underline">Sign in</Link>
          </p>
        </div>
      </Container>
    </section>
  )
}
