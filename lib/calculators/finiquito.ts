import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const finiquitoInputSchema = z.object({
  salarioBrutoAnual: z.number().min(0).max(2_000_000),
  diasTrabajadosMesActual: z.number().int().min(0).max(31),
  diasVacacionesPendientes: z.number().min(0).max(30),
  pagasExtraPendientesProporcion: z.number().min(0).max(100),
})

export type FiniquitoInput = z.infer<typeof finiquitoInputSchema>

interface FiniquitoBreakdown extends Record<string, number> {
  salarioDiario: number
  importeDiasTrabajados: number
  importeVacacionesPendientes: number
  importePagasExtraProporcional: number
  totalFiniquito: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: FiniquitoInput) {
  const parsed = finiquitoInputSchema.parse(input)
  const salarioDiario = parsed.salarioBrutoAnual / 365

  const importeDiasTrabajados = salarioDiario * parsed.diasTrabajadosMesActual
  const importeVacacionesPendientes = salarioDiario * parsed.diasVacacionesPendientes
  const pagaExtraAnual = (parsed.salarioBrutoAnual / 14) * 2
  const importePagasExtraProporcional =
    pagaExtraAnual * (parsed.pagasExtraPendientesProporcion / 100)

  const totalFiniquito =
    importeDiasTrabajados + importeVacacionesPendientes + importePagasExtraProporcional

  const breakdown: FiniquitoBreakdown = {
    salarioDiario: round2(salarioDiario),
    importeDiasTrabajados: round2(importeDiasTrabajados),
    importeVacacionesPendientes: round2(importeVacacionesPendientes),
    importePagasExtraProporcional: round2(importePagasExtraProporcional),
    totalFiniquito: round2(totalFiniquito),
  }

  return {
    main: { label: 'Total finiquito estimado', value: breakdown.totalFiniquito, unit: 'EUR' as const },
    breakdown,
  }
}

