import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const descuentosInputSchema = z.object({
  precioOriginal: z.number().min(0).max(10_000_000),
  porcentajeDescuento: z.number().min(0).max(100),
})

export type DescuentosInput = z.infer<typeof descuentosInputSchema>

interface DescuentosBreakdown extends Record<string, number> {
  importeAhorrado: number
  precioFinal: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: DescuentosInput) {
  const parsed = descuentosInputSchema.parse(input)

  const importeAhorrado = parsed.precioOriginal * (parsed.porcentajeDescuento / 100)
  const precioFinal = parsed.precioOriginal - importeAhorrado

  const breakdown: DescuentosBreakdown = {
    importeAhorrado: round2(importeAhorrado),
    precioFinal: round2(precioFinal),
  }

  return {
    main: { label: 'Precio final con descuento', value: breakdown.precioFinal, unit: 'EUR' as const },
    breakdown,
  }
}

export const descuentosCalculator: CalculatorDefinition<DescuentosInput, DescuentosBreakdown> = {
  meta: {
    slug: 'descuentos-rebajas',
    categorySlug: 'cotidiano',
    title: 'Calculadora de Descuentos y Rebajas',
    seoTitle: 'Calculadora de Descuentos: Precio Final tras la Rebaja',
    metaDescription:
      'Calcula el precio final de un producto tras aplicar un descuento, y cuánto te ahorras exactamente.',
    shortDescription: 'Calcula el precio final y el ahorro tras aplicar un descuento.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'precioOriginal', label: 'Precio original', type: 'number', suffix: '€' },
    { key: 'porcentajeDescuento', label: 'Descuento', type: 'number', suffix: '%' },
  ],
  defaultValues: {
    precioOriginal: 80,
    porcentajeDescuento: 25,
  },
  faqs: [
    {
      question: '¿Cómo se calcula el precio con descuento?',
      answer:
        'Se multiplica el precio original por el porcentaje de descuento para saber cuánto se resta, y esa cantidad se descuenta del precio original para obtener el precio final.',
    },
    {
      question: '¿Cómo calculo dos descuentos sucesivos (por ejemplo, 20% + 10%)?',
      answer:
        'Los descuentos sucesivos no se suman directamente. Calcula primero el precio tras el primer descuento con esta calculadora, y luego vuelve a usarla con ese nuevo precio como "precio original" y el segundo descuento.',
    },
  ],
  calculate,
}
