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
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="py-12 md:py-16 lg:py-24 bg-bg-secondary">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <p className="text-body text-accent font-semibold">Thanks! Check your inbox.</p>
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
              className={cn(
                "inline-flex items-center justify-center h-12 px-6 rounded-radius-md shrink-0",
                "bg-accent text-white hover:bg-accent-hover",
                "text-button font-medium transition-all duration-200",
                "focus-visible:outline-2 focus-visible:outline-focus-ring focus-visible:outline-offset-4",
                "active:scale-[0.97]",
              )}
            >
              {buttonLabel}
            </button>
          </form>
        </div>
      </Container>
    </section>
  )
}

export { NewsletterSignup }
