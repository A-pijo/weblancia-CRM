import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-5 text-center">
      <h1 className="text-display font-serif font-bold text-text-primary mb-4">
        Page non trouvée
      </h1>
      <p className="text-body-lg text-text-secondary max-w-md mb-10">
        Il semble que cette page n&rsquo;existe pas ou a été déplacée.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center h-12 px-6 rounded-radius-md bg-accent text-white hover:bg-accent-hover text-button font-medium transition-all duration-200"
        >
          Retour à l&rsquo;accueil
        </Link>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center h-12 px-6 rounded-radius-md border border-border bg-transparent text-text-primary hover:border-accent hover:text-accent text-button font-medium transition-all duration-200"
        >
          Contactez-nous
        </Link>
      </div>
    </div>
  )
}
