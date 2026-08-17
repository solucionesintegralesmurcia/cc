import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const bajaMaternidadInputSchema = z.object({
  baseCotizacionMensual: z.number().min(0).max(20000),
  semanasDisfrute: z.number().min(1).max(16),
})

export type BajaMaternidadInput = z.infer<typeof bajaMaternidadInputSchema>

interface BajaMaternidadBreakdown extends Record<string, number> {
  subsidioDiario: number
  totalPeriodo: number
  totalMensualEquivalente: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// La prestación por nacimiento y cuidado de menor equivale al 100% de la
// base reguladora (aprox. la base de cotización del mes anterior), sin
// topes específicos distintos a los generales de cotización.
function calculate(input: BajaMaternidadInput) {
  const parsed = bajaMaternidadInputSchema.parse(input)

  const subsidioDiario = parsed.baseCotizacionMensual / 30
  const diasTotales = parsed.semanasDisfrute * 7
  const totalPeriodo = subsidioDiario * diasTotales

  const breakdown: BajaMaternidadBreakdown = {
    subsidioDiario: round2(subsidioDiario),
    totalPeriodo: round2(totalPeriodo),
    totalMensualEquivalente: round2(parsed.baseCotizacionMensual),
  }

  return {
    main: { label: 'Total del periodo de baja', value: breakdown.totalPeriodo, unit: 'EUR' as const },
    breakdown,
  }
}

export const bajaMaternidadCalculator: CalculatorDefinition<
  BajaMaternidadInput,
  BajaMaternidadBreakdown
> = {
  meta: {
    slug: 'baja-maternidad-paternidad',
    categorySlug: 'familia',
    title: 'Calculadora de Baja de Maternidad/Paternidad 2026',
    seoTitle: 'Calculadora Baja Maternidad y Paternidad 2026: Prestación por Nacimiento',
    metaDescription:
      'Calcula la prestación por nacimiento y cuidado de menor (baja de maternidad o paternidad), al 100% de tu base de cotización, hasta 16 semanas.',
    shortDescription: 'Calcula tu prestación durante la baja por nacimiento y cuidado del menor.',
    updatedAt: '2026-01-01',
  },
  fields: [
    {
      key: 'baseCotizacionMensual',
      label: 'Base de cotización mensual (mes anterior a la baja)',
      type: 'number',
      suffix: '€',
    },
    { key: 'semanasDisfrute', label: 'Semanas de baja a calcular', type: 'number', suffix: 'semanas' },
  ],
  defaultValues: {
    baseCotizacionMensual: 1800,
    semanasDisfrute: 16,
  },
  faqs: [
    {
      question: '¿Cuánto dura la baja por nacimiento y cuidado de menor?',
      answer:
        'Actualmente son 16 semanas para cada progenitor, de las cuales las 6 primeras tras el parto son obligatorias e ininterrumpidas para la madre biológica. El resto se puede disfrutar de forma flexible hasta que el menor cumpla 12 meses.',
    },
    {
      question: '¿Al 100% de qué se calcula la prestación?',
      answer:
        'Se calcula sobre la base reguladora, que coincide, con carácter general, con la base de cotización por contingencias comunes del mes anterior al inicio de la baja.',
    },
    {
      question: '¿Esta prestación tributa en el IRPF?',
      answer:
        'No, la prestación por nacimiento y cuidado de menor está exenta de IRPF desde 2018, tanto en el régimen general como en el de autónomos.',
    },
  ],
  calculate,
}
