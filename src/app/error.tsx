"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-bg">
      <h1 className="text-display mb-4">Une erreur est survenue</h1>
      <p className="text-body-lg text-text-secondary max-w-md mb-8">
        Désolé, quelque chose s&apos;est mal passé. Veuillez réessayer ou nous contacter si le problème persiste.
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  )
}
