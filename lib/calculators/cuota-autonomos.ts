import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const cuotaAutonomoInputSchema = z.object({
  rendimientoNetoMensual: z.number().min(0).max(50000),
  esNuevoAutonomo: z.boolean(),
})

export type CuotaAutonomoInput = z.infer<typeof cuotaAutonomoInputSchema>

interface CuotaAutonomoBreakdown extends Record<string, number> {
  cuotaMensual: number
  cuotaAnual: number
  mesesTarifaPlana: number
}

// Tramos de cuota RETA por rendimiento neto mensual (2026, orientativos).
// El sistema real tiene 15 tramos con cuota mínima y máxima por tramo;
// aquí se usa la cuota media de cada tramo para simplificar la estimación.
const TRAMOS = [
  { hasta: 670, cuota: 200 },
  { hasta: 900, cuota: 220 },
  { hasta: 1166.7, cuota: 260 },
  { hasta: 1300, cuota: 291 },
  { hasta: 1500, cuota: 294 },
  { hasta: 1700, cuota: 350 },
  { hasta: 1850, cuota: 370 },
  { hasta: 2030, cuota: 390 },
  { hasta: 2330, cuota: 415 },
  { hasta: 2760, cuota: 440 },
  { hasta: 3190, cuota: 465 },
  { hasta: 3620, cuota: 490 },
  { hasta: 4050, cuota: 515 },
  { hasta: 6000, cuota: 540 },
  { hasta: Infinity, cuota: 590 },
]

const CUOTA_TARIFA_PLANA = 80 // primeros 12 meses, cuota reducida 2026

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: CuotaAutonomoInput) {
  const parsed = cuotaAutonomoInputSchema.parse(input)

  let cuotaMensual: number
  let mesesTarifaPlana = 0

  if (parsed.esNuevoAutonomo) {
    cuotaMensual = CUOTA_TARIFA_PLANA
    mesesTarifaPlana = 12
  } else {
    const tramo = TRAMOS.find((t) => parsed.rendimientoNetoMensual <= t.hasta) ?? TRAMOS[TRAMOS.length - 1]!
    cuotaMensual = tramo.cuota
  }

  const breakdown: CuotaAutonomoBreakdown = {
    cuotaMensual: round2(cuotaMensual),
    cuotaAnual: round2(cuotaMensual * 12),
    mesesTarifaPlana,
  }

  return {
    main: { label: 'Cuota mensual estimada', value: breakdown.cuotaMensual, unit: 'EUR' as const },
    breakdown,
  }
}

export const cuotaAutonomoCalculator: CalculatorDefinition<CuotaAutonomoInput, CuotaAutonomoBreakdown> = {
  meta: {
    slug: 'cuota-autonomos',
    categorySlug: 'autonomos',
    title: 'Calculadora de Cuota de Autónomos 2026',
    seoTitle: 'Calculadora Cuota Autónomos 2026: RETA por Rendimiento Neto',
    metaDescription:
      'Calcula tu cuota mensual de autónomos (RETA) según tu rendimiento neto real, o la tarifa plana si eres nuevo autónomo.',
    shortDescription: 'Estima tu cuota RETA por tramos de rendimiento neto, o la tarifa plana.',
    updatedAt: '2026-01-01',
  },
  fields: [
    {
      key: 'esNuevoAutonomo',
      label: '¿Eres nuevo autónomo (tarifa plana)?',
      type: 'checkbox',
    },
    {
      key: 'rendimientoNetoMensual',
      label: 'Rendimiento neto mensual estimado',
      type: 'number',
      suffix: '€',
    },
  ],
  defaultValues: {
    rendimientoNetoMensual: 1500,
    esNuevoAutonomo: false,
  },
  faqs: [
    {
      question: '¿Qué es el rendimiento neto y cómo lo calculo?',
      answer:
        'Es tus ingresos como autónomo menos los gastos deducibles de tu actividad, antes de impuestos. Desde 2023, la cuota de autónomos se calcula sobre este rendimiento neto real, no sobre una base elegida libremente.',
    },
    {
      question: '¿Cuánto dura la tarifa plana?',
      answer:
        'La tarifa plana reducida se aplica durante los primeros 12 meses de alta como autónomo, y en algunos casos puede prorrogarse otros 12 meses más si el rendimiento neto sigue siendo bajo.',
    },
    {
      question: '¿Esta calculadora usa los tramos oficiales exactos?',
      answer:
        'Usa una cuota media orientativa por cada uno de los tramos oficiales de rendimiento neto. La Seguridad Social publica una cuota mínima y máxima dentro de cada tramo, y puedes elegir cualquier valor entre ambas; consulta tu caso exacto en la sede de la Seguridad Social.',
    },
  ],
  calculate,
}
