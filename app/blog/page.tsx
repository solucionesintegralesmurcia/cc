import Link from 'next/link'
import type { Metadata } from 'next'
import { articles } from '@/lib/articles'
import { getCalculator } from '@/lib/calculators'
import { CategoryIllustration } from '@/components/illustrations/CategoryIllustration'

export const revalidate = 43200 // 12h

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Artículos sobre nómina, fiscalidad, hipotecas y finanzas personales en España.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  return (
    <main className="container-page py-12">
      <h1 className="text-3xl font-bold">Blog</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Guías prácticas sobre nómina, despidos, fiscalidad y finanzas personales.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {articles.map((article) => {
          const categorySlug = getCalculator(article.relatedCalculatorSlugs[0] ?? '')?.meta.categorySlug
          return (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}`}
              className="card flex gap-4 hover:shadow-md"
            >
              {categorySlug && (
                <CategoryIllustration categorySlug={categorySlug} className="w-20 shrink-0" />
              )}
              <div>
                <h2 className="font-semibold">{article.title}</h2>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{article.excerpt}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </main>
  )
}
