import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const costeEmpresaInputSchema = z.object({
  salarioBrutoAnual: z.number().min(0).max(2_000_000),
  tipoContrato: z.enum(['indefinido', 'temporal']),
})

export type CosteEmpresaInput = z.infer<typeof costeEmpresaInputSchema>

interface CosteEmpresaBreakdown extends Record<string, number> {
  contingenciasComunesEmpresa: number
  desempleoEmpresa: number
  fogasa: number
  formacionProfesionalEmpresa: number
  accidentesTrabajo: number
  totalSegSocialEmpresa: number
  costeTotalAnual: number
  costeTotalMensual: number
}

// Tipos de cotización a cargo de la EMPRESA (Régimen General, orientativos 2026).
// A diferencia de la cotización del trabajador, aquí el tipo de desempleo sí
// varía notablemente según el tipo de contrato.
const TIPOS_SS_EMPRESA = {
  contingenciasComunes: 0.236,
  desempleoIndefinido: 0.055,
  desempleoTemporal: 0.067,
  fogasa: 0.002,
  formacionProfesional: 0.006,
  accidentesTrabajo: 0.015, // varía según actividad (CNAE); valor medio orientativo
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: CosteEmpresaInput) {
  const parsed = costeEmpresaInputSchema.parse(input)

  const contingenciasComunesEmpresa = parsed.salarioBrutoAnual * TIPOS_SS_EMPRESA.contingenciasComunes
  const desempleoEmpresa =
    parsed.salarioBrutoAnual *
    (parsed.tipoContrato === 'indefinido'
      ? TIPOS_SS_EMPRESA.desempleoIndefinido
      : TIPOS_SS_EMPRESA.desempleoTemporal)
  const fogasa = parsed.salarioBrutoAnual * TIPOS_SS_EMPRESA.fogasa
  const formacionProfesionalEmpresa = parsed.salarioBrutoAnual * TIPOS_SS_EMPRESA.formacionProfesional
  const accidentesTrabajo = parsed.salarioBrutoAnual * TIPOS_SS_EMPRESA.accidentesTrabajo

  const totalSegSocialEmpresa =
    contingenciasComunesEmpresa + desempleoEmpresa + fogasa + formacionProfesionalEmpresa + accidentesTrabajo

  const costeTotalAnual = parsed.salarioBrutoAnual + totalSegSocialEmpresa
  const costeTotalMensual = costeTotalAnual / 12

  const breakdown: CosteEmpresaBreakdown = {
    contingenciasComunesEmpresa: round2(contingenciasComunesEmpresa),
    desempleoEmpresa: round2(desempleoEmpresa),
    fogasa: round2(fogasa),
    formacionProfesionalEmpresa: round2(formacionProfesionalEmpresa),
    accidentesTrabajo: round2(accidentesTrabajo),
    totalSegSocialEmpresa: round2(totalSegSocialEmpresa),
    costeTotalAnual: round2(costeTotalAnual),
    costeTotalMensual: round2(costeTotalMensual),
  }

  return {
    main: { label: 'Coste total anual para la empresa', value: breakdown.costeTotalAnual, unit: 'EUR' as const },
    breakdown,
  }
}

export const costeEmpresaCalculator: CalculatorDefinition<CosteEmpresaInput, CosteEmpresaBreakdown> = {
  meta: {
    slug: 'coste-empresa',
    categorySlug: 'empresas',
    title: 'Calculadora de Coste de Empleado para la Empresa 2026',
    seoTitle: 'Calculadora Coste Empresa 2026: Cuánto Cuesta Realmente un Empleado',
    metaDescription:
      'Calcula el coste total que supone un empleado para la empresa, incluyendo todas las cotizaciones a la Seguridad Social a cargo del empresario.',
    shortDescription: 'Descubre cuánto le cuesta realmente a la empresa cada empleado, más allá del bruto.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'salarioBrutoAnual', label: 'Salario bruto anual del empleado', type: 'number', suffix: '€' },
    {
      key: 'tipoContrato',
      label: 'Tipo de contrato',
      type: 'select',
      options: [
        { value: 'indefinido', label: 'Indefinido' },
        { value: 'temporal', label: 'Temporal' },
      ],
    },
  ],
  defaultValues: {
    salarioBrutoAnual: 24000,
    tipoContrato: 'indefinido',
  },
  faqs: [
    {
      question: '¿Por qué el coste para la empresa es mayor que el salario bruto?',
      answer:
        'Porque además del salario bruto pactado, la empresa debe cotizar a la Seguridad Social por ese trabajador: contingencias comunes, desempleo, FOGASA, formación profesional y accidentes de trabajo. En conjunto, suele suponer entre un 30% y un 33% adicional sobre el bruto.',
    },
    {
      question: '¿Por qué influye el tipo de contrato en el coste?',
      answer:
        'El tipo de cotización por desempleo a cargo de la empresa es más alto para contratos temporales que para indefinidos, como incentivo legal a la contratación estable.',
    },
    {
      question: '¿La cotización por accidentes de trabajo es siempre la misma?',
      answer:
        'No, varía según la actividad económica de la empresa (código CNAE) y el nivel de riesgo asociado. El valor usado aquí es una media orientativa; el tipo real puede ser mayor en sectores de más riesgo, como construcción, o menor en sectores de oficina.',
    },
  ],
  calculate,
}
