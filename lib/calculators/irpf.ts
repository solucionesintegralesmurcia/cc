import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const irpfInputSchema = z.object({
  rendimientoNetoAnual: z.number().min(0).max(5_000_000),
  aportacionesPlanPensiones: z.number().min(0).max(1_500_000),
  numHijos: z.number().int().min(0).max(10),
  declaracionConjunta: z.boolean(),
})

export type IrpfInput = z.infer<typeof irpfInputSchema>

interface IrpfBreakdown extends Record<string, number> {
  minimoExento: number
  baseLiquidable: number
  cuotaIntegra: number
  tipoMedioEfectivo: number
  cuotaLiquida: number
}

// Tramos aproximados de IRPF estatal + autonómico combinados (orientativos, 2025).
const TRAMOS = [
  { hasta: 12450, tipo: 0.19 },
  { hasta: 20200, tipo: 0.24 },
  { hasta: 35200, tipo: 0.3 },
  { hasta: 60000, tipo: 0.37 },
  { hasta: 300000, tipo: 0.45 },
  { hasta: Infinity, tipo: 0.47 },
]

// Cálculo PROGRESIVO real: cada tramo tributa solo por la parte de renta
// que cae dentro de él (no se aplica el tipo marginal a toda la base).
function calcularCuotaProgresiva(baseLiquidable: number): number {
  let cuota = 0
  let restante = baseLiquidable
  let limiteAnterior = 0

  for (const tramo of TRAMOS) {
    if (restante <= 0) break
    const anchoTramo = tramo.hasta - limiteAnterior
    const importeEnTramo = Math.min(restante, anchoTramo)
    cuota += importeEnTramo * tramo.tipo
    restante -= importeEnTramo
    limiteAnterior = tramo.hasta
  }

  return cuota
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: IrpfInput) {
  const parsed = irpfInputSchema.parse(input)

  const minimoPersonal = parsed.declaracionConjunta ? 5550 + 3400 : 5550
  const minimoPorHijos = parsed.numHijos * 2400
  const minimoExento = minimoPersonal + minimoPorHijos

  const baseImponible = Math.max(
    0,
    parsed.rendimientoNetoAnual - parsed.aportacionesPlanPensiones
  )
  const baseLiquidable = Math.max(0, baseImponible - minimoExento)

  const cuotaIntegra = calcularCuotaProgresiva(baseLiquidable)
  const tipoMedioEfectivo = baseImponible > 0 ? (cuotaIntegra / baseImponible) * 100 : 0

  const breakdown: IrpfBreakdown = {
    minimoExento: round2(minimoExento),
    baseLiquidable: round2(baseLiquidable),
    cuotaIntegra: round2(cuotaIntegra),
    tipoMedioEfectivo: round2(tipoMedioEfectivo),
    cuotaLiquida: round2(cuotaIntegra),
  }

  return {
    main: { label: 'IRPF a pagar (estimado)', value: breakdown.cuotaLiquida, unit: 'EUR' as const },
    breakdown,
  }
}

