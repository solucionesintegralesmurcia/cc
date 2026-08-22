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
    {
      question: '¿A qué edad me puedo jubilar en España?',
      answer:
        'La edad ordinaria de jubilación está en proceso de subida gradual hasta los 67 años, aunque quienes acumulan un número muy elevado de años cotizados (37 años y medio o más, según el calendario vigente) pueden jubilarse a los 65 sin penalización. También existen modalidades de jubilación anticipada, tanto voluntaria como involuntaria, a partir de ciertas edades, aplicando coeficientes reductores sobre la pensión.',
    },
    {
      question: '¿Qué es la jubilación anticipada y cómo afecta al importe?',
      answer:
        'Permite jubilarse antes de la edad ordinaria, pero con coeficientes reductores que disminuyen la pensión de forma permanente por cada mes o trimestre de anticipación, salvo excepciones. La anticipación voluntaria exige normalmente un mínimo de 35 años cotizados y penaliza más que la involuntaria (por ejemplo, tras un despido), que suele tener coeficientes reductores algo más favorables.',
    },
    {
      question: '¿Qué es la jubilación demorada y qué ventajas tiene?',
      answer:
        'Consiste en retrasar la jubilación más allá de la edad ordinaria una vez alcanzados los años de cotización necesarios para el 100%. A cambio, la Seguridad Social reconoce un incentivo: un porcentaje adicional sobre la pensión por cada año de demora, o alternativamente una cantidad a tanto alzado, según lo que el trabajador elija en el momento de jubilarse.',
    },
    {
      question: '¿Los años cotizados como autónomo cuentan igual que como asalariado?',
      answer:
        'Sí, a efectos de años cotizados y de cálculo del porcentaje de la pensión, ambos regímenes computan de forma equivalente dentro del sistema general de la Seguridad Social. Lo que sí puede variar es la base reguladora final, ya que muchos autónomos cotizan por bases más bajas que su rendimiento real, lo que reduce la pensión resultante frente a un asalariado con el mismo nivel de ingresos.',
    },
    {
      question: '¿Existe una pensión mínima aunque no llegue al 100% de la base reguladora?',
      answer:
        'Sí, la Seguridad Social garantiza unas cuantías mínimas de pensión (distintas según tengas o no cónyuge a cargo y tu edad), revisadas cada año. Si el cálculo por base reguladora y años cotizados da un resultado por debajo de ese mínimo, se complementa hasta alcanzarlo, siempre que se cumplan los requisitos de ingresos del beneficiario.',
    },
    {
      question: '¿Puedo compatibilizar la pensión de jubilación con seguir trabajando?',
      answer:
        'Existe la llamada "jubilación activa", que permite compatibilizar el cobro de un porcentaje de la pensión (generalmente el 50%, o el 100% en determinados casos) con un trabajo por cuenta propia o ajena, siempre que se haya alcanzado la edad ordinaria de jubilación y el 100% de la base reguladora.',
    },
  ],
  content: [
    { type: 'heading', text: 'Cómo se calcula la pensión de jubilación' },
    {
      type: 'paragraph',
      text:
        'La pensión de jubilación se calcula aplicando un porcentaje sobre tu base reguladora, un promedio de tus bases de cotización de un periodo previo a la jubilación (actualmente en transición hacia los últimos 29 años, tomando los 27 meses más favorables). Ese porcentaje depende exclusivamente de tus años cotizados: con 15 años cotizados se alcanza el 50% de la base reguladora, y ese porcentaje va subiendo de forma progresiva (más rápido entre los 15 y los 25 años, algo más lento después) hasta alcanzar el 100% con aproximadamente 36-37 años cotizados.',
    },
    {
      type: 'paragraph',
      text:
        'Ejemplo resuelto: con una base reguladora mensual de 2.000 € y 30 años cotizados, el porcentaje aplicado ronda el 90-92% (según la escala vigente), lo que da una pensión mensual estimada de entre 1.800 y 1.840 € aproximadamente, cobrada normalmente en 14 pagas al año, como el salario en activo.',
    },
    { type: 'heading', text: 'Edad de jubilación: ordinaria, anticipada y demorada' },
    {
      type: 'paragraph',
      text:
        'La edad ordinaria de jubilación está en proceso de subida gradual hasta los 67 años, aunque con una carrera de cotización muy larga (37 años y medio o más) puedes jubilarte a los 65 sin penalización. Si te jubilas antes de la edad ordinaria (jubilación anticipada), se aplican coeficientes reductores permanentes sobre la pensión, distintos según sea voluntaria o involuntaria. Si te jubilas después, una vez alcanzado el 100% de la base reguladora, la Seguridad Social reconoce un incentivo adicional por cada año de demora (jubilación demorada).',
    },
    { type: 'heading', text: 'Por qué la base reguladora importa tanto como los años cotizados' },
    {
      type: 'paragraph',
      text:
        'Dos personas con los mismos años cotizados pueden recibir pensiones muy distintas si sus bases de cotización han sido diferentes. Por eso cotizar por una base más alta durante los años activos (algo especialmente relevante para autónomos, que a menudo cotizan por bases mínimas) tiene un impacto directo y duradero en la pensión final, incluso más que sumar algún año adicional de cotización una vez superados los años necesarios para el 100%.',
    },
    { type: 'heading', text: 'Pensión mínima y complementos' },
    {
      type: 'paragraph',
      text:
        'Si el resultado del cálculo por base reguladora y años cotizados queda por debajo de la pensión mínima que fija cada año la Seguridad Social (distinta según tengas o no cónyuge a cargo), se complementa hasta alcanzar ese mínimo, siempre que se cumplan los requisitos de ingresos del beneficiario. Esto garantiza una cuantía base incluso para carreras de cotización cortas o con salarios bajos.',
    },
    { type: 'heading', text: 'Compatibilizar pensión y trabajo: la jubilación activa' },
    {
      type: 'paragraph',
      text:
        'Quien alcanza la edad ordinaria de jubilación y el 100% de la base reguladora puede optar por la jubilación activa: seguir trabajando (por cuenta propia o ajena) mientras cobra un porcentaje de su pensión, generalmente el 50%, aunque en algunos supuestos (como contratar a un trabajador adicional siendo autónomo) se puede llegar al 100% de compatibilidad.',
    },
  ],
  calculate,
}
