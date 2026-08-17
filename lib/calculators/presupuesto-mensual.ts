import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const presupuestoInputSchema = z.object({
  ingresosMensualesNetos: z.number().min(0).max(500_000),
})

export type PresupuestoInput = z.infer<typeof presupuestoInputSchema>

interface PresupuestoBreakdown extends Record<string, number> {
  necesidades: number
  deseos: number
  ahorroEInversion: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Regla 50/30/20: un reparto orientativo popularizado para presupuesto
// personal, no una obligación ni una fórmula oficial.
function calculate(input: PresupuestoInput) {
  const parsed = presupuestoInputSchema.parse(input)

  const necesidades = parsed.ingresosMensualesNetos * 0.5
  const deseos = parsed.ingresosMensualesNetos * 0.3
  const ahorroEInversion = parsed.ingresosMensualesNetos * 0.2

  const breakdown: PresupuestoBreakdown = {
    necesidades: round2(necesidades),
    deseos: round2(deseos),
    ahorroEInversion: round2(ahorroEInversion),
  }

  return {
    main: { label: 'Destinado a ahorro e inversión (20%)', value: breakdown.ahorroEInversion, unit: 'EUR' as const },
    breakdown,
  }
}

export const presupuestoCalculator: CalculatorDefinition<PresupuestoInput, PresupuestoBreakdown> = {
  meta: {
    slug: 'presupuesto-mensual',
    categorySlug: 'finanzas-personales',
    title: 'Calculadora de Presupuesto Mensual 2026',
    seoTitle: 'Calculadora de Presupuesto 50/30/20: Organiza tus Gastos',
    metaDescription:
      'Reparte tu sueldo neto mensual según la regla 50/30/20: necesidades, deseos y ahorro, para organizar tu presupuesto personal.',
    shortDescription: 'Reparte tus ingresos mensuales en necesidades, deseos y ahorro con la regla 50/30/20.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'ingresosMensualesNetos', label: 'Ingresos netos mensuales', type: 'number', suffix: '€' },
  ],
  defaultValues: {
    ingresosMensualesNetos: 1800,
  },
  faqs: [
    {
      question: '¿Qué es la regla 50/30/20?',
      answer:
        'Es una guía de presupuesto personal que propone destinar el 50% de tus ingresos netos a necesidades (vivienda, alimentación, suministros), el 30% a deseos (ocio, caprichos) y el 20% a ahorro e inversión.',
    },
    {
      question: '¿Qué cuenta como "necesidad" y qué como "deseo"?',
      answer:
        'Las necesidades son gastos que no puedes evitar sin afectar tu bienestar básico: alquiler o hipoteca, comida, suministros, transporte al trabajo, seguros. Los deseos son gastos discrecionales: restaurantes, suscripciones de ocio, ropa no esencial, viajes.',
    },
    {
      question: '¿Tengo que seguir exactamente estos porcentajes?',
      answer:
        'No, es una guía orientativa, no una norma rígida. Si vives en una ciudad cara, tus necesidades pueden superar el 50%; si tienes pocos gastos fijos, puedes destinar más al ahorro. Úsala como punto de partida para ajustar a tu situación.',
    },
  ],
  calculate,
}
