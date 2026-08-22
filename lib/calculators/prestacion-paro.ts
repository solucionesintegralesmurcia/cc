import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const paroInputSchema = z.object({
  baseReguladoraMensual: z.number().min(0).max(20000),
  numHijos: z.number().int().min(0).max(10),
})

export type ParoInput = z.infer<typeof paroInputSchema>

interface ParoBreakdown extends Record<string, number> {
  importePrimeros180Dias: number
  importeDesdeDia181: number
  topeMaximoAplicado: number
  topeMinimoAplicado: number
}

// IPREM mensual 2026 orientativo, usado para calcular topes de la prestación.
const IPREM_MENSUAL = 600

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: ParoInput) {
  const parsed = paroInputSchema.parse(input)

  const importeBrutoPrimeros180 = parsed.baseReguladoraMensual * 0.7
  const importeBrutoDesde181 = parsed.baseReguladoraMensual * 0.5

  // Topes según hijos a cargo (orientativos, sobre el IPREM mensual).
  let topeMaximo: number
  let topeMinimo: number
  if (parsed.numHijos === 0) {
    topeMaximo = IPREM_MENSUAL * 1.75
    topeMinimo = IPREM_MENSUAL * 0.8
  } else if (parsed.numHijos === 1) {
    topeMaximo = IPREM_MENSUAL * 2.0
    topeMinimo = IPREM_MENSUAL * 1.07
  } else {
    topeMaximo = IPREM_MENSUAL * 2.25
    topeMinimo = IPREM_MENSUAL * 1.07
  }

  const importePrimeros180Dias = Math.min(Math.max(importeBrutoPrimeros180, topeMinimo), topeMaximo)
  const importeDesdeDia181 = Math.min(Math.max(importeBrutoDesde181, topeMinimo), topeMaximo)

  const breakdown: ParoBreakdown = {
    importePrimeros180Dias: round2(importePrimeros180Dias),
    importeDesdeDia181: round2(importeDesdeDia181),
    topeMaximoAplicado: round2(topeMaximo),
    topeMinimoAplicado: round2(topeMinimo),
  }

  return {
    main: {
      label: 'Prestación mensual (primeros 180 días)',
      value: breakdown.importePrimeros180Dias,
      unit: 'EUR' as const,
    },
    breakdown,
  }
}

