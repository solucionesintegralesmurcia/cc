
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
    {
      question: '¿Qué es la vinculación bancaria y cómo afecta al TIN que me ofrecen?',
      answer:
        'Muchos bancos ofrecen un tipo de interés más bajo (una "bonificación") a cambio de contratar productos adicionales: domiciliar la nómina, contratar un seguro de hogar o de vida con la propia entidad, tarjetas con un gasto mínimo, o un plan de pensiones. Sin esa vinculación, el TIN suele ser notablemente más alto. Antes de firmar, calcula si el coste anual de esos productos vinculados compensa realmente el ahorro en intereses.',
    },
    {
      question: '¿Qué pasa si no puedo pagar las cuotas de la hipoteca?',
      answer:
        'Si prevés dificultades, contacta con el banco cuanto antes: existen mecanismos como la ampliación del plazo, una carencia temporal de capital (pagar solo intereses una temporada) o la reunificación de deudas. El impago continuado puede derivar en un proceso de ejecución hipotecaria, así que actuar pronto y negociar es siempre mejor que dejar de pagar sin avisar.',
    },
    {
      question: '¿Puedo pasar mi hipoteca de variable a fija más adelante?',
      answer:
        'Sí, existen dos vías: la novación, que consiste en modificar las condiciones con tu propio banco (suele tener un coste menor), y la subrogación, que consiste en cambiar tu hipoteca a otra entidad que ofrezca mejores condiciones. Ambas opciones tienen gastos asociados que conviene comparar con el ahorro esperado en intereses antes de decidir.',
    },
    {
      question: '¿Cuánto ahorro necesito antes de pedir una hipoteca?',
      answer:
        'Como norma orientativa, se recomienda tener ahorrado al menos un 30% del precio de la vivienda: un 20% porque los bancos rara vez financian más del 80% del valor de tasación, y un 10% adicional para cubrir los gastos de compraventa (notaría, registro, gestoría e impuestos como el ITP o el IVA según el caso).',
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
    { type: 'heading', text: 'Cómo cambia la cuota según el plazo elegido' },
    {
      type: 'paragraph',
      text:
        'Alargar el plazo reduce la cuota mensual pero aumenta el total de intereses pagados, porque tardas más en amortizar capital. Con el mismo ejemplo de 150.000 € al 3,2%: a 20 años la cuota sube a unos 850 € mensuales pero los intereses totales bajan a unos 54.000 €; a 30 años la cuota baja a unos 650 € mensuales, pero los intereses totales suben a unos 84.000 €. No existe una respuesta única: un plazo más corto ahorra dinero a largo plazo, pero un plazo más largo da más margen mensual, algo importante si tus ingresos son ajustados.',
    },
    { type: 'heading', text: 'Fija, variable o mixta: qué cambia en el cálculo' },
    {
      type: 'paragraph',
      text:
        'Fija: el TIN no cambia nunca, así que la cuota calculada aquí es exacta durante toda la hipoteca (salvo amortizaciones anticipadas). Variable: el TIN se revisa periódicamente (normalmente cada 6 o 12 meses) sumando un diferencial al Euríbor, así que esta calculadora te da la cuota en el momento actual, y tendrás que recalcularla en cada revisión. Mixta: combina un periodo inicial a tipo fijo (normalmente 3-10 años) y el resto a variable; calcula cada tramo por separado con esta misma herramienta.',
    },
    {
      type: 'paragraph',
      text:
        'El Euríbor es el tipo de interés al que los bancos europeos se prestan dinero entre sí, y es la referencia que usan la mayoría de hipotecas variables en España, sumándole un diferencial fijo pactado con tu banco (por ejemplo, "Euríbor + 0,80%"). Cuando el Euríbor sube, tu cuota sube en la siguiente revisión; cuando baja, tu cuota baja. Es el factor de mayor incertidumbre en una hipoteca variable y conviene simular escenarios al alza antes de firmar, no solo el tipo actual.',
    },
    { type: 'heading', text: 'Qué no incluye este cálculo' },
    {
      type: 'paragraph',
      text:
        'Esta calculadora da la cuota de capital más intereses. No incluye los seguros que suele exigir el banco (hogar, vida) ni comisiones de apertura. Para el coste total de comprar la vivienda (impuestos, notaría, registro), usa la calculadora de gastos de compraventa.',
    },
    { type: 'heading', text: 'Consejos prácticos antes de firmar una hipoteca' },
    {
      type: 'paragraph',
      text:
        'Compara siempre la TAE, no solo el TIN, ya que incluye comisiones y gastos que el tipo nominal no refleja. Pide oferta vinculante por escrito a varios bancos antes de decidir: la ley obliga a entregarla con al menos 10 días de antelación a la firma, tiempo que puedes aprovechar para negociar mejores condiciones citando ofertas de la competencia. Y calcula siempre tu cuota con un margen de subida del tipo de interés (por ejemplo, +2 puntos) si vas a firmar a variable, para comprobar que podrías seguir pagándola en un escenario menos favorable que el actual.',
    },
  ],
  breakdownUnits: { numeroCuotas: 'NUMERO' },
  calculate,
}
