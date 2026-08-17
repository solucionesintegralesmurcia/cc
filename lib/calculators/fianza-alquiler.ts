import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const fianzaAlquilerInputSchema = z.object({
  rentaMensual: z.number().min(0).max(1_000_000),
  usoVivienda: z.boolean(),
})

export type FianzaAlquilerInput = z.infer<typeof fianzaAlquilerInputSchema>

interface FianzaAlquilerBreakdown extends Record<string, number> {
  fianzaLegalObligatoria: number
  garantiaAdicionalMaxima: number
  totalMaximoExigible: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: FianzaAlquilerInput) {
  const parsed = fianzaAlquilerInputSchema.parse(input)

  // LAU: fianza legal obligatoria = 1 mes (vivienda habitual) o 2 meses
  // (uso distinto de vivienda, ej. local u oficina).
  const mesesFianza = parsed.usoVivienda ? 1 : 2
  const fianzaLegalObligatoria = parsed.rentaMensual * mesesFianza

  // Además de la fianza legal, se pueden pactar garantías adicionales
  // (aval, depósito) hasta un máximo de 2 mensualidades más.
  const garantiaAdicionalMaxima = parsed.rentaMensual * 2
  const totalMaximoExigible = fianzaLegalObligatoria + garantiaAdicionalMaxima

  const breakdown: FianzaAlquilerBreakdown = {
    fianzaLegalObligatoria: round2(fianzaLegalObligatoria),
    garantiaAdicionalMaxima: round2(garantiaAdicionalMaxima),
    totalMaximoExigible: round2(totalMaximoExigible),
  }

  return {
    main: { label: 'Fianza legal obligatoria', value: breakdown.fianzaLegalObligatoria, unit: 'EUR' as const },
    breakdown,
  }
}

export const fianzaAlquilerCalculator: CalculatorDefinition<FianzaAlquilerInput, FianzaAlquilerBreakdown> = {
  meta: {
    slug: 'fianza-alquiler',
    categorySlug: 'vivienda',
    title: 'Calculadora de Fianza de Alquiler 2026',
    seoTitle: 'Calculadora de Fianza de Alquiler: Límite Legal Máximo',
    metaDescription:
      'Calcula la fianza legal obligatoria de un alquiler (1 o 2 mensualidades según el uso) y el máximo de garantías adicionales que te pueden exigir.',
    shortDescription: 'Calcula la fianza legal máxima que te pueden exigir al alquilar.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'rentaMensual', label: 'Renta mensual', type: 'number', suffix: '€' },
    {
      key: 'usoVivienda',
      label: 'Es para vivienda habitual',
      type: 'checkbox',
    },
  ],
  defaultValues: {
    rentaMensual: 900,
    usoVivienda: true,
  },
  faqs: [
    {
      question: '¿Cuál es la fianza legal obligatoria en un alquiler?',
      answer:
        'Según la Ley de Arrendamientos Urbanos (LAU), la fianza obligatoria es de una mensualidad de renta para arrendamientos de vivienda habitual, y de dos mensualidades para arrendamientos de uso distinto (locales, oficinas).',
    },
    {
      question: '¿Pueden pedirme más dinero además de la fianza legal?',
      answer:
        'Sí, es habitual pactar garantías adicionales (un aval bancario o un depósito extra), pero la ley limita estas garantías adicionales a un máximo de dos mensualidades de renta en contratos de vivienda habitual.',
    },
    {
      question: '¿Dónde se deposita la fianza?',
      answer:
        'En la mayoría de comunidades autónomas, el arrendador está obligado a depositar la fianza en el organismo autonómico correspondiente (por ejemplo, el IVIMA en Madrid o el INCASOL en Cataluña), no quedársela directamente.',
    },
  ],
  calculate,
}