export const paroCalculator: CalculatorDefinition<ParoInput, ParoBreakdown> = {
  meta: {
    slug: 'prestacion-paro',
    categorySlug: 'social',
    title: 'Calculadora de Prestación por Desempleo (Paro) 2026',
    seoTitle: 'Calculadora del Paro 2026: Cuánto Cobrarás de Prestación',
    metaDescription:
      'Calcula tu prestación mensual por desempleo: 70% de la base reguladora los primeros 180 días, 50% después, con los topes según hijos a cargo.',
    shortDescription: 'Estima tu prestación mensual por desempleo según tu base reguladora.',
    updatedAt: '2026-01-01',
  },
  fields: [
    {
      key: 'baseReguladoraMensual',
      label: 'Base reguladora mensual (media de cotización últimos 180 días)',
      type: 'number',
      suffix: '€',
    },
    { key: 'numHijos', label: 'Número de hijos a cargo', type: 'number' },
  ],
  defaultValues: {
    baseReguladoraMensual: 1600,
    numHijos: 0,
  },
  faqs: [
    {
      question: '¿Cómo se calcula la base reguladora?',
      answer:
        'Es la media de tus bases de cotización por contingencias comunes de los últimos 180 días trabajados antes de la situación legal de desempleo.',
    },
    {
      question: '¿Por qué baja el porcentaje a partir del día 181?',
      answer:
        'La normativa establece el 70% de la base reguladora durante los primeros 180 días de prestación, y el 50% a partir del día 181 hasta agotar el periodo que te corresponda según tus años cotizados.',
    },
    {
      question: '¿Por qué influyen los hijos en el tope de la prestación?',
      answer:
        'La ley fija topes máximos y mínimos de la prestación en función del número de hijos a cargo, calculados sobre el IPREM mensual, para que la cuantía nunca baje ni suba de ciertos límites.',
    },
    {
      question: '¿Cuánto tiempo puedo cobrar el paro?',
      answer:
        'La duración depende de los días que hayas cotizado en los últimos 6 años antes de la situación legal de desempleo. Como referencia orientativa: con 360-539 días cotizados corresponden 120 días de prestación; con 720-899 días cotizados corresponden 240 días; y con 2.160 días cotizados o más (el máximo) corresponden 720 días, es decir, dos años. Entre esos puntos, la duración aumenta de forma escalonada por cada periodo adicional de cotización.',
    },
    {
      question: '¿Qué requisitos hay que cumplir para cobrar el paro?',
      answer:
        'Los principales son: estar afiliado y en situación de alta o asimilada al alta en la Seguridad Social, encontrarte en situación legal de desempleo (despido, fin de contrato temporal, o baja voluntaria solo en casos concretos reconocidos legalmente), tener cotizado un mínimo de 360 días dentro de los 6 años anteriores, no haber cumplido la edad ordinaria de jubilación, y estar inscrito como demandante de empleo en el SEPE.',
    },
    {
      question: '¿Qué es la "situación legal de desempleo" y por qué importa?',
      answer:
        'No cualquier forma de dejar el trabajo da derecho a la prestación. Se reconoce situación legal de desempleo en casos como el despido (procedente, improcedente o por causas objetivas), el fin de un contrato temporal, un ERE o un ERTE que reduzca la jornada a cero, o una baja voluntaria justificada por causas específicas (por ejemplo, traslado del cónyuge o violencia de género). Una dimisión voluntaria normal, en cambio, no suele dar derecho al paro.',
    },
    {
      question: '¿Puedo compatibilizar el paro con un trabajo a tiempo parcial?',
      answer:
        'Sí, existe la compatibilidad parcial: si encuentras un trabajo a tiempo parcial mientras cobras la prestación, se te descuenta de forma proporcional a la jornada trabajada, en lugar de perder el derecho por completo. Es importante comunicarlo al SEPE, ya que no hacerlo puede considerarse una infracción con sanciones.',
    },
    {
      question: '¿Qué pasa con la cotización a la Seguridad Social mientras cobro el paro?',
      answer:
        'Mientras percibes la prestación contributiva por desempleo, el SEPE cotiza por ti a la Seguridad Social (contingencias comunes y, según el caso, otras contingencias), lo que significa que ese tiempo sigue generando derechos de cara a tu futura pensión de jubilación, aunque a una base de cotización distinta a la de tu último empleo.',
    },
    {
      question: '¿Qué diferencia hay entre el paro contributivo y el subsidio por desempleo?',
      answer:
        'El paro contributivo (el que calcula esta herramienta) depende de lo que hayas cotizado y de tu base reguladora. El subsidio por desempleo, en cambio, es una ayuda de cuantía fija (ligada al IPREM) para quienes no tienen derecho al contributivo o lo han agotado, y suele exigir cumplir requisitos adicionales de rentas familiares.',
    },
  ],
  content: [
    { type: 'heading', text: 'Cómo se calcula la prestación por desempleo' },
    {
      type: 'paragraph',
      text:
        'La prestación contributiva por desempleo, conocida popularmente como "el paro", se calcula sobre tu base reguladora: la media de tus bases de cotización por contingencias comunes de los últimos 180 días trabajados antes de quedar en situación legal de desempleo. Durante los primeros 180 días de prestación cobras el 70% de esa base reguladora; a partir del día 181, el porcentaje baja al 50%, y se mantiene así hasta agotar el periodo de prestación que te corresponda según tus años cotizados.',
    },
    {
      type: 'paragraph',
      text:
        'Ejemplo resuelto: con una base reguladora mensual de 1.600 € y sin hijos a cargo, durante los primeros 180 días cobrarías el 70% de 1.600 €, es decir 1.120 € brutos al mes (siempre que ese importe esté dentro de los topes legales). A partir del día 181, bajarías al 50%, unos 800 € brutos mensuales.',
    },
    { type: 'heading', text: 'Topes máximos y mínimos según hijos a cargo' },
    {
      type: 'paragraph',
      text:
        'La prestación nunca puede superar ni bajar de unos topes legales, calculados sobre el IPREM mensual (Indicador Público de Renta de Efectos Múltiples) y que aumentan según el número de hijos a cargo: sin hijos, el tope máximo es del 175% del IPREM y el mínimo del 80%; con un hijo, el máximo sube al 200% y el mínimo al 107%; con dos o más hijos, el máximo llega al 225%, manteniéndose el mínimo en el 107%. Estos topes existen para garantizar una cuantía digna mínima y evitar prestaciones desproporcionadamente altas.',
    },
    { type: 'heading', text: 'Cuánto tiempo se cobra el paro según lo cotizado' },
    {
      type: 'paragraph',
      text:
        'La duración de la prestación no depende de tu salario ni de tu base reguladora, sino exclusivamente de cuántos días has cotizado en los 6 años anteriores a la situación legal de desempleo. El sistema funciona por tramos escalonados: cuantos más días cotizados, más meses de prestación, hasta un máximo legal de 2 años (720 días) para quienes acumulan la cotización más alta reconocida.',
    },
    { type: 'heading', text: 'Requisitos para tener derecho a la prestación' },
    {
      type: 'paragraph',
      text:
        'No basta con estar sin trabajo: hay que estar en situación legal de desempleo (despido, fin de contrato temporal, ERE, ERTE a jornada cero, o algunas bajas voluntarias justificadas legalmente), tener un mínimo de 360 días cotizados en los últimos 6 años, estar inscrito como demandante de empleo en el SEPE, y no haber alcanzado la edad ordinaria de jubilación. Una dimisión voluntaria sin causa justificada legalmente reconocida no suele dar derecho a esta prestación.',
    },
    { type: 'heading', text: 'Qué pasa si encuentras trabajo mientras cobras el paro' },
    {
      type: 'paragraph',
      text:
        'Si el nuevo trabajo es a tiempo completo, la prestación se extingue, aunque puedes tener derecho a recuperar el resto del periodo no consumido en un futuro (dentro de ciertos plazos legales) si vuelves a quedar en desempleo. Si el nuevo trabajo es a tiempo parcial, puedes compatibilizarlo con una parte de la prestación, reducida de forma proporcional a la jornada trabajada; es obligatorio comunicarlo al SEPE para evitar sanciones por incompatibilidad no declarada.',
    },
  ],
  calculate,
}
