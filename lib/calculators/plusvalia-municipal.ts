import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const plusvaliaMunicipalInputSchema = z.object({
  valorCatastralSuelo: z.number().min(0).max(50_000_000),
  precioCompra: z.number().min(0).max(50_000_000),
  precioVenta: z.number().min(0).max(50_000_000),
  aniosPosesion: z.number().int().min(1).max(30),
})

export type PlusvaliaMunicipalInput = z.infer<typeof plusvaliaMunicipalInputSchema>

interface PlusvaliaMunicipalBreakdown extends Record<string, number> {
  incrementoMetodoObjetivo: number
  cuotaMetodoObjetivo: number
  gananciaReal: number
  cuotaMetodoReal: number
  cuotaAPagar: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Coeficientes máximos legales por años de posesión (RD-ley 26/2021),
// orientativos: cada ayuntamiento aprueba los suyos propios sin superar
// estos máximos, y se actualizan cada año.
const COEFICIENTES_POR_ANIOS: Record<number, number> = {
  1: 0.14, 2: 0.13, 3: 0.15, 4: 0.17, 5: 0.17,
  6: 0.16, 7: 0.12, 8: 0.1, 9: 0.09, 10: 0.08,
  11: 0.08, 12: 0.08, 13: 0.08, 14: 0.1, 15: 0.12,
  16: 0.16, 17: 0.2, 18: 0.26, 19: 0.36,
}
const COEFICIENTE_20_O_MAS = 0.45
const TIPO_GRAVAMEN = 0.3 // tipo máximo habitual (varía por ayuntamiento, hasta 30%)

function coeficienteSegunAnios(anios: number): number {
  if (anios >= 20) return COEFICIENTE_20_O_MAS
  return COEFICIENTES_POR_ANIOS[anios] ?? COEFICIENTE_20_O_MAS
}

// Desde la reforma de 2021, el contribuyente puede elegir el método (objetivo
// o real) que le resulte más favorable. Si no hay incremento real de valor,
// la operación queda exenta del impuesto.
function calculate(input: PlusvaliaMunicipalInput) {
  const parsed = plusvaliaMunicipalInputSchema.parse(input)

  const coeficiente = coeficienteSegunAnios(parsed.aniosPosesion)
  const incrementoMetodoObjetivo = parsed.valorCatastralSuelo * coeficiente
  const cuotaMetodoObjetivo = incrementoMetodoObjetivo * TIPO_GRAVAMEN

  const gananciaReal = parsed.precioVenta - parsed.precioCompra
  const cuotaMetodoReal = gananciaReal > 0 ? gananciaReal * TIPO_GRAVAMEN : 0

  const cuotaAPagar =
    gananciaReal <= 0 ? 0 : Math.min(cuotaMetodoObjetivo, cuotaMetodoReal)

  const breakdown: PlusvaliaMunicipalBreakdown = {
    incrementoMetodoObjetivo: round2(incrementoMetodoObjetivo),
    cuotaMetodoObjetivo: round2(cuotaMetodoObjetivo),
    gananciaReal: round2(gananciaReal),
    cuotaMetodoReal: round2(cuotaMetodoReal),
    cuotaAPagar: round2(cuotaAPagar),
  }

  return {
    main: { label: 'Plusvalía municipal a pagar', value: breakdown.cuotaAPagar, unit: 'EUR' as const },
    breakdown,
  }
}

export const plusvaliaMunicipalCalculator: CalculatorDefinition<
  PlusvaliaMunicipalInput,
  PlusvaliaMunicipalBreakdown
> = {
  meta: {
    slug: 'plusvalia-municipal',
    categorySlug: 'impuestos',
    title: 'Calculadora de Plusvalía Municipal 2026',
    seoTitle: 'Calculadora de Plusvalía Municipal 2026 (IIVTNU): Método Objetivo vs Real',
    metaDescription:
      'Calcula la plusvalía municipal al vender una vivienda comparando el método objetivo (valor catastral) y el real (ganancia efectiva), y paga solo el menor.',
    shortDescription: 'Calcula el impuesto municipal al vender una vivienda con el método más favorable.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'valorCatastralSuelo', label: 'Valor catastral del suelo', type: 'number', suffix: '€' },
    { key: 'precioCompra', label: 'Precio de compra de la vivienda', type: 'number', suffix: '€' },
    { key: 'precioVenta', label: 'Precio de venta de la vivienda', type: 'number', suffix: '€' },
    { key: 'aniosPosesion', label: 'Años en posesión del inmueble', type: 'number', suffix: 'años' },
  ],
  defaultValues: {
    valorCatastralSuelo: 60000,
    precioCompra: 150000,
    precioVenta: 220000,
    aniosPosesion: 8,
  },
  faqs: [
    {
      question: '¿Qué es la plusvalía municipal?',
      answer:
        'Es el Impuesto sobre el Incremento de Valor de los Terrenos de Naturaleza Urbana (IIVTNU), un tributo municipal que grava el aumento de valor del suelo urbano entre la compra y la venta de un inmueble.',
    },
    {
      question: '¿Puedo elegir cómo se calcula?',
      answer:
        'Sí, desde la reforma de 2021 puedes elegir entre el método objetivo (basado en el valor catastral del suelo y unos coeficientes según los años de posesión) o el método real (basado en la ganancia efectiva entre compra y venta), pagando siempre el que resulte más bajo.',
    },
    {
      question: '¿Y si vendo por menos de lo que compré?',
      answer:
        'Si no hay incremento real de valor (vendes igual o más barato de lo que compraste), la operación queda exenta del impuesto, aunque en muchos ayuntamientos hay que acreditarlo formalmente.',
    },
    {
      question: '¿Dónde encuentro el valor catastral del suelo?',
      answer:
        'Aparece desglosado en el recibo del IBI (Impuesto sobre Bienes Inmuebles), separado del valor catastral de la construcción.',
    },
  ],
  calculate,
}
