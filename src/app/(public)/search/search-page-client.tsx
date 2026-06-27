"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import Link from "next/link"
import { MagnifyingGlass, X } from "@/components/icons"

interface SearchResult {
  title: string
  description: string
  href: string
  category: string
}

const searchIndex: SearchResult[] = [
  { title: "Développement Web", description: "Sites vitrines, applications web, e-commerce, CRM sur mesure", href: "/services/web-development", category: "Services" },
  { title: "Marketing Digital", description: "SEO, SEA, social media, content marketing, emailing", href: "/services/digital-marketing", category: "Services" },
  { title: "Branding & Design", description: "Identité visuelle, logo, charte graphique, UI/UX design", href: "/services/branding-design", category: "Services" },
  { title: "Consulting", description: "Stratégie digitale, transformation numérique, accompagnement", href: "/services/consulting", category: "Services" },
  { title: "Maintenance & Support", description: "Maintenance technique, hébergement, sécurité, mises à jour", href: "/services/maintenance-support", category: "Services" },
  { title: "Academy", description: "Formations aux métiers du digital : cours, ateliers, ressources", href: "/academy", category: "Pages" },
  { title: "Contact", description: "Prenez contact avec notre équipe pour votre projet", href: "/contact", category: "Pages" },
  { title: "Consultation", description: "Réservez une consultation personnalisée avec nos experts", href: "/consultation", category: "Pages" },
  { title: "Projets", description: "Découvrez nos réalisations et études de cas", href: "/work", category: "Pages" },
  { title: "Blog", description: "Articles, analyses et tendances du digital", href: "/insights", category: "Pages" },
  { title: "À propos", description: "Découvrez Weblancia, notre mission et notre équipe", href: "/about", category: "Pages" },
  { title: "Start Project", description: "Commencez votre projet digital avec nous", href: "/start-project", category: "Pages" },
]

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query.trim()) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escaped})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-accent-light text-accent rounded-sm px-0.5">{part}</mark>
          : part,
      )}
    </>
  )
}

export function SearchPageClient() {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const lower = query.toLowerCase()
    return searchIndex.filter(
      (item) =>
        item.title.toLowerCase().includes(lower) ||
        item.description.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower),
    )
  }, [query])

  useEffect(() => {
    setSelectedIndex(-1)
  }, [query])

  useEffect(() => {
    if (results.length > 0 && selectedIndex >= results.length) {
      setSelectedIndex(results.length - 1)
    }
  }, [results.length, selectedIndex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
    } else if (e.key === "Escape") {
      setQuery("")
      inputRef.current?.blur()
    }
  }

  return (
    <div>
      <div className="relative max-w-xl mb-8">
        <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher des services, projets, articles..."
          className="w-full bg-surface border border-border rounded-radius-lg pl-12 pr-12 py-4 text-body text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
          aria-label="Rechercher sur le site"
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls="search-results"
          aria-activedescendant={selectedIndex >= 0 ? `result-${selectedIndex}` : undefined}
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Effacer la recherche"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {query && (
        <div
          id="search-results"
          ref={resultsRef}
          role="listbox"
          className="space-y-1 max-w-xl"
        >
          {results.length > 0 ? (
            results.map((result, index) => (
              <Link
                key={result.href}
                href={result.href}
                id={`result-${index}`}
                role="option"
                aria-selected={index === selectedIndex}
                className={`block bg-surface border border-border rounded-radius-lg p-4 transition-all duration-200 hover:border-accent hover:shadow-sm ${
                  index === selectedIndex ? "border-accent shadow-sm bg-accent-light/10" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-body font-medium mb-1">
                      {highlightMatch(result.title, query)}
                    </p>
                    <p className="text-body-sm text-text-secondary line-clamp-1">
                      {highlightMatch(result.description, query)}
                    </p>
                  </div>
                  <span className="text-caption text-text-tertiary shrink-0 mt-0.5">{result.category}</span>
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-surface border border-border rounded-radius-lg p-8 text-center">
              <p className="text-body text-text-secondary mb-2">Aucun résultat trouvé</p>
              <p className="text-body-sm text-text-tertiary">
                Essayez d&apos;autres termes comme &quot;site web&quot;, &quot;SEO&quot; ou &quot;formation&quot;
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
