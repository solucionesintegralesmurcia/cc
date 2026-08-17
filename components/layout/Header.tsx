import Link from 'next/link'
import Image from 'next/image'
import { categories } from '@/lib/categories'
import { getCalculatorsByCategory } from '@/lib/calculators'
import { MobileMenu } from './MobileMenu'
import { MoreCategoriesDropdown } from './MoreCategoriesDropdown'

const MAX_CATEGORIAS_VISIBLES = 5

export function Header() {
  // Solo mostramos categorías que realmente tienen calculadoras publicadas,
  // calculado dinámicamente (no una posición fija), para no enlazar nunca
  // a una sección vacía aunque cambie el orden o número de categorías.
  const categoriesWithContent = categories.filter((cat) => getCalculatorsByCategory(cat.slug).length > 0)

  // Con muchas categorías el menú se desborda: mostramos las primeras
  // directamente y el resto bajo un desplegable "Más", igual que hacen
  // sitios de referencia del sector con decenas de categorías.
  const visibleCategories = categoriesWithContent.slice(0, MAX_CATEGORIAS_VISIBLES)
  const overflowCategories = categoriesWithContent.slice(MAX_CATEGORIAS_VISIBLES)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      {/* Barra de confianza: refuerza autoridad/actualidad, clave para SEO y conversión */}
      <div className="border-b border-slate-100 bg-brand-50 py-1.5 text-center text-xs font-medium text-brand-900 dark:border-slate-900 dark:bg-brand-900/20 dark:text-brand-100">
        Actualizado 2026 · IRPF 2026 · Seguridad Social 2026
      </div>

      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/logo-icon-512.png"
            alt="Calculadoras España"
            width={36}
            height={36}
            className="rounded-lg"
            priority
          />
          <span className="hidden text-lg font-bold tracking-tight sm:inline">
            Calculadoras<span className="text-gold-600">España</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {visibleCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="text-slate-600 transition hover:text-brand-600 dark:text-slate-300"
            >
              {cat.name}
            </Link>
          ))}
          {overflowCategories.length > 0 && (
            <MoreCategoriesDropdown categories={overflowCategories} />
          )}
          <Link
            href="/blog"
            className="text-slate-600 transition hover:text-brand-600 dark:text-slate-300"
          >
            Blog
          </Link>
        </nav>

        <div className="hidden shrink-0 md:block">
          <Link href="/" className="btn-primary !px-4 !py-2 text-sm">
            Inicio
          </Link>
        </div>

        <MobileMenu categories={categoriesWithContent} />
      </div>
    </header>
  )
}
