"use client"

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <h1 className="text-h1 mb-4">Une erreur est survenue</h1>
      <p className="text-body text-text-secondary max-w-md mb-8">Veuillez reessayer.</p>
      <button onClick={reset} className="text-accent hover:underline">Reessayer</button>
    </div>
  )
}
