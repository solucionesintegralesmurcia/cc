'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export interface SearchableCalculator {
  slug: string
  title: string
  shortDescription: string
  categorySlug: string
}

interface Props {
  calculators: SearchableCalculator[]
}

// Búsqueda 100% en cliente: con solo 15-20 calculadoras no hace falta un
// endpoint ni una librería de búsqueda, un filtro simple sobre el array ya
// cargado es instantáneo y no añade ninguna petición de red.
export function CalculatorSearch({ calculators }: Props) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (q.length < 2) return []
    return calculators
      .filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.categorySlug.toLowerCase().includes(q)
      )
      .slice(0, 6)
  }, [query, calculators])

  function goTo(slug: string) {
    setOpen(false)
    setQuery('')
    router.push(`/calculadora/${slug}`)
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const chosen = results[activeIndex] ?? results[0]
      if (chosen) goTo(chosen.slug)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-lg text-left">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        onKeyDown={onKeyDown}
        placeholder="Busca tu calculadora (ej: nómina, hipoteca, IVA...)"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
        aria-label="Buscar calculadora"
        aria-expanded={open && results.length > 0}
        role="combobox"
        aria-controls="calculator-search-results"
      />

      {open && query.trim().length >= 2 && (
        <div
          id="calculator-search-results"
          className="absolute inset-x-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-lg dark:border-slate-800 dark:bg-slate-950"
        >
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">
              No hay calculadoras que coincidan con &ldquo;{query}&rdquo;.
            </p>
          ) : (
            results.map((calc, i) => (
              <button
                key={calc.slug}
                type="button"
                onMouseDown={() => goTo(calc.slug)}
                className={`block w-full px-4 py-3 text-left text-sm transition ${
                  i === activeIndex
                    ? 'bg-brand-50 dark:bg-brand-900/30'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <span className="font-medium">{calc.title}</span>
                <span className="mt-0.5 block text-xs text-slate-500">{calc.shortDescription}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
