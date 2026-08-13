import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const presupuesto503020InputSchema = z.object({
  ingresoMensualNeto: z.number().min(0).max(1_000_000),
})

export type Presupuesto503020Input = z.infer<typeof presupuesto503020InputSchema>

interface Presupuesto503020Breakdown extends Record<string, number> {
  necesidades: number
  deseos: number
  ahorroEInversion: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Regla 50/30/20: 50% necesidades, 30% deseos, 20% ahorro/inversión/deuda.
function calculate(input: Presupuesto503020Input) {
  const parsed = presupuesto503020InputSchema.parse(input)

  const necesidades = parsed.ingresoMensualNeto * 0.5
  const deseos = parsed.ingresoMensualNeto * 0.3
  const ahorroEInversion = parsed.ingresoMensualNeto * 0.2

  const breakdown: Presupuesto503020Breakdown = {
    necesidades: round2(necesidades),
    deseos: round2(deseos),
    ahorroEInversion: round2(ahorroEInversion),
  }

  return {
    main: { label: 'Ahorro e inversión recomendados', value: breakdown.ahorroEInversion, unit: 'EUR' as const },
    breakdown,
  }
}

export const presupuesto503020Calculator: CalculatorDefinition<
  Presupuesto503020Input,
  Presupuesto503020Breakdown
> = {
  meta: {
    slug: 'presupuesto-50-30-20',
    categorySlug: 'finanzas-personales',
    title: 'Calculadora de Presupuesto 50/30/20',
    seoTitle: 'Calculadora Regla 50/30/20: Reparte tu Sueldo con Sentido',
    metaDescription:
      'Aplica la popular regla 50/30/20 a tu sueldo neto mensual: 50% necesidades, 30% deseos, 20% ahorro e inversión. Calcula el reparto ideal al instante.',
    shortDescription: 'Reparte tu sueldo neto entre necesidades, deseos y ahorro con la regla 50/30/20.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'ingresoMensualNeto', label: 'Ingreso mensual neto', type: 'number', suffix: '€' },
  ],
  defaultValues: {
    ingresoMensualNeto: 1800,
  },
  faqs: [
    {
      question: '¿Qué entra dentro de "necesidades"?',
      answer:
        'Gastos imprescindibles: vivienda (alquiler o hipoteca), suministros, alimentación básica, transporte para trabajar, seguros obligatorios y pagos mínimos de deuda.',
    },
    {
      question: '¿Qué entra dentro de "deseos"?',
      answer:
        'Gastos discrecionales que mejoran tu calidad de vida pero no son estrictamente necesarios: ocio, restaurantes, suscripciones, ropa no esencial, viajes.',
    },
    {
      question: '¿Es una regla rígida que hay que cumplir siempre?',
      answer:
        'No, es una guía orientativa. En ciudades con alquileres muy altos, el bloque de necesidades puede superar el 50% sin que eso signifique una mala gestión; lo importante es mantener un porcentaje de ahorro constante, aunque sea menor al 20%.',
    },
  ],
  calculate,
}