export const irpfCalculator: CalculatorDefinition<IrpfInput, IrpfBreakdown> = {
  meta: {
    slug: 'irpf',
    categorySlug: 'fiscal',
    title: 'Calculadora de IRPF 2026',
    seoTitle: 'Calculadora de IRPF 2026: Cuánto Pagas de Impuesto sobre la Renta',
    metaDescription:
      'Calcula tu IRPF anual aplicando los tramos progresivos reales, mínimo personal y familiar, aportaciones a plan de pensiones y declaración conjunta.',
    shortDescription: 'Estima tu cuota de IRPF anual con el cálculo progresivo real por tramos.',
    updatedAt: '2026-01-01',
  },
  fields: [
    {
      key: 'rendimientoNetoAnual',
      label: 'Rendimiento neto anual (todas las fuentes)',
      type: 'number',
      suffix: '€',
    },
    {
      key: 'aportacionesPlanPensiones',
      label: 'Aportaciones a plan de pensiones',
      type: 'number',
      suffix: '€',
    },
    { key: 'numHijos', label: 'Número de hijos a cargo', type: 'number' },
    { key: 'declaracionConjunta', label: 'Declaración conjunta', type: 'checkbox' },
  ],
  defaultValues: {
    rendimientoNetoAnual: 30000,
    aportacionesPlanPensiones: 0,
    numHijos: 0,
    declaracionConjunta: false,
  },
  faqs: [
    {
      question: '¿Por qué el cálculo es "progresivo" y no un simple porcentaje fijo?',
      answer:
        'Porque en España el IRPF funciona por tramos: cada euro que ganas tributa según el tramo en el que cae, no se aplica el tipo más alto a toda tu renta. Por eso el tipo medio efectivo siempre es menor que el tipo marginal de tu último tramo.',
    },
    {
      question: '¿Qué es el mínimo personal y familiar?',
      answer:
        'Es la parte de tus ingresos que no tributa, destinada a cubrir tus necesidades básicas. Se incrementa por cada hijo a cargo y, en la declaración conjunta, se suma un mínimo adicional.',
    },
    {
      question: '¿Las aportaciones a plan de pensiones reducen mucho el IRPF?',
      answer:
        'Sí, reducen directamente la base imponible antes de calcular el impuesto, dentro de los límites legales anuales, lo que puede bajarte incluso de tramo.',
    },
    {
      question: '¿Qué diferencia hay entre tipo marginal y tipo medio efectivo?',
      answer:
        'El tipo marginal es el porcentaje que se aplica al último tramo de tu renta, el más alto que alcanzas. El tipo medio efectivo es la cuota total dividida entre tu base imponible: como los tramos anteriores tributan a tipos más bajos, el tipo medio efectivo siempre es inferior al marginal.',
    },
    {
      question: '¿Cuándo compensa hacer la declaración conjunta?',
      answer:
        'Suele compensar cuando uno de los cónyuges tiene ingresos muy bajos o nulos, porque el mínimo adicional de la conjunta puede reducir más la base que tributar por separado. Si ambos cónyuges tienen ingresos similares y relativamente altos, casi siempre sale mejor la declaración individual.',
    },
    {
      question: '¿Este cálculo sirve para autónomos?',
      answer:
        'Sirve como estimación del IRPF sobre el rendimiento neto (ingresos menos gastos deducibles), que es la magnitud relevante tanto para asalariados como para autónomos en estimación directa. No sustituye el cálculo del modelo 100 de la Renta ni el de los pagos fraccionados trimestrales (modelo 130).',
    },
    {
      question: '¿Qué otras deducciones existen además del plan de pensiones?',
      answer:
        'Además de las aportaciones a planes de pensiones, existen deducciones autonómicas (que varían mucho de una comunidad a otra: por alquiler de vivienda habitual, por nacimiento o adopción, por donativos, por inversión en empresas de nueva creación, entre otras) y deducciones estatales como la deducción por maternidad o por familia numerosa. Esta calculadora no las incluye porque dependen de tu comunidad autónoma y circunstancias concretas; consúltalas en la web de tu Hacienda autonómica.',
    },
    {
      question: '¿Cuándo hay que presentar la declaración de la Renta?',
      answer:
        'La campaña de la Renta en España se abre normalmente en abril y se cierra a finales de junio del año siguiente al ejercicio fiscal. No todo el mundo está obligado a presentarla: existen umbrales mínimos de ingresos (distintos según tengas uno o varios pagadores) por debajo de los cuales no es obligatorio, aunque a veces compensa presentarla igualmente si te sale a devolver.',
    },
    {
      question: '¿Qué pasa si mi retención mensual no coincide con lo que sale en esta calculadora?',
      answer:
        'Es normal. La retención que te aplican cada mes en la nómina es una estimación que hace tu empresa al principio del año, calculada con tus datos declarados en el modelo 145. El resultado real y definitivo del IRPF se calcula una sola vez al año, en la declaración de la Renta, momento en el que se ajustan las diferencias: si has retenido de más, Hacienda te devuelve; si has retenido de menos, tienes que pagar la diferencia.',
    },
    {
      question: '¿Los rendimientos del trabajo tributan igual que los del alquiler o el ahorro?',
      answer:
        'No. Esta calculadora está pensada para rendimientos generales (trabajo o actividades económicas), que tributan por la escala progresiva que ves aquí. Las rentas del ahorro (dividendos, intereses, ganancias patrimoniales por venta de acciones o fondos) tributan por una escala distinta, normalmente más baja, con tipos que suelen ir del 19% al 30% según el importe.',
    },
  ],
  content: [
    { type: 'heading', text: 'Qué es y cómo se calcula el IRPF' },
    {
      type: 'paragraph',
      text:
        'El Impuesto sobre la Renta de las Personas Físicas (IRPF) es un impuesto progresivo: no se aplica un único porcentaje sobre toda tu renta, sino que cada tramo de tu base liquidable tributa a un tipo distinto (más alto cuanto mayor es el tramo). Esto significa que tu tipo marginal (el tipo del último euro que ganas) es siempre más alto que tu tipo medio efectivo (lo que realmente pagas de media sobre el total).',
    },
    {
      type: 'paragraph',
      text:
        'Ejemplo resuelto: con 30.000 € de rendimiento neto anual, sin aportaciones a plan de pensiones, sin hijos y tributación individual, tras restar el mínimo personal (5.550 €), la base liquidable es 24.450 €. Los primeros 12.450 € tributan al 19%, y el resto por tramos crecientes. El resultado es una cuota bastante menor que si se aplicara el tipo del último tramo a toda la renta.',
    },
    { type: 'heading', text: 'Los tramos de IRPF, uno por uno' },
    {
      type: 'paragraph',
      text:
        'La escala combinada (estatal + autonómica media) tiene seis tramos: hasta 12.450 € al 19%, de 12.450 a 20.200 € al 24%, de 20.200 a 35.200 € al 30%, de 35.200 a 60.000 € al 37%, de 60.000 a 300.000 € al 45%, y a partir de 300.000 € al 47%. Cada euro que ganas cae dentro de uno de estos tramos y tributa según el porcentaje de ese tramo, nunca según el porcentaje del tramo más alto que alcances aplicado a toda la renta.',
    },
    { type: 'heading', text: 'Cómo reducir tu base imponible legalmente' },
    {
      type: 'paragraph',
      text:
        'Las aportaciones a planes de pensiones reducen directamente la base imponible (dentro de los límites legales anuales), lo que puede incluso bajarte de tramo. El mínimo personal y familiar también reduce la base: aumenta si tienes hijos a cargo, y la declaración conjunta suma un mínimo adicional, aunque solo compensa en situaciones concretas (por ejemplo, cuando uno de los cónyuges tiene ingresos muy bajos o nulos).',
    },
    {
      type: 'paragraph',
      text:
        'Además de estas dos vías, existen deducciones autonómicas y estatales adicionales (alquiler de vivienda habitual, donativos, familia numerosa, maternidad) que varían según tu comunidad autónoma y no están incluidas en este cálculo, ya que dependen de normativa local específica.',
    },
    { type: 'heading', text: 'IRPF en asalariados frente a autónomos: qué cambia' },
    {
      type: 'paragraph',
      text:
        'Para un asalariado, el "rendimiento neto" es básicamente su salario bruto (con pocos gastos deducibles). Para un autónomo en estimación directa, el rendimiento neto es el resultado de restar a sus ingresos todos los gastos deducibles de la actividad (suministros, cuota de autónomos, material, alquiler del local, etc.). En ambos casos, una vez obtenido ese rendimiento neto, el cálculo del IRPF que hace esta calculadora es el mismo: se aplican los mismos tramos progresivos sobre la base liquidable resultante.',
    },
    { type: 'heading', text: 'Errores frecuentes al estimar el IRPF' },
    {
      type: 'paragraph',
      text:
        'El error más común es confundir el tipo marginal con el tipo medio efectivo, pensando que "todo" el sueldo tributa al porcentaje del tramo más alto alcanzado; como se explica más arriba, esto es incorrecto porque el sistema es progresivo por tramos. El segundo error habitual es olvidar que esta calculadora estima el IRPF sobre rendimientos generales, sin incluir rentas del ahorro (dividendos, intereses, venta de acciones o fondos), que tributan por una escala distinta y separada.',
    },
  ],
  calculate,
}
