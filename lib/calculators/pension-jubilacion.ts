import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const jubilacionInputSchema = z.object({
  baseReguladoraMensual: z.number().min(0).max(20000),
  aniosCotizados: z.number().min(0).max(50),
})

export type JubilacionInput = z.infer<typeof jubilacionInputSchema>

interface JubilacionBreakdown extends Record<string, number> {
  porcentajeAplicado: number
  pensionMensualEstimada: number
  pensionAnualEstimada: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Escala simplificada: 50% con 15 años cotizados, sube progresivamente
// hasta el 100% con 36-37 años (según normativa vigente, orientativo).
function calcularPorcentaje(anios: number): number {
  if (anios <= 15) return 50
  if (anios >= 37) return 100

  // Tramo 15-25 años: +0,21% por mes adicional (aprox.)
  // Tramo 25-37 años: +0,19% por mes adicional (aprox.)
  const mesesDesde15 = (anios - 15) * 12
  if (anios <= 25) {
    return 50 + mesesDesde15 * 0.21
  }
  const porcentajeA25 = 50 + 10 * 12 * 0.21
  const mesesDesde25 = (anios - 25) * 12
  return Math.min(100, porcentajeA25 + mesesDesde25 * 0.19)
}

function calculate(input: JubilacionInput) {
  const parsed = jubilacionInputSchema.parse(input)

  const porcentajeAplicado = calcularPorcentaje(parsed.aniosCotizados)
  const pensionMensualEstimada = parsed.baseReguladoraMensual * (porcentajeAplicado / 100)
  const pensionAnualEstimada = pensionMensualEstimada * 14

  const breakdown: JubilacionBreakdown = {
    porcentajeAplicado: round2(porcentajeAplicado),
    pensionMensualEstimada: round2(pensionMensualEstimada),
    pensionAnualEstimada: round2(pensionAnualEstimada),
  }

  return {
    main: { label: 'Pensión mensual estimada', value: breakdown.pensionMensualEstimada, unit: 'EUR' as const },
    breakdown,
  }
}

export const jubilacionCalculator: CalculatorDefinition<JubilacionInput, JubilacionBreakdown> = {
  meta: {
    slug: 'pension-jubilacion',
    categorySlug: 'social',
    title: 'Calculadora de Pensión de Jubilación 2026',
    seoTitle: 'Calculadora de Jubilación 2026: Estima tu Pensión',
    metaDescription:
      'Calcula una estimación de tu pensión de jubilación según tu base reguladora y los años cotizados a la Seguridad Social.',
    shortDescription: 'Estima tu pensión de jubilación según años cotizados y base reguladora.',
    updatedAt: '2026-01-01',
  },
  fields: [
    {
      key: 'baseReguladoraMensual',
      label: 'Base reguladora mensual estimada',
      type: 'number',
      suffix: '€',
    },
    { key: 'aniosCotizados', label: 'Años cotizados', type: 'number', suffix: 'años', step: 0.5 },
  ],
  defaultValues: {
    baseReguladoraMensual: 2000,
    aniosCotizados: 30,
  },
  faqs: [
    {
      question: '¿Qué es la base reguladora de la pensión?',
      answer:
        'Es el promedio de tus bases de cotización de un periodo previo a la jubilación (actualmente en transición hacia los últimos 29 años), actualizado según la evolución del IPC.',
    },
    {
      question: '¿Con cuántos años cotizados se cobra el 100% de la pensión?',
      answer:
        'Con la normativa vigente, se necesitan en torno a 36-37 años cotizados para alcanzar el 100% de la base reguladora. Con menos años, el porcentaje se reduce de forma progresiva, con un mínimo del 50% a partir de 15 años cotizados.',
    },
    {
      question: '¿Esta calculadora es exacta?',
      answer:
        'No. Es una estimación simplificada de la escala de porcentajes. El cálculo real de la Seguridad Social incorpora coeficientes reductores o de incentivo según la edad exacta de jubilación, y otros factores. Consulta tu vida laboral y una estimación oficial en la Seguridad Social.',
    },
  ],
  calculate,
}
