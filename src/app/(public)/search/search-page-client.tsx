"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { MagnifyingGlass, X, Clock, ChartBar } from "@/components/icons"

interface SearchResult {
  title: string
  description: string
  href: string
  category: "Services" | "Projects" | "Blog" | "Courses" | "Team" | "FAQ"
  score: number
}

const CATEGORY_BADGES: Record<string, { bg: string; text: string }> = {
  Services: { bg: "bg-blue-500/10", text: "text-blue-400" },
  Projects: { bg: "bg-green-500/10", text: "text-green-400" },
  Blog: { bg: "bg-purple-500/10", text: "text-purple-400" },
  Courses: { bg: "bg-amber-500/10", text: "text-amber-400" },
  Team: { bg: "bg-pink-500/10", text: "text-pink-400" },
  FAQ: { bg: "bg-cyan-500/10", text: "text-cyan-400" },
}

const STORAGE_KEY_RECENT = "weblancia_recent_searches"
const STORAGE_KEY_POPULAR = "weblancia_popular_searches"
const MAX_RECENT = 8
const MAX_POPULAR = 10

function loadRecent(): string[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECENT)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveRecent(queries: string[]) {
  try { localStorage.setItem(STORAGE_KEY_RECENT, JSON.stringify(queries.slice(0, MAX_RECENT))) } catch { }
}

function loadPopular(): { q: string; count: number }[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY_POPULAR)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function savePopular(entries: { q: string; count: number }[]) {
  try { localStorage.setItem(STORAGE_KEY_POPULAR, JSON.stringify(entries.slice(0, MAX_POPULAR))) } catch { }
}

function trackSearch(query: string) {
  const recent = loadRecent().filter((r) => r !== query)
  recent.unshift(query)
  saveRecent(recent)

  const popular = loadPopular()
  const existing = popular.find((p) => p.q === query)
  if (existing) {
    existing.count += 1
  } else {
    popular.push({ q: query, count: 1 })
  }
  popular.sort((a, b) => b.count - a.count)
  savePopular(popular)
}

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
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecent)
  const [popularSearches, setPopularSearches] = useState<{ q: string; count: number }[]>(loadPopular)

  const doFetch = useCallback((q: string) => {
    if (!q.trim()) { setResults([]); setHasSearched(false); return }
    setLoading(true)
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setHasSearched(true)

    fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
      .then((r) => r.json())
      .then((data) => {
        if (!controller.signal.aborted) {
          setResults(data.items ?? [])
          setSelectedIndex(-1)
          trackSearch(q)
          setRecentSearches(loadRecent())
          setPopularSearches(loadPopular())
        }
      })
      .catch(() => { if (!controller.signal.aborted) setResults([]) })
      .finally(() => { if (!controller.signal.aborted) setLoading(false) })
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    clearTimeout(debounceRef.current)
    if (!query.trim()) { setResults([]); setHasSearched(false); return }
    debounceRef.current = setTimeout(() => doFetch(query), 200)
    return () => clearTimeout(debounceRef.current)
  }, [query, doFetch])

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
    } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < results.length) {
      window.location.href = results[selectedIndex].href
    }
  }

  const handleRecentClick = (q: string) => {
    setQuery(q)
    doFetch(q)
  }

  const clearRecent = () => {
    saveRecent([])
    setRecentSearches([])
  }

  const showSuggestions = !query.trim() && !hasSearched
  const hasSuggestions = recentSearches.length > 0 || popularSearches.length > 0

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
          aria-expanded={results.length > 0 || showSuggestions}
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

      {showSuggestions && hasSuggestions && (
        <div className="max-w-xl space-y-6">
          {recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-h3 text-text-tertiary font-medium flex items-center gap-1.5">
                  <Clock size={14} />
                  Recherches récentes
                </h3>
                <button onClick={clearRecent} className="text-xs text-text-tertiary hover:text-text-primary transition-colors">
                  Effacer
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRecentClick(r)}
                    className="px-3 py-1.5 text-sm bg-surface border border-border rounded-radius-lg text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}
          {popularSearches.length > 0 && (
            <div>
              <h3 className="text-h3 text-text-tertiary font-medium mb-3 flex items-center gap-1.5">
                <ChartBar size={14} />
                Recherches populaires
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((p) => (
                  <button
                    key={p.q}
                    onClick={() => handleRecentClick(p.q)}
                    className="px-3 py-1.5 text-sm bg-surface border border-border rounded-radius-lg text-text-secondary hover:text-text-primary hover:border-accent transition-colors"
                  >
                    {p.q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {query && (
        <div
          id="search-results"
          ref={resultsRef}
          role="listbox"
          className="space-y-1 max-w-xl"
        >
          {loading ? (
            <div className="bg-surface border border-border rounded-radius-lg p-8 text-center">
              <div className="inline-block h-5 w-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : results.length > 0 ? (
            results.map((result, index) => {
              const badge = CATEGORY_BADGES[result.category] ?? { bg: "bg-surface", text: "text-text-secondary" }
              return (
                <Link
                  key={`${result.href}-${index}`}
                  href={result.href}
                  id={`result-${index}`}
                  role="option"
                  aria-selected={index === selectedIndex}
                  className={`block bg-surface border border-border rounded-radius-lg p-4 transition-all duration-200 hover:border-accent hover:shadow-sm ${
                    index === selectedIndex ? "border-accent shadow-sm bg-accent-light/10" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <p className="text-body font-medium mb-1">
                        {highlightMatch(result.title, query)}
                      </p>
                      <p className="text-body-sm text-text-secondary line-clamp-1">
                        {highlightMatch(result.description, query)}
                      </p>
                    </div>
                    <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded text-caption font-medium ${badge.bg} ${badge.text}`}>
                      {result.category}
                    </span>
                  </div>
                </Link>
              )
            })
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
