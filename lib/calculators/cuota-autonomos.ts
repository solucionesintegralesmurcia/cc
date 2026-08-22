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
    {
      question: '¿Puedo cambiar de tramo de cotización durante el año?',
      answer:
        'Sí, el sistema permite cambiar de base de cotización hasta seis veces al año, adaptándola a la evolución real de tus ingresos. Es recomendable ajustarla cuando tu rendimiento neto cambie de forma notable, ya que a final de año la Seguridad Social regulariza la diferencia entre lo cotizado y tu rendimiento neto real, pudiendo generar un pago adicional o una devolución.',
    },
    {
      question: '¿Qué pasa si a final de año mi rendimiento neto real no coincide con lo que había estimado?',
      answer:
        'La Seguridad Social hace una regularización anual: compara la cuota que has pagado cada mes (según tus previsiones) con la que te habría correspondido según tu rendimiento neto real, calculado con tu declaración de la Renta del ejercicio. Si has pagado de menos, te reclama la diferencia; si has pagado de más, te la devuelve.',
    },
    {
      question: '¿La tarifa plana incluye todas las contingencias, o solo la cuota mínima?',
      answer:
        'La tarifa plana es una cuota reducida durante el periodo inicial de alta que cubre las contingencias comunes obligatorias, igual que la cuota general por tramos. No incluye de forma automática coberturas voluntarias adicionales, como el cese de actividad o la cobertura de accidentes de trabajo y enfermedades profesionales, que puedes contratar aparte si lo deseas.',
    },
    {
      question: '¿Puedo recuperar la tarifa plana si vuelvo a darme de alta como autónomo?',
      answer:
        'En general, sí es posible volver a beneficiarte de la tarifa plana si te das de baja como autónomo y vuelves a darte de alta después de un periodo determinado (normalmente al menos 2 o 3 años desde la última vez que la disfrutaste), aunque las condiciones exactas conviene confirmarlas en el momento del alta, ya que pueden variar según la normativa vigente.',
    },
    {
      question: '¿Qué diferencia hay entre la cuota de autónomos y la cotización de un asalariado?',
      answer:
        'Un asalariado cotiza un porcentaje fijo sobre su salario bruto real, y tanto él como la empresa aportan una parte. Un autónomo paga una cuota fija mensual que depende del tramo de rendimiento neto en el que se encuentre, y asume él solo la totalidad de esa cuota, sin que exista un "empleador" que cofinancie la cotización.',
    },
    {
      question: '¿Cotizar por un tramo más alto del necesario mejora mi futura pensión?',
      answer:
        'Sí: cuanto mayor sea tu base de cotización (dentro de los límites del tramo elegido), mayor será tu base reguladora futura y, por tanto, tu pensión de jubilación. Muchos autónomos cotizan por el mínimo posible para reducir gastos mensuales, lo que a largo plazo suele traducirse en pensiones más bajas que las de un asalariado con ingresos equivalentes.',
    },
  ],
  content: [
    { type: 'heading', text: 'Cómo funciona la cuota de autónomos por tramos de rendimiento neto' },
    {
      type: 'paragraph',
      text:
        'Desde 2023, la cuota mensual de autónomos (dentro del RETA, el Régimen Especial de Trabajadores Autónomos) ya no se elige libremente entre una base mínima y máxima como antes: se calcula según el rendimiento neto real de tu actividad, es decir, tus ingresos menos los gastos deducibles. El sistema establece 15 tramos de rendimiento neto mensual, cada uno con una cuota mínima y máxima orientativa dentro de la cual el autónomo puede elegir, y cuanto mayor es tu rendimiento neto, mayor es la cuota que te corresponde.',
    },
    {
      type: 'paragraph',
      text:
        'Ejemplo resuelto: con un rendimiento neto mensual de 1.500 €, la cuota mensual estimada ronda los 294 €, unos 3.528 € al año. Un autónomo con un rendimiento neto más bajo, por ejemplo 900 € mensuales, pagaría una cuota bastante menor, en torno a 220 € al mes, reflejando la lógica progresiva del sistema por tramos.',
    },
    { type: 'heading', text: 'La tarifa plana para nuevos autónomos' },
    {
      type: 'paragraph',
      text:
        'Quienes se dan de alta por primera vez como autónomos (o vuelven a hacerlo tras un periodo suficiente sin estarlo) pueden acogerse a la tarifa plana: una cuota mensual muy reducida durante los primeros 12 meses, independientemente de cuál sea su rendimiento neto real. En determinados casos, esta tarifa reducida puede prorrogarse otros 12 meses adicionales si el rendimiento neto continúa siendo bajo, dando hasta 24 meses de cuota reducida en total.',
    },
    { type: 'heading', text: 'La regularización anual: por qué es importante ajustar bien tu previsión' },
    {
      type: 'paragraph',
      text:
        'Como no siempre se conoce el rendimiento neto exacto mes a mes, el sistema permite estimar y pagar una cuota provisional, que se ajusta a final de año comparándola con el rendimiento neto real reflejado en tu declaración de la Renta. Si has cotizado por debajo de lo que te correspondía, Hacienda te reclama la diferencia; si has cotizado por encima, te la devuelve. Por eso es importante revisar y actualizar tu previsión de ingresos varias veces al año (el sistema permite hasta 6 cambios anuales), para evitar sorpresas en la regularización.',
    },
    { type: 'heading', text: 'Cotizar más de lo mínimo: el impacto en tu futura pensión' },
    {
      type: 'paragraph',
      text:
        'Muchos autónomos, para reducir gastos mensuales, tienden a cotizar por la base más baja posible dentro de su tramo. Esta decisión, aunque alivia la tesorería a corto plazo, reduce la base reguladora que se usará para calcular la futura pensión de jubilación, así como otras prestaciones (incapacidad temporal, paro de autónomos). Vale la pena valorar, especialmente en los años previos a la jubilación, si cotizar algo por encima del mínimo dentro del tramo compensa a cambio de una pensión futura más alta.',
    },
  ],
  breakdownUnits: { mesesTarifaPlana: 'NUMERO' },
  calculate,
}
