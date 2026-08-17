import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const rentabilidadInputSchema = z.object({
  capitalInvertido: z.number().min(0.01).max(100_000_000),
  capitalFinal: z.number().min(0).max(100_000_000),
  aniosInversion: z.number().min(0.01).max(80),
})

export type RentabilidadInput = z.infer<typeof rentabilidadInputSchema>

interface RentabilidadBreakdown extends Record<string, number> {
  gananciaTotal: number
  rentabilidadTotalPorcentaje: number
  rentabilidadAnualizadaPorcentaje: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// CAGR (Compound Annual Growth Rate): la rentabilidad anual constante que,
// aplicada durante todo el periodo, habría dado el mismo resultado final.
function calculate(input: RentabilidadInput) {
  const parsed = rentabilidadInputSchema.parse(input)

  const gananciaTotal = parsed.capitalFinal - parsed.capitalInvertido
  const rentabilidadTotalPorcentaje = (gananciaTotal / parsed.capitalInvertido) * 100

  const ratio = parsed.capitalFinal / parsed.capitalInvertido
  const rentabilidadAnualizadaPorcentaje =
    ratio > 0 ? (Math.pow(ratio, 1 / parsed.aniosInversion) - 1) * 100 : -100

  const breakdown: RentabilidadBreakdown = {
    gananciaTotal: round2(gananciaTotal),
    rentabilidadTotalPorcentaje: round2(rentabilidadTotalPorcentaje),
    rentabilidadAnualizadaPorcentaje: round2(rentabilidadAnualizadaPorcentaje),
  }

  return {
    main: {
      label: 'Rentabilidad anualizada (CAGR)',
      value: breakdown.rentabilidadAnualizadaPorcentaje,
      unit: 'PORCENTAJE' as const,
    },
    breakdown,
  }
}

export const rentabilidadCalculator: CalculatorDefinition<RentabilidadInput, RentabilidadBreakdown> = {
  meta: {
    slug: 'rentabilidad-inversion',
    categorySlug: 'inversiones',
    title: 'Calculadora de Rentabilidad de una Inversión 2026',
    seoTitle: 'Calculadora de Rentabilidad (CAGR) 2026: ROI Anualizado',
    metaDescription:
      'Calcula la rentabilidad total y anualizada (CAGR) de una inversión a partir del capital inicial, el capital final y el tiempo transcurrido.',
    shortDescription: 'Calcula el ROI y la rentabilidad anualizada real de una inversión ya realizada.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'capitalInvertido', label: 'Capital invertido inicialmente', type: 'number', suffix: '€' },
    { key: 'capitalFinal', label: 'Capital final (valor actual)', type: 'number', suffix: '€' },
    { key: 'aniosInversion', label: 'Años transcurridos', type: 'number', suffix: 'años', step: 0.1 },
  ],
  defaultValues: {
    capitalInvertido: 10000,
    capitalFinal: 15000,
    aniosInversion: 5,
  },
  faqs: [
    {
      question: '¿Qué diferencia hay entre rentabilidad total y rentabilidad anualizada?',
      answer:
        'La rentabilidad total es la ganancia global durante todo el periodo. La rentabilidad anualizada (CAGR) reparte ese crecimiento de forma equivalente entre todos los años, lo que permite comparar inversiones con distinta duración de forma justa.',
    },
    {
      question: '¿Por qué se llama CAGR?',
      answer:
        'CAGR son las siglas de Compound Annual Growth Rate (tasa de crecimiento anual compuesto). Es el estándar habitual para expresar y comparar la rentabilidad de fondos, acciones o cualquier inversión a varios años.',
    },
    {
      question: '¿Esta calculadora tiene en cuenta impuestos o comisiones?',
      answer:
        'No. Calcula la rentabilidad bruta a partir del capital invertido y el capital final que indiques. Si quieres la rentabilidad neta, resta antes las comisiones pagadas y ten en cuenta que las plusvalías tributan en el IRPF al vender.',
    },
  ],
  calculate,
}
