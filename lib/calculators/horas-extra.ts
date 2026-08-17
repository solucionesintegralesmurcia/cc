import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const horasExtraInputSchema = z.object({
  salarioBrutoAnual: z.number().min(0).max(2_000_000),
  jornadaAnualHoras: z.number().min(500).max(3000),
  numHorasExtra: z.number().min(0).max(500),
  recargoPorcentaje: z.number().min(0).max(200),
})

export type HorasExtraInput = z.infer<typeof horasExtraInputSchema>

interface HorasExtraBreakdown extends Record<string, number> {
  valorHoraOrdinaria: number
  valorHoraExtra: number
  totalHorasExtra: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: HorasExtraInput) {
  const parsed = horasExtraInputSchema.parse(input)

  const valorHoraOrdinaria = parsed.salarioBrutoAnual / parsed.jornadaAnualHoras
  const valorHoraExtra = valorHoraOrdinaria * (1 + parsed.recargoPorcentaje / 100)
  const totalHorasExtra = valorHoraExtra * parsed.numHorasExtra

  const breakdown: HorasExtraBreakdown = {
    valorHoraOrdinaria: round2(valorHoraOrdinaria),
    valorHoraExtra: round2(valorHoraExtra),
    totalHorasExtra: round2(totalHorasExtra),
  }

  return {
    main: { label: 'Total a cobrar por horas extra', value: breakdown.totalHorasExtra, unit: 'EUR' as const },
    breakdown,
  }
}

export const horasExtraCalculator: CalculatorDefinition<HorasExtraInput, HorasExtraBreakdown> = {
  meta: {
    slug: 'horas-extra',
    categorySlug: 'laboral',
    title: 'Calculadora de Horas Extra 2026',
    seoTitle: 'Calculadora de Horas Extra 2026: Cuánto Cobras por Hora Extra',
    metaDescription:
      'Calcula el valor de tu hora extra a partir de tu salario bruto anual, tu jornada anual y el recargo aplicable según tu convenio.',
    shortDescription: 'Calcula cuánto cobras por tus horas extra según tu convenio.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'salarioBrutoAnual', label: 'Salario bruto anual', type: 'number', suffix: '€' },
    { key: 'jornadaAnualHoras', label: 'Jornada anual', type: 'number', suffix: 'horas/año' },
    { key: 'numHorasExtra', label: 'Número de horas extra', type: 'number', suffix: 'horas' },
    {
      key: 'recargoPorcentaje',
      label: 'Recargo sobre la hora ordinaria',
      type: 'number',
      suffix: '%',
    },
  ],
  defaultValues: {
    salarioBrutoAnual: 24000,
    jornadaAnualHoras: 1800,
    numHorasExtra: 10,
    recargoPorcentaje: 75,
  },
  faqs: [
    {
      question: '¿Cuál es el recargo mínimo legal de las horas extra?',
      answer:
        'La ley no fija un porcentaje mínimo exacto, pero exige que cada hora extra se pague, como mínimo, al mismo valor que la hora ordinaria; el recargo real (habitualmente entre el 50% y el 100%) lo fija el convenio colectivo aplicable.',
    },
    {
      question: '¿Cómo se calcula el valor de la hora ordinaria?',
      answer:
        'Dividiendo tu salario bruto anual entre las horas que realmente trabajas al año según tu jornada (jornada completa habitual: 1.800 horas/año aproximadamente, aunque varía por convenio).',
    },
    {
      question: '¿Hay un límite de horas extra al año?',
      answer:
        'Sí, el Estatuto de los Trabajadores fija un máximo de 80 horas extra al año, salvo las realizadas para prevenir o reparar siniestros, que no computan en ese límite.',
    },
  ],
  calculate,
}
