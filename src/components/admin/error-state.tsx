"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface AdminErrorStateProps {
  message?: string
  onRetry?: () => void
  fullPage?: boolean
}

export function AdminErrorState({ message, onRetry, fullPage }: AdminErrorStateProps) {
  const router = useRouter()
  const [showDetails, setShowDetails] = useState(false)

  const container = fullPage
    ? "flex min-h-[calc(100vh-8rem)] items-center justify-center p-8"
    : "flex items-center justify-center py-20 px-4"

  const errorMessage = message ?? "Impossible de charger les données. L'API ou la base de données est peut-être indisponible."

  return (
    <div className={container}>
      <div className="max-w-sm text-center">
        <div className="w-14 h-14 rounded-2xl bg-admin-danger/10 flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-admin-danger">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>
        <h3 className="text-base font-semibold text-admin-text-primary mb-2">Une erreur est survenue</h3>
        <p className="text-sm text-admin-text-secondary mb-6 leading-relaxed">
          {errorMessage}
        </p>
        {process.env.NODE_ENV === "development" && (
          <div className="mb-6">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-admin-text-tertiary hover:text-admin-text-secondary transition-colors underline underline-offset-2"
            >
              {showDetails ? "Masquer les détails techniques" : "Afficher les détails techniques"}
            </button>
            {showDetails && (
              <pre className="mt-2 text-xs text-left bg-admin-bg-tertiary border border-admin-border rounded-lg p-3 overflow-auto max-h-32 text-admin-text-secondary">
                {`Error: ${errorMessage}\nTimestamp: ${new Date().toISOString()}\nUser-Agent: ${typeof navigator !== "undefined" ? navigator.userAgent : "SSR"}`}
              </pre>
            )}
          </div>
        )}
        <div className="flex items-center justify-center gap-3">
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-admin-accent text-white text-sm font-medium hover:bg-admin-accent-hover transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></svg>
              Réessayer
            </button>
          )}
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-admin-surface/60 border border-admin-text-muted/50 text-admin-text-primary text-sm font-medium hover:bg-admin-surface/80 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Retour au tableau de bord
          </button>
        </div>
      </div>
    </div>
  )
}
