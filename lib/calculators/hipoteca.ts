import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const hipotecaInputSchema = z.object({
  importePrestamo: z.number().min(1).max(50_000_000),
  tipoInteresAnual: z.number().min(0).max(30),
  plazoAnios: z.number().min(1).max(50),
})

export type HipotecaInput = z.infer<typeof hipotecaInputSchema>

interface HipotecaBreakdown extends Record<string, number> {
  cuotaMensual: number
  totalPagado: number
  totalIntereses: number
  numeroCuotas: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

// Sistema de amortización francés: cuota constante, la parte de interés
// baja y la de capital sube a lo largo del préstamo.
function calculate(input: HipotecaInput) {
  const parsed = hipotecaInputSchema.parse(input)
  const n = parsed.plazoAnios * 12
  const r = parsed.tipoInteresAnual / 100 / 12

  const cuotaMensual =
    r === 0
      ? parsed.importePrestamo / n
      : (parsed.importePrestamo * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)

  const totalPagado = cuotaMensual * n
  const totalIntereses = totalPagado - parsed.importePrestamo

  const breakdown: HipotecaBreakdown = {
    cuotaMensual: round2(cuotaMensual),
    totalPagado: round2(totalPagado),
    totalIntereses: round2(totalIntereses),
    numeroCuotas: n,
  }

  return {
    main: { label: 'Cuota mensual', value: breakdown.cuotaMensual, unit: 'EUR' as const },
    breakdown,
  }
}

export const hipotecaCalculator: CalculatorDefinition<HipotecaInput, HipotecaBreakdown> = {
  meta: {
    slug: 'hipoteca',
    categorySlug: 'hipotecas',
    title: 'Calculadora de Hipoteca 2026',
    seoTitle: 'Calculadora de Hipoteca 2026: Cuota Mensual y Total de Intereses',
    metaDescription:
      'Calcula la cuota mensual de tu hipoteca, el total de intereses y el importe total a devolver según el capital, el tipo de interés y el plazo.',
    shortDescription: 'Calcula la cuota mensual y el total de intereses de tu hipoteca.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'importePrestamo', label: 'Importe del préstamo', type: 'number', suffix: '€' },
    {
      key: 'tipoInteresAnual',
      label: 'Tipo de interés (TIN) anual',
      type: 'number',
      suffix: '%',
      step: 0.01,
    },
    { key: 'plazoAnios', label: 'Plazo', type: 'number', suffix: 'años' },
  ],
  defaultValues: {
    importePrestamo: 150000,
    tipoInteresAnual: 3.2,
    plazoAnios: 25,
  },
  faqs: [
    {
      question: '¿Cómo se calcula la cuota mensual de una hipoteca?',
      answer:
        'Con el sistema de amortización francés, el estándar en España: la cuota es constante durante todo el préstamo, pero al principio se paga más interés y menos capital, y esa proporción se invierte con el tiempo. La fórmula depende del capital pendiente, el tipo de interés mensual y el número total de cuotas.',
    },
    {
      question: '¿Qué diferencia hay entre TIN y TAE?',
      answer:
        'El TIN (Tipo de Interés Nominal) es el interés puro del préstamo, el que se usa para calcular la cuota. La TAE (Tasa Anual Equivalente) incluye además comisiones y gastos asociados a lo largo de la vida del préstamo, por lo que casi siempre es algo más alta que el TIN y es la cifra que deberías comparar entre bancos.',
    },
    {
      question: '¿Esta calculadora sirve para hipotecas a tipo variable?',
      answer:
        'Sirve para estimar la cuota en un momento dado, con el TIN vigente en ese momento. En una hipoteca variable, el tipo de interés (y por tanto la cuota) cambia en cada revisión periódica según el índice de referencia, normalmente el Euríbor más un diferencial. Tendrás que repetir el cálculo con el nuevo tipo en cada revisión.',
    },
    {
      question: '¿Qué diferencia hay entre hipoteca fija, variable y mixta?',
      answer:
        'La fija mantiene el mismo TIN durante toda la hipoteca, sin sorpresas pero normalmente con un tipo de partida algo más alto. La variable se revisa periódicamente ligada al Euríbor, con cuotas que pueden subir o bajar. La mixta combina un primer tramo a tipo fijo (varios años) y el resto a variable.',
    },
    {
      question: '¿Cuánto puedo pedir de hipoteca según mi salario?',
      answer:
        'La norma habitual de la banca española es que la cuota mensual no supere el 30-35% de tus ingresos netos mensuales. Además, la mayoría de entidades financian como máximo el 80% del valor de tasación de la vivienda, así que necesitarás ahorros propios para cubrir el resto más los gastos de compraventa.',
    },
    {
      question: '¿Compensa amortizar hipoteca de forma anticipada?',
      answer:
        'Depende del tipo de interés de tu hipoteca frente a lo que podrías rentabilizar ese dinero en otro sitio. Con tipos altos, amortizar anticipadamente suele compensar porque "ahorras" ese interés garantizado; con tipos muy bajos, a veces compensa más invertir el dinero. Revisa también si tu banco cobra comisión por amortización anticipada.',
    },
  ],
  content: [
    { type: 'heading', text: '¿Cómo se calcula la cuota de una hipoteca?' },
    {
      type: 'paragraph',
      text:
        'En España, la inmensa mayoría de hipotecas usan el sistema de amortización francés: la cuota mensual es siempre la misma durante toda la vida del préstamo, pero la proporción entre capital e intereses cambia mes a mes. Al principio pagas sobre todo intereses (porque debes casi todo el capital); al final pagas sobre todo capital (porque ya queda poca deuda pendiente).',
    },
    {
      type: 'paragraph',
      text:
        'La fórmula es: Cuota = C × [ i × (1+i)^n ] / [ (1+i)^n − 1 ], donde C es el capital pendiente, i es el tipo de interés mensual (el TIN anual dividido entre 12) y n es el número total de cuotas (años × 12).',
    },
    {
      type: 'paragraph',
      text:
        'Ejemplo resuelto: una hipoteca de 150.000 € a 25 años con un TIN del 3,2% da una cuota mensual de aproximadamente 727 €. A lo largo de los 300 meses pagarás un total de unos 218.000 €, de los cuales cerca de 68.000 € son intereses: pagas un 45% más de lo que pediste prestado, solo por el coste del dinero.',
    },
    { type: 'heading', text: 'Fija, variable o mixta: qué cambia en el cálculo' },
    {
      type: 'paragraph',
      text:
        'Fija: el TIN no cambia nunca, así que la cuota calculada aquí es exacta durante toda la hipoteca (salvo amortizaciones anticipadas). Variable: el TIN se revisa periódicamente (normalmente cada 6 o 12 meses) sumando un diferencial al Euríbor, así que esta calculadora te da la cuota en el momento actual, y tendrás que recalcularla en cada revisión. Mixta: combina un periodo inicial a tipo fijo (normalmente 3-10 años) y el resto a variable; calcula cada tramo por separado con esta misma herramienta.',
    },
    { type: 'heading', text: 'Qué no incluye este cálculo' },
    {
      type: 'paragraph',
      text:
        'Esta calculadora da la cuota de capital más intereses. No incluye los seguros que suele exigir el banco (hogar, vida) ni comisiones de apertura. Para el coste total de comprar la vivienda (impuestos, notaría, registro), usa la calculadora de gastos de compraventa.',
    },
  ],
  breakdownUnits: { numeroCuotas: 'NUMERO' },
  calculate,
}
