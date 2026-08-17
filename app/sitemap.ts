import type { MetadataRoute } from 'next'
import { calculators, getCalculatorsByCategory } from '@/lib/calculators'
import { categories } from '@/lib/categories'
import { articles } from '@/lib/articles'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculadorasespana.es'

export default function sitemap(): MetadataRoute.Sitemap {
  const calculatorUrls = Object.values(calculators).map((calc) => ({
    url: `${SITE_URL}/calculadora/${calc.meta.slug}`,
    lastModified: calc.meta.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Solo categorías con al menos una calculadora: las vacías van noindex,
  // así que no tiene sentido enviarlas en el sitemap.
  const categoryUrls = categories
    .filter((cat) => getCalculatorsByCategory(cat.slug).length > 0)
    .map((cat) => ({
      url: `${SITE_URL}/categoria/${cat.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  const articleUrls = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.5 },
    ...calculatorUrls,
    ...categoryUrls,
    ...articleUrls,
  ]
}
