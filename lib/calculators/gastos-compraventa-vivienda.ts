import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const gastosViviendaInputSchema = z.object({
  precioVivienda: z.number().min(0).max(50_000_000),
  tipoVivienda: z.enum(['nueva', 'segunda_mano']),
  conHipoteca: z.boolean(),
})

export type GastosViviendaInput = z.infer<typeof gastosViviendaInputSchema>

interface GastosViviendaBreakdown extends Record<string, number> {
  impuestoTransmision: number
  notaria: number
  registro: number
  gestoria: number
  tasacion: number
  totalGastos: number
  totalConGastos: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: GastosViviendaInput) {
  const parsed = gastosViviendaInputSchema.parse(input)

  // Vivienda nueva: IVA 10% + AJD ~1,5% (varía por CCAA).
  // Segunda mano: ITP ~8% de media (varía por CCAA entre el 6% y el 11%).
  const impuestoTransmision =
    parsed.tipoVivienda === 'nueva' ? parsed.precioVivienda * 0.115 : parsed.precioVivienda * 0.08

  const notaria = Math.max(parsed.precioVivienda * 0.005, 300)
  const registro = Math.max(parsed.precioVivienda * 0.004, 250)
  const gestoria = 300
  const tasacion = parsed.conHipoteca ? 300 : 0

  const totalGastos = impuestoTransmision + notaria + registro + gestoria + tasacion
  const totalConGastos = parsed.precioVivienda + totalGastos

  const breakdown: GastosViviendaBreakdown = {
    impuestoTransmision: round2(impuestoTransmision),
    notaria: round2(notaria),
    registro: round2(registro),
    gestoria: round2(gestoria),
    tasacion: round2(tasacion),
    totalGastos: round2(totalGastos),
    totalConGastos: round2(totalConGastos),
  }

  return {
    main: { label: 'Total gastos de compraventa', value: breakdown.totalGastos, unit: 'EUR' as const },
    breakdown,
  }
}

export const gastosViviendaCalculator: CalculatorDefinition<GastosViviendaInput, GastosViviendaBreakdown> = {
  meta: {
    slug: 'gastos-compraventa-vivienda',
    categorySlug: 'vivienda',
    title: 'Calculadora de Gastos de Compraventa de Vivienda 2026',
    seoTitle: 'Calculadora Gastos Compra Vivienda 2026: IVA/ITP, Notaría, Registro',
    metaDescription:
      'Calcula todos los gastos de comprar una vivienda: impuesto de transmisión (IVA o ITP), notaría, registro, gestoría y tasación.',
    shortDescription: 'Calcula todos los gastos extra al comprar una vivienda, más allá del precio.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'precioVivienda', label: 'Precio de la vivienda', type: 'number', suffix: '€' },
    {
      key: 'tipoVivienda',
      label: 'Tipo de vivienda',
      type: 'select',
      options: [
        { value: 'nueva', label: 'Nueva (obra nueva)' },
        { value: 'segunda_mano', label: 'Segunda mano' },
      ],
    },
    { key: 'conHipoteca', label: 'La compras con hipoteca', type: 'checkbox' },
  ],
  defaultValues: {
    precioVivienda: 200000,
    tipoVivienda: 'segunda_mano',
    conHipoteca: true,
  },
  faqs: [
    {
      question: '¿Qué diferencia hay entre comprar vivienda nueva y de segunda mano?',
      answer:
        'La vivienda nueva paga IVA (10% en general) más el Impuesto de Actos Jurídicos Documentados (AJD). La vivienda de segunda mano paga el Impuesto de Transmisiones Patrimoniales (ITP), cuyo tipo varía según la comunidad autónoma, normalmente entre el 6% y el 11%.',
    },
    {
      question: '¿Quién paga los gastos de la hipoteca, el banco o yo?',
      answer:
        'Desde la Ley Hipotecaria de 2019, el banco asume el AJD de la hipoteca, la notaría y el registro de la escritura de préstamo. Al comprador le suele quedar la tasación del inmueble, que es obligatoria para conceder la hipoteca.',
    },
    {
      question: '¿Estos porcentajes son iguales en toda España?',
      answer:
        'No. El ITP y el AJD son impuestos cedidos a las comunidades autónomas, que pueden fijar tipos distintos. Los valores usados aquí son una media orientativa; consulta el tipo exacto de tu comunidad antes de presupuestar la compra.',
    },
    {
      question: '¿Qué porcentaje del precio suponen los gastos totales?',
      answer:
        'Como orientación general, en vivienda de segunda mano los gastos totales suelen rondar entre el 10% y el 12% del precio de compra, dominados principalmente por el ITP. En vivienda nueva el porcentaje puede ser algo distinto por la combinación de IVA y AJD.',
    },
    {
      question: '¿Hay bonificaciones en el ITP según el perfil del comprador?',
      answer:
        'Sí, muchas comunidades autónomas aplican tipos reducidos de ITP para determinados colectivos, como jóvenes menores de cierta edad, familias numerosas o compra de vivienda habitual. Conviene consultar la normativa autonómica específica, ya que puede suponer un ahorro significativo sobre el tipo general.',
    },
  ],
  content: [
    { type: 'heading', text: 'Todos los gastos al comprar una vivienda, más allá del precio' },
    {
      type: 'paragraph',
      text:
        'Comprar una casa cuesta bastante más que el precio de venta. Impuesto de transmisión: en vivienda nueva pagas IVA (10% general) más el Impuesto de Actos Jurídicos Documentados (AJD, variable por comunidad, en torno al 1-1,5%); en vivienda de segunda mano pagas el Impuesto de Transmisiones Patrimoniales (ITP), que varía por comunidad autónoma entre el 6% y el 11%, el gasto más importante con diferencia. Notaría: honorarios por arancel estatal, en torno al 0,5% del precio (con un mínimo). Registro de la Propiedad: arancel también fijado por ley, en torno al 0,4% del precio. Gestoría: coste fijo aproximado. Tasación: solo si compras con hipoteca, obligatoria para que el banco conceda el préstamo.',
    },
    {
      type: 'paragraph',
      text:
        'Ejemplo resuelto: una vivienda de segunda mano de 200.000 € con hipoteca, en una comunidad con ITP del 8%: 16.000 € de ITP + ~1.000 € de notaría + ~800 € de registro + 300 € de gestoría + 300 € de tasación ≈ 18.400 € en gastos, un 9,2% adicional sobre el precio de compra.',
    },
    { type: 'heading', text: 'Quién paga qué desde la reforma de 2019' },
    {
      type: 'paragraph',
      text:
        'La Ley Hipotecaria de 2019 cambió el reparto de gastos de la hipoteca: el banco asume el AJD del préstamo, la notaría y el registro de la escritura de préstamo hipotecario. Al comprador solo le queda, por parte del préstamo, el coste de la tasación; el resto de gastos corresponden a la compraventa del inmueble en sí, no al préstamo.',
    },
  ],
  calculate,
}
