'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { calculators } from '@/lib/calculators'

export function CalculatorSearch() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return Object.values(calculators)
      .filter(
        (calc) =>
          calc.meta.title.toLowerCase().includes(q) ||
          calc.meta.shortDescription.toLowerCase().includes(q) ||
          calc.meta.slug.includes(q)
      )
      .slice(0, 8)
  }, [query])

  return (
    <div className="relative mx-auto w-full max-w-lg">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Busca tu calculadora (ej: nómina, hipoteca, IVA...)"
        className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
      />

      {focused && query.trim() && (
        <div className="absolute inset-x-0 top-full z-30 mt-2 max-h-80 overflow-y-auto rounded-xl border border-slate-200 bg-white text-left shadow-lg dark:border-slate-800 dark:bg-slate-900">
          {results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500">
              No hay calculadoras que coincidan con "{query}".
            </p>
          ) : (
            results.map((calc) => (
              <Link
                key={calc.meta.slug}
                href={`/calculadora/${calc.meta.slug}`}
                className="block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
              >
                <p className="font-medium">{calc.meta.title}</p>
                <p className="text-sm text-slate-500">{calc.meta.shortDescription}</p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}
