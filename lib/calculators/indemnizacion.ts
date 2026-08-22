import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const indemnizacionInputSchema = z.object({
  salarioBrutoAnual: z.number().min(0).max(2_000_000),
  aniosAntiguedad: z.number().min(0).max(50),
  tipoDespido: z.enum(['improcedente', 'objetivo']),
})

export type IndemnizacionInput = z.infer<typeof indemnizacionInputSchema>

interface IndemnizacionBreakdown extends Record<string, number> {
  salarioDiario: number
  diasPorAnioTrabajado: number
  diasIndemnizacionSinTope: number
  topeMesesSalario: number
  diasIndemnizacionAplicados: number
  totalIndemnizacion: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: IndemnizacionInput) {
  const parsed = indemnizacionInputSchema.parse(input)
  const salarioDiario = parsed.salarioBrutoAnual / 365

  const diasPorAnioTrabajado = parsed.tipoDespido === 'improcedente' ? 33 : 20
  const topeMesesSalario = parsed.tipoDespido === 'improcedente' ? 24 : 12

  const diasIndemnizacionSinTope = diasPorAnioTrabajado * parsed.aniosAntiguedad
  const diasTope = topeMesesSalario * 30
  const diasIndemnizacionAplicados = Math.min(diasIndemnizacionSinTope, diasTope)

  const totalIndemnizacion = salarioDiario * diasIndemnizacionAplicados

  const breakdown: IndemnizacionBreakdown = {
    salarioDiario: round2(salarioDiario),
    diasPorAnioTrabajado,
    diasIndemnizacionSinTope: round2(diasIndemnizacionSinTope),
    topeMesesSalario,
    diasIndemnizacionAplicados: round2(diasIndemnizacionAplicados),
    totalIndemnizacion: round2(totalIndemnizacion),
  }

  return {
    main: { label: 'Indemnización estimada', value: breakdown.totalIndemnizacion, unit: 'EUR' as const },
    breakdown,
  }
}

export const indemnizacionCalculator: CalculatorDefinition<
  IndemnizacionInput,
  IndemnizacionBreakdown
