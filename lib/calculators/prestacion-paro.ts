import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const paroInputSchema = z.object({
  baseReguladoraMensual: z.number().min(0).max(20000),
  numHijos: z.number().int().min(0).max(10),
})

export type ParoInput = z.infer<typeof paroInputSchema>

interface ParoBreakdown extends Record<string, number> {
  importePrimeros180Dias: number
  importeDesdeDia181: number
  topeMaximoAplicado: number
  topeMinimoAplicado: number
}

// IPREM mensual 2026 orientativo, usado para calcular topes de la prestación.
const IPREM_MENSUAL = 600

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: ParoInput) {
  const parsed = paroInputSchema.parse(input)

  const importeBrutoPrimeros180 = parsed.baseReguladoraMensual * 0.7
  const importeBrutoDesde181 = parsed.baseReguladoraMensual * 0.5

  // Topes según hijos a cargo (orientativos, sobre el IPREM mensual).
  let topeMaximo: number
  let topeMinimo: number
  if (parsed.numHijos === 0) {
    topeMaximo = IPREM_MENSUAL * 1.75
    topeMinimo = IPREM_MENSUAL * 0.8
  } else if (parsed.numHijos === 1) {
    topeMaximo = IPREM_MENSUAL * 2.0
    topeMinimo = IPREM_MENSUAL * 1.07
  } else {
    topeMaximo = IPREM_MENSUAL * 2.25
    topeMinimo = IPREM_MENSUAL * 1.07
  }

  const importePrimeros180Dias = Math.min(Math.max(importeBrutoPrimeros180, topeMinimo), topeMaximo)
  const importeDesdeDia181 = Math.min(Math.max(importeBrutoDesde181, topeMinimo), topeMaximo)

  const breakdown: ParoBreakdown = {
    importePrimeros180Dias: round2(importePrimeros180Dias),
    importeDesdeDia181: round2(importeDesdeDia181),
    topeMaximoAplicado: round2(topeMaximo),
    topeMinimoAplicado: round2(topeMinimo),
  }

  return {
    main: {
      label: 'Prestación mensual (primeros 180 días)',
      value: breakdown.importePrimeros180Dias,
      unit: 'EUR' as const,
    },
    breakdown,
  }
}

export const paroCalculator: CalculatorDefinition<ParoInput, ParoBreakdown> = {
  meta: {
    slug: 'prestacion-paro',
    categorySlug: 'social',
    title: 'Calculadora de Prestación por Desempleo (Paro) 2026',
    seoTitle: 'Calculadora del Paro 2026: Cuánto Cobrarás de Prestación',
    metaDescription:
      'Calcula tu prestación mensual por desempleo: 70% de la base reguladora los primeros 180 días, 50% después, con los topes según hijos a cargo.',
    shortDescription: 'Estima tu prestación mensual por desempleo según tu base reguladora.',
    updatedAt: '2026-01-01',
  },
  fields: [
    {
      key: 'baseReguladoraMensual',
      label: 'Base reguladora mensual (media de cotización últimos 180 días)',
      type: 'number',
      suffix: '€',
    },
    { key: 'numHijos', label: 'Número de hijos a cargo', type: 'number' },
  ],
  defaultValues: {
    baseReguladoraMensual: 1600,
    numHijos: 0,
  },
  faqs: [
    {
      question: '¿Cómo se calcula la base reguladora?',
      answer:
        'Es la media de tus bases de cotización por contingencias comunes de los últimos 180 días trabajados antes de la situación legal de desempleo.',
    },
    {
      question: '¿Por qué baja el porcentaje a partir del día 181?',
      answer:
        'La normativa establece el 70% de la base reguladora durante los primeros 180 días de prestación, y el 50% a partir del día 181 hasta agotar el periodo que te corresponda según tus años cotizados.',
    },
    {
      question: '¿Por qué influyen los hijos en el tope de la prestación?',
      answer:
        'La ley fija topes máximos y mínimos de la prestación en función del número de hijos a cargo, calculados sobre el IPREM mensual, para que la cuantía nunca baje ni suba de ciertos límites.',
    },
  ],
  calculate,
}
