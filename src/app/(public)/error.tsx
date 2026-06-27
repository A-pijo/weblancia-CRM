"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-h1 mb-4">Une erreur est survenue</h1>
      <p className="text-body text-text-secondary max-w-md mb-8">
        Désolé, quelque chose s&apos;est mal passé. Veuillez réessayer ou nous contacter si le problème persiste.
      </p>
      <Button onClick={reset}>Réessayer</Button>
    </div>
  )
}
