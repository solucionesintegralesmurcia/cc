import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const plusvaliaInputSchema = z.object({
  valorCatastralSuelo: z.number().min(0).max(50_000_000),
  aniosTenencia: z.number().int().min(0).max(20),
  tipoImpositivoMunicipal: z.number().min(0).max(30),
})

export type PlusvaliaInput = z.infer<typeof plusvaliaInputSchema>

interface PlusvaliaBreakdown extends Record<string, number> {
  coeficienteAplicado: number
  incrementoValorEstimado: number
  cuotaAPagar: number
}

// Coeficientes máximos legales por años de tenencia (método de estimación
// objetiva, Real Decreto-ley 26/2021). Cada ayuntamiento puede aplicar un
// coeficiente igual o inferior a este máximo estatal.
const COEFICIENTES: Record<number, number> = {
  0: 0.14,
  1: 0.13,
  2: 0.15,
  3: 0.16,
  4: 0.17,
  5: 0.17,
  6: 0.16,
  7: 0.12,
  8: 0.1,
  9: 0.09,
  10: 0.08,
  11: 0.08,
  12: 0.08,
  13: 0.08,
  14: 0.1,
  15: 0.12,
  16: 0.16,
  17: 0.2,
  18: 0.26,
  19: 0.36,
  20: 0.45,
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: PlusvaliaInput) {
  const parsed = plusvaliaInputSchema.parse(input)
  const coeficienteAplicado = COEFICIENTES[parsed.aniosTenencia] ?? COEFICIENTES[20]!

  const incrementoValorEstimado = parsed.valorCatastralSuelo * coeficienteAplicado
  const cuotaAPagar = incrementoValorEstimado * (parsed.tipoImpositivoMunicipal / 100)

  const breakdown: PlusvaliaBreakdown = {
    coeficienteAplicado,
    incrementoValorEstimado: round2(incrementoValorEstimado),
    cuotaAPagar: round2(cuotaAPagar),
  }

  return {
    main: { label: 'Cuota estimada a pagar', value: breakdown.cuotaAPagar, unit: 'EUR' as const },
    breakdown,
  }
}

export const plusvaliaCalculator: CalculatorDefinition<PlusvaliaInput, PlusvaliaBreakdown> = {
  meta: {
    slug: 'plusvalia-municipal',
    categorySlug: 'impuestos',
    title: 'Calculadora de Plusvalía Municipal 2026',
    seoTitle: 'Calculadora de Plusvalía Municipal 2026 (IIVTNU): Método Objetivo',
    metaDescription:
      'Calcula el Impuesto sobre el Incremento de Valor de los Terrenos (plusvalía municipal) al vender una vivienda, según el valor catastral del suelo y los años de tenencia.',
    shortDescription: 'Estima la plusvalía municipal al vender una vivienda, por el método objetivo.',
    updatedAt: '2026-01-01',
  },
  fields: [
    {
      key: 'valorCatastralSuelo',
      label: 'Valor catastral del suelo (solo suelo, no construcción)',
      type: 'number',
      suffix: '€',
    },
    { key: 'aniosTenencia', label: 'Años de tenencia del inmueble', type: 'number', suffix: 'años' },
    {
      key: 'tipoImpositivoMunicipal',
      label: 'Tipo impositivo de tu ayuntamiento',
      type: 'number',
      suffix: '%',
      step: 0.1,
    },
  ],
  defaultValues: {
    valorCatastralSuelo: 60000,
    aniosTenencia: 10,
    tipoImpositivoMunicipal: 30,
  },
  faqs: [
    {
      question: '¿Qué es la plusvalía municipal?',
      answer:
        'Es el Impuesto sobre el Incremento de Valor de los Terrenos de Naturaleza Urbana (IIVTNU), que grava la revalorización del suelo (no de la construcción) desde que compraste el inmueble hasta que lo vendes, dones o heredas.',
    },
    {
      question: '¿De dónde saco el valor catastral del suelo?',
      answer:
        'Aparece desglosado en el recibo del IBI de la vivienda, separado del valor catastral de la construcción. Solo se usa la parte del suelo para este cálculo.',
    },
    {
      question: '¿Existe otro método de cálculo además de este?',
      answer:
        'Sí. Desde 2021 puedes elegir entre este método objetivo (basado en el valor catastral y un coeficiente por años) o el método real (diferencia entre el precio de venta y de compra, proporcional al valor del suelo), pagando el que resulte más bajo. Si no hay incremento real de valor, la venta está exenta del impuesto.',
    },
    {
      question: '¿El tipo impositivo es igual en todos los municipios?',
      answer:
        'No, cada ayuntamiento fija su propio tipo dentro del máximo legal del 30%. Consulta la ordenanza fiscal de tu municipio para el valor exacto.',
    },
  ],
  breakdownUnits: { coeficienteAplicado: 'NUMERO' },
  calculate,
}
