'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Category } from '@/lib/categories'

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menú"
        aria-expanded={open}
        className="rounded-lg border border-slate-300 p-2 dark:border-slate-700"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-950">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 font-medium hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Inicio
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            href="/blog"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            Blog
          </Link>
        </div>
      )}
    </div>
  )
}
