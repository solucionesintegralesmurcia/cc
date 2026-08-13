import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getArticle, getAllArticleSlugs } from '@/lib/articles'
import { getCalculator } from '@/lib/calculators'
import { CategoryIllustration } from '@/components/illustrations/CategoryIllustration'

export const revalidate = 43200

export function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }))
}

type PageParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return {}
  return {
    title: article.seoTitle,
    description: article.metaDescription,
    alternates: { canonical: `/blog/${article.slug}` },
  }
}

export default async function ArticlePage({ params }: PageParams) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const relatedCalculators = article.relatedCalculatorSlugs
    .map((s) => getCalculator(s))
    .filter(Boolean)

  const coverCategorySlug = relatedCalculators[0]?.meta.categorySlug

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    dateModified: article.updatedAt,
  }

  return (
    <main className="container-page py-12">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className="text-sm text-slate-500">
        <Link href="/blog">Blog</Link> / <span>{article.title}</span>
      </nav>

      <div className="mt-4 flex flex-col items-center gap-6 sm:flex-row">
        <h1 className="flex-1 text-3xl font-bold">{article.title}</h1>
        {coverCategorySlug && (
          <CategoryIllustration categorySlug={coverCategorySlug} className="w-32 shrink-0" />
        )}
      </div>

      <article className="prose dark:prose-invert mt-6 max-w-none">
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </article>

      {relatedCalculators.length > 0 && (
        <div className="mt-10 border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="font-semibold">Calculadoras relacionadas</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {relatedCalculators.map((calc) => (
              <Link
                key={calc!.meta.slug}
                href={`/calculadora/${calc!.meta.slug}`}
                className="card hover:shadow-md"
              >
                <p className="font-medium">{calc!.meta.title}</p>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                  {calc!.meta.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
