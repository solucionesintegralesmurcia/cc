import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const propinasInputSchema = z.object({
  importeCuenta: z.number().min(0).max(1_000_000),
  porcentajePropina: z.number().min(0).max(100),
  numPersonas: z.number().int().min(1).max(50),
})

export type PropinasInput = z.infer<typeof propinasInputSchema>

interface PropinasBreakdown extends Record<string, number> {
  importePropina: number
  totalConPropina: number
  totalPorPersona: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: PropinasInput) {
  const parsed = propinasInputSchema.parse(input)

  const importePropina = parsed.importeCuenta * (parsed.porcentajePropina / 100)
  const totalConPropina = parsed.importeCuenta + importePropina
  const totalPorPersona = totalConPropina / parsed.numPersonas

  const breakdown: PropinasBreakdown = {
    importePropina: round2(importePropina),
    totalConPropina: round2(totalConPropina),
    totalPorPersona: round2(totalPorPersona),
  }

  return {
    main: { label: 'Total a pagar (con propina)', value: breakdown.totalConPropina, unit: 'EUR' as const },
    breakdown,
  }
}

export const propinasCalculator: CalculatorDefinition<PropinasInput, PropinasBreakdown> = {
  meta: {
    slug: 'propinas',
    categorySlug: 'cotidiano',
    title: 'Calculadora de Propinas',
    seoTitle: 'Calculadora de Propinas: Calcula y Reparte la Propina',
    metaDescription:
      'Calcula la propina sobre una cuenta de restaurante y reparte el total entre los comensales en segundos.',
    shortDescription: 'Calcula la propina y repártela entre todos los comensales.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'importeCuenta', label: 'Importe de la cuenta', type: 'number', suffix: '€' },
    { key: 'porcentajePropina', label: 'Propina', type: 'number', suffix: '%' },
    { key: 'numPersonas', label: 'Número de personas', type: 'number' },
  ],
  defaultValues: {
    importeCuenta: 60,
    porcentajePropina: 10,
    numPersonas: 4,
  },
  faqs: [
    {
      question: '¿Es obligatorio dejar propina en España?',
      answer:
        'No, en España la propina no es obligatoria ni está incluida por defecto en la cuenta. Es una gratificación voluntaria por el servicio recibido, habitualmente entre el 5% y el 10% en restaurantes.',
    },
    {
      question: '¿Cómo se reparte la propina entre varias personas?',
      answer:
        'Esta calculadora suma la propina al importe total de la cuenta y divide ese total entre el número de personas que introduzcas, para que cada uno pague la misma parte.',
    },
  ],
  calculate,
}
