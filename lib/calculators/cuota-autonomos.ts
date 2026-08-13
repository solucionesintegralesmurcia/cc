import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const cuotaAutonomosInputSchema = z.object({
  rendimientoNetoMensual: z.number().min(0).max(1_000_000),
  esNuevoAutonomo: z.boolean(),
})

export type CuotaAutonomosInput = z.infer<typeof cuotaAutonomosInputSchema>

interface CuotaAutonomosBreakdown extends Record<string, number> {
  cuotaMensual: number
  cuotaAnual: number
  ahorroTarifaPlana: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Tabla de tramos por rendimientos netos mensuales (cotización por ingresos
// reales, RETA), cuota general orientativa 2026. Se revisa cada año en los
// Presupuestos Generales del Estado: actualizar esta tabla cuando se publique
// la nueva.
const TRAMOS_RETA = [
  { hasta: 670, cuota: 200 },
  { hasta: 900, cuota: 220 },
  { hasta: 1166.7, cuota: 260 },
  { hasta: 1300, cuota: 291 },
  { hasta: 1500, cuota: 294 },
  { hasta: 1700, cuota: 294 },
  { hasta: 1850, cuota: 320 },
  { hasta: 2030, cuota: 325 },
  { hasta: 2330, cuota: 330 },
  { hasta: 2760, cuota: 350 },
  { hasta: 3190, cuota: 370 },
  { hasta: 3620, cuota: 390 },
  { hasta: 4050, cuota: 415 },
  { hasta: 6000, cuota: 440 },
  { hasta: Infinity, cuota: 590 },
]

const CUOTA_TARIFA_PLANA = 80

function cuotaPorTramo(rendimientoNetoMensual: number): number {
  const tramo = TRAMOS_RETA.find((t) => rendimientoNetoMensual <= t.hasta)
  return tramo ? tramo.cuota : TRAMOS_RETA[TRAMOS_RETA.length - 1].cuota
}

function calculate(input: CuotaAutonomosInput) {
  const parsed = cuotaAutonomosInputSchema.parse(input)

  const cuotaSegunTramo = cuotaPorTramo(parsed.rendimientoNetoMensual)
  const cuotaMensual = parsed.esNuevoAutonomo ? CUOTA_TARIFA_PLANA : cuotaSegunTramo
  const ahorroTarifaPlana = parsed.esNuevoAutonomo
    ? Math.max(0, cuotaSegunTramo - CUOTA_TARIFA_PLANA)
    : 0

  const breakdown: CuotaAutonomosBreakdown = {
    cuotaMensual: round2(cuotaMensual),
    cuotaAnual: round2(cuotaMensual * 12),
    ahorroTarifaPlana: round2(ahorroTarifaPlana),
  }

  return {
    main: { label: 'Cuota mensual de autónomo', value: breakdown.cuotaMensual, unit: 'EUR' as const },
    breakdown,
  }
}

export const cuotaAutonomosCalculator: CalculatorDefinition<
  CuotaAutonomosInput,
  CuotaAutonomosBreakdown
> = {
  meta: {
    slug: 'cuota-autonomos',
    categorySlug: 'autonomos',
    title: 'Calculadora de Cuota de Autónomos 2026',
    seoTitle: 'Calculadora Cuota Autónomos 2026: Cotización por Ingresos Reales',
    metaDescription:
      'Calcula tu cuota mensual de autónomo (RETA) según tus rendimientos netos reales, o la tarifa plana de 80€ si acabas de darte de alta.',
    shortDescription: 'Calcula tu cuota de autónomo según tramos de ingresos reales o tarifa plana.',
    updatedAt: '2026-01-01',
  },
  fields: [
    {
      key: 'rendimientoNetoMensual',
      label: 'Rendimiento neto mensual (ingresos - gastos)',
      type: 'number',
      suffix: '€',
    },
    {
      key: 'esNuevoAutonomo',
      label: 'Eres nuevo autónomo (tarifa plana)',
      type: 'checkbox',
    },
  ],
  defaultValues: {
    rendimientoNetoMensual: 1200,
    esNuevoAutonomo: false,
  },
  faqs: [
    {
      question: '¿Qué es el rendimiento neto para calcular la cuota?',
      answer:
        'Es el resultado de restar a tus ingresos las deducciones fiscales admitidas (gastos de la actividad más un 7% adicional en estimación directa, con algunos límites). No es lo mismo que la facturación bruta.',
    },
    {
      question: '¿Cuánto dura la tarifa plana de 80€?',
      answer:
        'Se aplica durante los primeros 12 meses de alta, y puede prorrogarse otros 12 meses adicionales si tus rendimientos netos siguen por debajo del salario mínimo interprofesional.',
    },
    {
      question: '¿Puedo cambiar de tramo durante el año?',
      answer:
        'Sí, la normativa permite hasta seis cambios de tramo de cotización al año, ajustando la cuota a una previsión más realista de tus ingresos y evitando regularizaciones grandes al final.',
    },
    {
      question: '¿Esta tabla de tramos es exacta?',
      answer:
        'Es orientativa. Los tramos e importes se revisan cada año en los Presupuestos Generales del Estado, así que conviene confirmar el importe exacto vigente en la Seguridad Social antes de tomar decisiones.',
    },
  ],
  calculate,
}