export const finiquitoCalculator: CalculatorDefinition<FiniquitoInput, FiniquitoBreakdown> = {
  meta: {
    slug: 'finiquito',
    categorySlug: 'laboral',
    title: 'Calculadora de Finiquito 2026',
    seoTitle: 'Calculadora de Finiquito 2026: Cuánto Me Corresponde al Dejar el Trabajo',
    metaDescription:
      'Calcula tu finiquito al terminar la relación laboral: días trabajados del último mes, vacaciones no disfrutadas y parte proporcional de pagas extra.',
    shortDescription: 'Estima el finiquito por días trabajados, vacaciones y pagas extra pendientes.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'salarioBrutoAnual', label: 'Salario bruto anual', type: 'number', suffix: '€' },
    {
      key: 'diasTrabajadosMesActual',
      label: 'Días trabajados en el último mes',
      type: 'number',
      suffix: 'días',
    },
    {
      key: 'diasVacacionesPendientes',
      label: 'Días de vacaciones no disfrutadas',
      type: 'number',
      suffix: 'días',
    },
    {
      key: 'pagasExtraPendientesProporcion',
      label: '% de paga extra devengada y no cobrada',
      type: 'number',
      suffix: '%',
    },
  ],
  defaultValues: {
    salarioBrutoAnual: 24000,
    diasTrabajadosMesActual: 15,
    diasVacacionesPendientes: 5,
    pagasExtraPendientesProporcion: 50,
  },
  faqs: [
    {
      question: '¿Qué conceptos incluye el finiquito?',
      answer:
        'Normalmente incluye el salario de los días trabajados y no cobrados, las vacaciones generadas y no disfrutadas, y la parte proporcional de las pagas extra pendientes de devengo.',
    },
    {
      question: '¿El finiquito tributa igual que el salario normal?',
      answer:
        'Sí, el finiquito tributa como rendimiento del trabajo en el IRPF, salvo la parte que corresponda a indemnización por despido dentro de los límites exentos.',
    },
    {
      question: '¿Puedo reclamar si no estoy de acuerdo con el finiquito?',
      answer:
        'Sí. Puedes firmar el finiquito "no conforme" o no firmarlo y reclamar la diferencia ante el Servicio de Mediación (SMAC) o la jurisdicción social en un plazo de un año.',
    },
    {
      question: '¿Es lo mismo finiquito que indemnización por despido?',
      answer:
        'No. El finiquito es la liquidación de conceptos ya devengados y pendientes de cobro (días trabajados, vacaciones, pagas extra proporcionales), y corresponde siempre, sea cual sea el motivo de la baja. La indemnización por despido es un concepto aparte, que solo corresponde en determinados tipos de extinción del contrato (despido objetivo, improcedente, fin de ciertos contratos temporales), no en una dimisión voluntaria.',
    },
    {
      question: '¿Cuándo tiene que pagarme la empresa el finiquito?',
      answer:
        'La ley no fija un plazo único obligatorio, pero lo habitual y exigible es que se abone en el momento de la extinción del contrato, junto con la entrega del documento de finiquito y el certificado de empresa. Si la empresa se retrasa de forma injustificada, puedes reclamar tanto el importe como, en algunos casos, intereses por demora.',
    },
    {
      question: '¿Cómo se calculan los días de vacaciones no disfrutadas?',
      answer:
        'Se calcula la parte proporcional de vacaciones generadas hasta la fecha de la baja (normalmente 30 días naturales al año, o los que fije tu convenio) y se resta lo que ya hayas disfrutado. Si has cogido más vacaciones de las que te correspondían hasta ese momento, la empresa puede llegar a descontarte el exceso del finiquito.',
    },
    {
      question: '¿Qué pasa con las pagas extra si me voy a mitad de año?',
      answer:
        'Las pagas extra se generan de forma proporcional al tiempo trabajado desde el último devengo (normalmente semestral: de enero a junio y de julio a diciembre). Si te vas antes de que se abone la paga extra correspondiente a ese periodo, el finiquito debe incluir la parte proporcional ya generada y no cobrada hasta la fecha de baja.',
    },
    {
      question: '¿Debo firmar el finiquito el mismo día que me lo entregan?',
      answer:
        'No estás obligado a firmarlo en el momento. Tienes derecho a llevarte el documento, revisarlo con calma (o con un graduado social o abogado laboralista) y firmarlo después, o firmarlo indicando "no conforme" si detectas algún error o disconformidad en los importes, sin perder por ello el derecho a reclamar posteriormente.',
    },
    {
      question: '¿El finiquito incluye horas extra o comisiones pendientes de cobro?',
      answer:
        'Debería incluir cualquier concepto salarial devengado y no cobrado hasta la fecha de baja, no solo los tres conceptos básicos (días trabajados, vacaciones, pagas extra): esto incluye horas extra pendientes de pago, comisiones ya generadas, pluses o cualquier otro complemento salarial reconocido en tu contrato o convenio que aún no se te haya abonado.',
    },
  ],
  content: [
    { type: 'heading', text: 'Qué conceptos incluye el finiquito' },
    {
      type: 'paragraph',
      text:
        'El finiquito es el documento y el pago que liquida todos los conceptos salariales pendientes en el momento en que termina la relación laboral, con independencia de la causa (fin de contrato, despido, dimisión, jubilación). Los tres bloques principales son: el salario de los días trabajados en el último periodo y aún no cobrados, la parte proporcional de vacaciones generadas y no disfrutadas, y la parte proporcional de las pagas extra devengadas desde el último pago semestral pero todavía no abonadas. A esto pueden sumarse otros conceptos pendientes como horas extra o comisiones no liquidadas.',
    },
    {
      type: 'paragraph',
      text:
        'Ejemplo resuelto: con un salario bruto anual de 24.000 €, 15 días trabajados en el último mes, 5 días de vacaciones no disfrutadas y un 50% de la paga extra semestral pendiente, el salario diario es de unos 65,75 €. Los 15 días trabajados suman unos 986 €, los 5 días de vacaciones unos 329 €, y el 50% de la paga extra proporcional (sobre 1.714 € de paga extra semestral) unos 857 €. El finiquito total estimado ronda los 2.172 €.',
    },
    { type: 'heading', text: 'Finiquito vs indemnización: dos conceptos que no deben confundirse' },
    {
      type: 'paragraph',
      text:
        'El finiquito corresponde siempre, independientemente del motivo de la baja, porque liquida dinero que ya has generado con tu trabajo. La indemnización por despido, en cambio, es un concepto distinto y adicional que solo se aplica en determinados tipos de extinción reconocidos legalmente (despido objetivo, despido improcedente, o el fin de ciertos contratos temporales), calculada según los días por año trabajado que correspondan a cada modalidad de despido. Si te vas de forma voluntaria (dimisión), no tienes derecho a indemnización, pero sí siempre al finiquito.',
    },
    { type: 'heading', text: 'Cómo revisar tu finiquito antes de firmarlo' },
    {
      type: 'paragraph',
      text:
        'Antes de firmar, comprueba que el documento incluya todos los conceptos pendientes: no solo días trabajados, vacaciones y pagas extra, sino también horas extra, comisiones o cualquier otro complemento salarial reconocido en tu contrato o convenio que aún no se te haya pagado. No estás obligado a firmar en el momento: puedes llevarte el documento para revisarlo con calma, y si detectas algún error puedes firmarlo indicando "no conforme", conservando así tu derecho a reclamar la diferencia posteriormente.',
    },
    { type: 'heading', text: 'Qué hacer si no estás de acuerdo con el importe' },
    {
      type: 'paragraph',
      text:
        'Si consideras que el finiquito no refleja correctamente lo que te corresponde, puedes reclamar. El primer paso habitual es acudir al Servicio de Mediación, Arbitraje y Conciliación (SMAC) de tu comunidad, un trámite previo obligatorio antes de acudir a los tribunales en la mayoría de reclamaciones laborales. Si no se llega a un acuerdo, puedes reclamar ante la jurisdicción social. El plazo general para reclamar cantidades derivadas de la relación laboral es de un año desde que el derecho pudo ejercitarse.',
    },
  ],
  calculate,
}
