"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg p-8">
      <div className="max-w-md text-center">
        <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256" fill="currentColor" className="text-danger">
            <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V80a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,172Z" />
          </svg>
        </div>
        <h1 className="text-h2 font-semibold mb-2">Une erreur est survenue</h1>
        <p className="text-body text-text-secondary mb-8">
          Un problème inattendu s&apos;est produit. Veuillez réessayer ou contacter l&apos;équipe technique.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button variant="primary" onClick={reset}>
            Réessayer
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = "/admin"}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  )
}
