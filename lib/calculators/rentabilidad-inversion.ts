import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const rentabilidadInversionInputSchema = z.object({
  capitalInvertido: z.number().min(0.01).max(100_000_000),
  valorActual: z.number().min(0).max(100_000_000),
  aniosTranscurridos: z.number().min(0.01).max(80),
})

export type RentabilidadInversionInput = z.infer<typeof rentabilidadInversionInputSchema>

interface RentabilidadInversionBreakdown extends Record<string, number> {
  gananciaOPerdida: number
  rentabilidadTotalPorcentaje: number
  rentabilidadAnualizadaPorcentaje: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Rentabilidad anualizada (CAGR): (Vf/Vi)^(1/años) - 1
function calculate(input: RentabilidadInversionInput) {
  const parsed = rentabilidadInversionInputSchema.parse(input)

  const gananciaOPerdida = parsed.valorActual - parsed.capitalInvertido
  const rentabilidadTotalPorcentaje = (gananciaOPerdida / parsed.capitalInvertido) * 100

  const ratio = parsed.valorActual / parsed.capitalInvertido
  const rentabilidadAnualizadaPorcentaje =
    ratio > 0 ? (Math.pow(ratio, 1 / parsed.aniosTranscurridos) - 1) * 100 : -100

  const breakdown: RentabilidadInversionBreakdown = {
    gananciaOPerdida: round2(gananciaOPerdida),
    rentabilidadTotalPorcentaje: round2(rentabilidadTotalPorcentaje),
    rentabilidadAnualizadaPorcentaje: round2(rentabilidadAnualizadaPorcentaje),
  }

  return {
    main: {
      label: 'Rentabilidad anualizada',
      value: breakdown.rentabilidadAnualizadaPorcentaje,
      unit: 'PORCENTAJE' as const,
    },
    breakdown,
  }
}

export const rentabilidadInversionCalculator: CalculatorDefinition<
  RentabilidadInversionInput,
  RentabilidadInversionBreakdown
> = {
  meta: {
    slug: 'rentabilidad-inversion',
    categorySlug: 'inversiones',
    title: 'Calculadora de Rentabilidad de Inversión 2026',
    seoTitle: 'Calculadora de Rentabilidad de Inversión: ROI y Rentabilidad Anualizada',
    metaDescription:
      'Calcula la rentabilidad total y anualizada (CAGR) de cualquier inversión a partir del capital invertido, el valor actual y el tiempo transcurrido.',
    shortDescription: 'Calcula el ROI total y la rentabilidad anualizada de tu inversión.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'capitalInvertido', label: 'Capital invertido inicialmente', type: 'number', suffix: '€' },
    { key: 'valorActual', label: 'Valor actual de la inversión', type: 'number', suffix: '€' },
    {
      key: 'aniosTranscurridos',
      label: 'Tiempo transcurrido',
      type: 'number',
      suffix: 'años',
      step: 0.1,
    },
  ],
  defaultValues: {
    capitalInvertido: 10000,
    valorActual: 13500,
    aniosTranscurridos: 3,
  },
  faqs: [
    {
      question: '¿Qué diferencia hay entre rentabilidad total y anualizada?',
      answer:
        'La rentabilidad total es el porcentaje de ganancia o pérdida sobre todo el periodo. La anualizada (CAGR) la convierte en una tasa media equivalente por año, lo que permite comparar inversiones con distintos plazos de forma justa.',
    },
    {
      question: '¿Por qué la rentabilidad anualizada es menor que la total dividida entre los años?',
      answer:
        'Porque el CAGR tiene en cuenta el efecto compuesto: no es una media simple, sino la tasa constante que, aplicada cada año sobre el capital acumulado, llevaría del valor inicial al valor final.',
    },
    {
      question: '¿Este cálculo tiene en cuenta impuestos o comisiones?',
      answer:
        'No, es rentabilidad bruta. Para inversiones en España, las ganancias patrimoniales tributan en el IRPF del ahorro (entre el 19% y el 30% según el importe), y las comisiones del bróker también reducen la rentabilidad real.',
    },
  ],
  calculate,
}
