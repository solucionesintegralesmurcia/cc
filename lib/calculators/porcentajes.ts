import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const porcentajesInputSchema = z.object({
  valorBase: z.number().min(0).max(100_000_000),
  porcentaje: z.number().min(0).max(1000),
})

export type PorcentajesInput = z.infer<typeof porcentajesInputSchema>

interface PorcentajesBreakdown extends Record<string, number> {
  resultado: number
  valorMasPorcentaje: number
  valorMenosPorcentaje: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: PorcentajesInput) {
  const parsed = porcentajesInputSchema.parse(input)

  const resultado = parsed.valorBase * (parsed.porcentaje / 100)

  const breakdown: PorcentajesBreakdown = {
    resultado: round2(resultado),
    valorMasPorcentaje: round2(parsed.valorBase + resultado),
    valorMenosPorcentaje: round2(parsed.valorBase - resultado),
  }

  return {
    main: { label: `El ${parsed.porcentaje}% de tu valor`, value: breakdown.resultado, unit: 'NUMERO' as const },
    breakdown,
  }
}

export const porcentajesCalculator: CalculatorDefinition<PorcentajesInput, PorcentajesBreakdown> = {
  meta: {
    slug: 'porcentajes',
    categorySlug: 'cotidiano',
    title: 'Calculadora de Porcentajes',
    seoTitle: 'Calculadora de Porcentajes Online: Calcula el % de Cualquier Número',
    metaDescription:
      'Calcula el porcentaje de cualquier cantidad, y el resultado de sumarle o restarle ese porcentaje al valor original.',
    shortDescription: 'Calcula rápido el porcentaje de cualquier número.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'valorBase', label: 'Valor', type: 'number' },
    { key: 'porcentaje', label: 'Porcentaje', type: 'number', suffix: '%' },
  ],
  defaultValues: {
    valorBase: 200,
    porcentaje: 15,
  },
  breakdownUnits: { resultado: 'NUMERO', valorMasPorcentaje: 'NUMERO', valorMenosPorcentaje: 'NUMERO' },
  faqs: [
    {
      question: '¿Cómo se calcula un porcentaje de un número?',
      answer:
        'Se multiplica el número por el porcentaje dividido entre 100. Por ejemplo, el 15% de 200 es 200 × (15/100) = 30.',
    },
    {
      question: '¿Cómo calculo qué porcentaje representa un número sobre otro?',
      answer:
        'Se divide el número menor entre el mayor y se multiplica por 100. Por ejemplo, para saber qué porcentaje es 30 de 200: (30/200) × 100 = 15%.',
    },
  ],
  calculate,
}