> = {
  meta: {
    slug: 'indemnizacion',
    categorySlug: 'laboral',
    title: 'Calculadora de Indemnización por Despido 2026',
    seoTitle: 'Calculadora de Indemnización por Despido 2026: Improcedente y Objetivo',
    metaDescription:
      'Calcula tu indemnización por despido improcedente (33 días/año, tope 24 meses) u objetivo (20 días/año, tope 12 meses) según tu antigüedad.',
    shortDescription: 'Estima tu indemnización según antigüedad y tipo de despido.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'salarioBrutoAnual', label: 'Salario bruto anual', type: 'number', suffix: '€' },
    { key: 'aniosAntiguedad', label: 'Años de antigüedad', type: 'number', suffix: 'años', step: 0.1 },
    {
      key: 'tipoDespido',
      label: 'Tipo de despido',
      type: 'select',
      options: [
        { value: 'improcedente', label: 'Improcedente (33 días/año, tope 24 meses)' },
        { value: 'objetivo', label: 'Objetivo/procedente (20 días/año, tope 12 meses)' },
      ],
    },
  ],
  defaultValues: {
    salarioBrutoAnual: 24000,
    aniosAntiguedad: 5,
    tipoDespido: 'improcedente',
  },
  faqs: [
    {
      question: '¿Cuál es la diferencia entre despido improcedente y objetivo?',
      answer:
        'El despido objetivo se basa en causas económicas, técnicas, organizativas o de producción justificadas, con 20 días de salario por año trabajado y tope de 12 mensualidades. El improcedente es aquel que no cumple los requisitos legales o de forma (o que un juez declara injustificado), con 33 días de salario por año y tope de 24 mensualidades, para contratos posteriores a 2012.',
    },
    {
      question: '¿Cómo se calculan los años de antigüedad si no son exactos?',
      answer:
        'Los periodos de tiempo inferiores a un año se prorratean por meses trabajados. Puedes introducir un valor decimal (por ejemplo, 3,5 años) para reflejarlo en la estimación.',
    },
    {
      question: '¿Esta indemnización tributa en el IRPF?',
      answer:
        'La indemnización legal está exenta de IRPF hasta los límites que marca la ley, con un máximo de 180.000 €. Si la empresa paga una cantidad superior a la legal (mejora voluntaria), el exceso sobre esos límites sí tributa como rendimiento del trabajo.',
    },
    {
      question: '¿Qué pasa si mi contrato es anterior a 2012?',
      answer:
        'Si tu contrato se firmó antes del 12 de febrero de 2012, el despido improcedente se calcula en dos tramos: 45 días de salario por año trabajado hasta esa fecha, y 33 días/año por el tiempo posterior, con un tope conjunto de 42 mensualidades. Esta calculadora usa la escala simplificada de 33 días/año; si tienes antigüedad anterior a 2012, tu indemnización real puede ser más alta.',
    },
    {
      question: '¿Puedo cobrar el paro además de la indemnización?',
      answer:
        'Sí, son compatibles. La indemnización por despido no es un salario ni una prestación por desempleo, así que no reduce ni retrasa tu derecho a cobrar el paro si cumples los requisitos de cotización previa.',
    },
    {
      question: '¿Qué diferencia hay entre indemnización y finiquito?',
      answer:
        'Son conceptos distintos que se cobran juntos al terminar la relación laboral. El finiquito liquida lo que la empresa ya te debe (salarios pendientes, parte proporcional de pagas extra, vacaciones no disfrutadas). La indemnización, si aplica, es la compensación adicional por el despido en sí.',
    },
  ],
  content: [
    { type: 'heading', text: 'Cómo se calcula la indemnización por despido en España' },
    {
      type: 'paragraph',
      text:
        'El Estatuto de los Trabajadores fija dos escalas distintas según el tipo de despido. Despido objetivo o procedente: 20 días de salario por año trabajado, con un tope de 12 mensualidades. Despido improcedente (contratos posteriores al 12 de febrero de 2012): 33 días de salario por año trabajado, con un tope de 24 mensualidades.',
    },
    {
      type: 'paragraph',
      text:
        'Ejemplo resuelto: con un salario bruto anual de 24.000 € y 5 años de antigüedad, un despido improcedente da: salario diario (24.000 / 365 = 65,75 €) × 33 días × 5 años = 10.848,75 €, muy por debajo del tope de 24 meses, así que se cobra íntegro.',
    },
    { type: 'heading', text: 'El "doble cómputo" para contratos anteriores a 2012' },
    {
      type: 'paragraph',
      text:
        'Si tu contrato es anterior al 12 de febrero de 2012, el cálculo del despido improcedente se hace en dos tramos: 45 días/año por el tiempo trabajado hasta esa fecha, y 33 días/año por el tiempo trabajado después, con un tope conjunto de 42 mensualidades. Esta calculadora usa la escala simplificada (post-2012); si tu antigüedad viene de antes, el resultado real puede ser mayor.',
    },
    { type: 'heading', text: 'Fiscalidad de la indemnización' },
    {
      type: 'paragraph',
      text:
        'La indemnización está exenta de IRPF hasta el límite legal (33 días/año con tope de 24 mensualidades en el despido improcedente, con un máximo absoluto de 180.000 €). Si tu empresa te paga más de lo que marca la ley (una mejora voluntaria), ese exceso sí tributa como rendimiento del trabajo.',
    },
  ],
  breakdownUnits: {
    diasPorAnioTrabajado: 'NUMERO',
    diasIndemnizacionSinTope: 'NUMERO',
    topeMesesSalario: 'NUMERO',
    diasIndemnizacionAplicados: 'NUMERO',
  },
  calculate,
}
