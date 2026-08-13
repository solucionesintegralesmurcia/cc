import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getAllCalculatorSlugs, getCalculator } from '@/lib/calculators'
import {
  generateCalculatorMetadata,
  buildCalculatorSchema,
  buildFaqSchema,
  buildBreadcrumbSchema,
} from '@/lib/seo/generate'
import { CalculatorForm } from '@/components/calculator/CalculatorForm'
import { FaqAccordion } from '@/components/calculator/FaqAccordion'
import { IrpfTramosTable } from '@/components/calculator/IrpfTramosTable'
import { SalariosReferenciaTable } from '@/components/calculator/SalariosReferenciaTable'
import { CategoryIllustration } from '@/components/illustrations/CategoryIllustration'

export const revalidate = 21600 // ISR: 6 horas

export function generateStaticParams() {
  return getAllCalculatorSlugs().map((slug) => ({ slug }))
}

type PageParams = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  const calc = getCalculator(slug)
  if (!calc) return {}
  return generateCalculatorMetadata(calc.meta)
}

// Bloques de contenido educativo específicos de cada calculadora. Se activan
// por slug porque el texto tiene que ser preciso para esa fórmula concreta;
// no tendría sentido mostrar la tabla de tramos IRPF en la calculadora de IVA.
const MUESTRA_TABLA_IRPF = new Set(['nomina', 'irpf'])
const MUESTRA_TABLA_SALARIOS = new Set(['nomina'])

export default async function CalculadoraPage({ params }: PageParams) {
  const { slug } = await params
  const calc = getCalculator(slug)
  if (!calc) notFound()

  const { meta, faqs } = calc

  const jsonLd = [
    buildCalculatorSchema(meta),
    buildFaqSchema(faqs),
    buildBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: meta.title, url: `/calculadora/${meta.slug}` },
    ]),
  ]

  return (
    <main>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hero centrado, al estilo "landing de conversión": título + subtítulo
          + confianza, con la calculadora inmediatamente debajo. */}
      <section className="border-b border-slate-200 bg-slate-50 py-10 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="container-page flex flex-col items-center gap-6 sm:flex-row sm:items-center">
          <div className="flex-1">
            <nav className="text-sm text-slate-500">
              <Link href="/">Inicio</Link> /{' '}
              <Link href={`/categoria/${meta.categorySlug}`}>{meta.categorySlug}</Link> /{' '}
              <span>{meta.title}</span>
            </nav>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{meta.title}</h1>
            <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
              {meta.metaDescription}
            </p>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand-600">
              Sin registro · Resultado instantáneo · Actualizada 2026
            </p>
          </div>
          <CategoryIllustration
            categorySlug={meta.categorySlug}
            className="hidden w-40 shrink-0 sm:block md:w-48"
          />
        </div>
      </section>

      <div className="container-page py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <article className="prose dark:prose-invert max-w-none">
            <h2>¿Cómo funciona esta calculadora?</h2>
            <p>
              Introduce tus datos en el formulario para obtener el resultado
              al instante, con el desglose completo de cada concepto que
              interviene en el cálculo.
            </p>

            {MUESTRA_TABLA_IRPF.has(meta.slug) && (
              <>
                <h2>Tramos del IRPF 2026</h2>
                <IrpfTramosTable />
              </>
            )}

            {MUESTRA_TABLA_SALARIOS.has(meta.slug) && (
              <>
                <h2>Tabla de sueldos netos de referencia</h2>
                <SalariosReferenciaTable />
              </>
            )}

            <h2>Preguntas frecuentes</h2>
            <FaqAccordion faqs={faqs} />
          </article>

          <aside>
            <CalculatorForm slug={meta.slug} />
          </aside>
        </div>
      </div>
    </main>
  )
}
