import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const gastosCompraventaInputSchema = z.object({
  precioVivienda: z.number().min(1).max(50_000_000),
  esViviendaNueva: z.boolean(),
})

export type GastosCompraventaInput = z.infer<typeof gastosCompraventaInputSchema>

interface GastosCompraventaBreakdown extends Record<string, number> {
  impuestoTransmision: number
  notaria: number
  registro: number
  gestoria: number
  totalGastos: number
  costeTotalOperacion: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Tipos orientativos: vivienda nueva paga IVA (10%) + AJD (1,5% de media,
// varía por CCAA entre 0,5% y 1,5%); vivienda usada paga ITP (8% de media,
// varía por CCAA entre el 6% y el 11%). Notaría y registro son aranceles
// regulados con mínimos aproximados; gestoría es un coste de mercado.
const IVA_VIVIENDA_NUEVA = 0.1
const AJD_MEDIO = 0.015
const ITP_MEDIO = 0.08
const GESTORIA_FIJA = 300

function calculate(input: GastosCompraventaInput) {
  const parsed = gastosCompraventaInputSchema.parse(input)

  const impuestoTransmision = parsed.esViviendaNueva
    ? parsed.precioVivienda * (IVA_VIVIENDA_NUEVA + AJD_MEDIO)
    : parsed.precioVivienda * ITP_MEDIO

  const notaria = Math.max(600, parsed.precioVivienda * 0.003)
  const registro = Math.max(400, parsed.precioVivienda * 0.002)
  const gestoria = GESTORIA_FIJA

  const totalGastos = impuestoTransmision + notaria + registro + gestoria
  const costeTotalOperacion = parsed.precioVivienda + totalGastos

  const breakdown: GastosCompraventaBreakdown = {
    impuestoTransmision: round2(impuestoTransmision),
    notaria: round2(notaria),
    registro: round2(registro),
    gestoria: round2(gestoria),
    totalGastos: round2(totalGastos),
    costeTotalOperacion: round2(costeTotalOperacion),
  }

  return {
    main: { label: 'Coste total de la operación', value: breakdown.costeTotalOperacion, unit: 'EUR' as const },
    breakdown,
  }
}

export const gastosCompraventaCalculator: CalculatorDefinition<
  GastosCompraventaInput,
  GastosCompraventaBreakdown
> = {
  meta: {
    slug: 'gastos-compraventa',
    categorySlug: 'vivienda',
    title: 'Calculadora de Gastos de Compraventa de Vivienda 2026',
    seoTitle: 'Calculadora de Gastos al Comprar una Vivienda 2026: Impuestos, Notaría y Registro',
    metaDescription:
      'Calcula todos los gastos de comprar una vivienda nueva o de segunda mano: IVA/ITP, AJD, notaría, registro de la propiedad y gestoría.',
    shortDescription: 'Calcula impuestos, notaría, registro y gestoría al comprar una vivienda.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'precioVivienda', label: 'Precio de la vivienda', type: 'number', suffix: '€' },
    { key: 'esViviendaNueva', label: 'Es vivienda nueva (obra nueva)', type: 'checkbox' },
  ],
  defaultValues: {
    precioVivienda: 200000,
    esViviendaNueva: false,
  },
  faqs: [
    {
      question: '¿Qué diferencia hay entre comprar vivienda nueva y de segunda mano?',
      answer:
        'La vivienda nueva (obra nueva, comprada directamente al promotor) tributa por IVA más el Impuesto de Actos Jurídicos Documentados (AJD). La vivienda de segunda mano tributa por el Impuesto de Transmisiones Patrimoniales (ITP), que sustituye al IVA y al AJD.',
    },
    {
      question: '¿Por qué varían tanto el ITP y el AJD según la comunidad autónoma?',
      answer:
        'Son impuestos cedidos a las comunidades autónomas, que fijan su propio porcentaje dentro de unos márgenes. El ITP puede ir del 6% al 11% aproximadamente, y el AJD del 0,5% al 1,5%, según la comunidad y a veces según el perfil del comprador.',
    },
    {
      question: '¿Estos gastos incluyen la hipoteca?',
      answer:
        'No. Si financias la compra con hipoteca, hay que sumar además los gastos propios del préstamo (tasación, tipo de interés y, en su caso, comisión de apertura), que no se incluyen en esta calculadora.',
    },
  ],
  calculate,
}
