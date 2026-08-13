import Link from 'next/link'
import { categories } from '@/lib/categories'

export default function NotFound() {
  const destacadas = categories.slice(0, 4)

  return (
    <main className="container-page py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-gold-600">Error 404</p>
      <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Esta página no existe</h1>
      <p className="mx-auto mt-4 max-w-md text-slate-600 dark:text-slate-400">
        Puede que el enlace esté roto o que la página se haya movido. Prueba a volver al inicio o
        elige directamente la calculadora que buscas.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary">
          Volver al inicio
        </Link>
        <Link
          href="/blog"
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-medium transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-700"
        >
          Ver el blog
        </Link>
      </div>

      <div className="mx-auto mt-14 grid max-w-2xl gap-3 sm:grid-cols-2">
        {destacadas.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categoria/${cat.slug}`}
            className="card text-left transition hover:shadow-md"
          >
            <p className="font-medium">{cat.name}</p>
            <p className="mt-1 text-sm text-slate-500">{cat.description}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
