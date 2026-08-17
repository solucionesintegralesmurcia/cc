import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const imcInputSchema = z.object({
  pesoKg: z.number().min(1).max(400),
  alturaCm: z.number().min(50).max(250),
})

export type ImcInput = z.infer<typeof imcInputSchema>

interface ImcBreakdown extends Record<string, number> {
  imc: number
  pesoMinimoSaludable: number
  pesoMaximoSaludable: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function categoria(imc: number): string {
  if (imc < 18.5) return 'Bajo peso'
  if (imc < 25) return 'Peso normal'
  if (imc < 30) return 'Sobrepeso'
  return 'Obesidad'
}

function calculate(input: ImcInput) {
  const parsed = imcInputSchema.parse(input)
  const alturaM = parsed.alturaCm / 100

  const imc = parsed.pesoKg / (alturaM * alturaM)
  const pesoMinimoSaludable = 18.5 * alturaM * alturaM
  const pesoMaximoSaludable = 24.9 * alturaM * alturaM

  const breakdown: ImcBreakdown = {
    imc: round2(imc),
    pesoMinimoSaludable: round2(pesoMinimoSaludable),
    pesoMaximoSaludable: round2(pesoMaximoSaludable),
  }

  return {
    main: { label: `IMC: ${categoria(imc)}`, value: breakdown.imc, unit: 'NUMERO' as const },
    breakdown,
  }
}

export const imcCalculator: CalculatorDefinition<ImcInput, ImcBreakdown> = {
  meta: {
    slug: 'imc',
    categorySlug: 'salud',
    title: 'Calculadora de IMC (Índice de Masa Corporal) 2026',
    seoTitle: 'Calculadora de IMC 2026: Índice de Masa Corporal Online',
    metaDescription:
      'Calcula tu Índice de Masa Corporal (IMC) a partir de tu peso y altura, y consulta el rango de peso saludable para tu estatura.',
    shortDescription: 'Calcula tu IMC y el rango de peso saludable para tu altura.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'pesoKg', label: 'Peso', type: 'number', suffix: 'kg', step: 0.1 },
    { key: 'alturaCm', label: 'Altura', type: 'number', suffix: 'cm' },
  ],
  defaultValues: {
    pesoKg: 70,
    alturaCm: 170,
  },
  faqs: [
    {
      question: '¿Cómo se calcula el IMC?',
      answer:
        'Se divide el peso en kilogramos entre la altura en metros al cuadrado (IMC = peso / altura²). Es un indicador orientativo de la relación entre peso y estatura, publicado y usado por la Organización Mundial de la Salud.',
    },
    {
      question: '¿El IMC es una medida exacta de salud?',
      answer:
        'No. El IMC no distingue entre masa muscular y masa grasa, por lo que puede dar valores altos en personas muy musculadas sin exceso de grasa, o no reflejar bien la composición corporal en personas mayores. Es una primera referencia, no un diagnóstico médico.',
    },
    {
      question: '¿Qué rango de IMC se considera saludable?',
      answer:
        'Según la OMS, el rango de peso normal está entre 18,5 y 24,9. Por debajo se considera bajo peso, y por encima, sobrepeso u obesidad según el valor exacto.',
    },
  ],
  breakdownUnits: { imc: 'NUMERO', pesoMinimoSaludable: 'NUMERO', pesoMaximoSaludable: 'NUMERO' },
  calculate,
}
