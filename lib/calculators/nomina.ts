import { z } from 'zod'
import type { CalculatorDefinition } from './types'

// -----------------------------------------------------------------------------
// CALCULADORA DE NÓMINA — plantilla de referencia para el resto de calculadoras
// -----------------------------------------------------------------------------
// Los tipos de cotización y tramos de IRPF cambian cada año. Por eso NO están
// hardcodeados "a fuego" en producción: en la versión final vienen de la tabla
// `tax_tables` de Supabase (editable desde el admin), y esta función recibe la
// tabla vigente como parámetro. Aquí se dejan unos valores 2026 por defecto
// para que el motor sea funcional y testeable desde ya.

export const nominaInputSchema = z.object({
  salarioBrutoAnual: z.number().min(0).max(2_000_000),
  pagasExtra: z.union([z.literal(12), z.literal(14)]).default(14),
  situacionFamiliar: z
    .enum(['soltero', 'casado_1_ingreso', 'casado_2_ingresos'])
    .default('soltero'),
  numHijos: z.number().int().min(0).max(10).default(0),
  comunidadAutonoma: z.string().default('generico'),
  discapacidad: z.enum(['ninguna', '33_64', '65_mas']).default('ninguna'),
})

export type NominaInput = z.infer<typeof nominaInputSchema>

interface NominaBreakdown extends Record<string, number> {
  salarioBrutoMensual: number
  contingenciasComunes: number
  desempleo: number
  formacionProfesional: number
  totalSegSocialTrabajador: number
  baseImponibleIrpf: number
  minimoExento: number
  baseLiquidable: number
  retencionIrpfPorcentaje: number
  retencionIrpfEuros: number
  salarioNetoMensual: number
  salarioNetoAnual: number
}

// Tipos de cotización del trabajador (Régimen General, valores 2026 de referencia:
// contingencias comunes 4,70% + desempleo 1,55% + formación 0,10% + MEI 0,15%)
const TIPOS_SS_TRABAJADOR = {
  contingenciasComunes: 0.047,
  desempleo: 0.0155,
  formacionProfesional: 0.001,
  mei: 0.0015,
}

// Tramos combinados (estatal + autonómico general) 2026, orientativos.
const TRAMOS_IRPF = [
  { hasta: 12450, tipo: 0.19 },
  { hasta: 20200, tipo: 0.24 },
  { hasta: 35200, tipo: 0.3 },
  { hasta: 60000, tipo: 0.37 },
  { hasta: 300000, tipo: 0.45 },
  { hasta: Infinity, tipo: 0.47 },
]

// Ajuste orientativo por comunidad autónoma sobre el tipo autonómico
// (algunas CCAA aplican tipos más bajos o más altos que la media estatal).
// Valores aproximados a modo ilustrativo; no sustituyen las escalas oficiales
// publicadas por cada comunidad.
const AJUSTE_CCAA: Record<string, number> = {
  generico: 0,
  madrid: -0.015,
  cataluna: 0.01,
  valenciana: 0.012,
  andalucia: -0.005,
  pais_vasco: -0.02, // régimen foral, cálculo real es distinto
  navarra: -0.01, // régimen foral, cálculo real es distinto
}

// Cálculo progresivo real: cada euro tributa según el tramo en el que cae.
function calcularCuotaProgresiva(baseLiquidable: number, ajusteCcaa: number): number {
  let cuota = 0
  let restante = baseLiquidable
  let limiteAnterior = 0

  for (const tramo of TRAMOS_IRPF) {
    if (restante <= 0) break
    const anchoTramo = tramo.hasta - limiteAnterior
    const importeEnTramo = Math.min(restante, anchoTramo)
    const tipoAjustado = Math.max(0, tramo.tipo + ajusteCcaa)
    cuota += importeEnTramo * tipoAjustado
    restante -= importeEnTramo
    limiteAnterior = tramo.hasta
  }

  return cuota
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: NominaInput) {
  const parsed = nominaInputSchema.parse(input)
  const numPagas = parsed.pagasExtra
  const salarioBrutoMensual = parsed.salarioBrutoAnual / numPagas

  const contingenciasComunes = salarioBrutoMensual * TIPOS_SS_TRABAJADOR.contingenciasComunes
  const desempleo = salarioBrutoMensual * TIPOS_SS_TRABAJADOR.desempleo
  const formacionProfesional = salarioBrutoMensual * TIPOS_SS_TRABAJADOR.formacionProfesional
  const mei = salarioBrutoMensual * TIPOS_SS_TRABAJADOR.mei
  const totalSegSocialTrabajador = contingenciasComunes + desempleo + formacionProfesional + mei

  const baseImponibleIrpf = parsed.salarioBrutoAnual - totalSegSocialTrabajador * numPagas

  // Mínimo personal y familiar (reduce la base antes de aplicar tramos)
  let minimoExento = parsed.situacionFamiliar === 'casado_1_ingreso' ? 5550 + 3400 : 5550
  minimoExento += parsed.numHijos * 2400
  if (parsed.discapacidad === '33_64') minimoExento += 3000
  if (parsed.discapacidad === '65_mas') minimoExento += 9000

  const baseLiquidable = Math.max(0, baseImponibleIrpf - minimoExento)
  const ajusteCcaa = AJUSTE_CCAA[parsed.comunidadAutonoma] ?? 0
  const cuotaAnual = calcularCuotaProgresiva(baseLiquidable, ajusteCcaa)

  const retencionIrpfPorcentaje = baseImponibleIrpf > 0 ? cuotaAnual / baseImponibleIrpf : 0
  const retencionIrpfEuros = salarioBrutoMensual * retencionIrpfPorcentaje

  const salarioNetoMensual = salarioBrutoMensual - totalSegSocialTrabajador - retencionIrpfEuros
  const salarioNetoAnual = salarioNetoMensual * numPagas

  const breakdown: NominaBreakdown = {
    salarioBrutoMensual: round2(salarioBrutoMensual),
    contingenciasComunes: round2(contingenciasComunes),
    desempleo: round2(desempleo),
    formacionProfesional: round2(formacionProfesional),
    totalSegSocialTrabajador: round2(totalSegSocialTrabajador),
    baseImponibleIrpf: round2(baseImponibleIrpf),
    minimoExento: round2(minimoExento),
    baseLiquidable: round2(baseLiquidable),
    retencionIrpfPorcentaje: round2(retencionIrpfPorcentaje * 100),
    retencionIrpfEuros: round2(retencionIrpfEuros),
    salarioNetoMensual: round2(salarioNetoMensual),
    salarioNetoAnual: round2(salarioNetoAnual),
  }

  return {
    main: {
      label: 'Salario neto mensual',
      value: breakdown.salarioNetoMensual,
      unit: 'EUR' as const,
    },
    breakdown,
  }
}

export const nominaCalculator: CalculatorDefinition<NominaInput, NominaBreakdown> = {
  meta: {
    slug: 'nomina',
    categorySlug: 'laboral',
    title: 'Calculadora de Nómina 2026',
    seoTitle: 'Calculadora de Nómina 2026: Salario Bruto a Neto Online Gratis',
    metaDescription:
      'Calcula tu nómina neta a partir del salario bruto anual. IRPF progresivo por tramos, Seguridad Social, comunidad autónoma, hijos y discapacidad. Actualizada 2026.',
    shortDescription: 'Convierte tu salario bruto en neto mensual, con desglose de SS e IRPF.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'salarioBrutoAnual', label: 'Salario bruto anual', type: 'number', suffix: '€' },
    {
      key: 'pagasExtra',
      label: 'Número de pagas',
      type: 'select',
      valueAsNumber: true,
      options: [
        { value: '14', label: '14 pagas' },
        { value: '12', label: '12 pagas (prorrateadas)' },
      ],
    },
    {
      key: 'comunidadAutonoma',
      label: 'Comunidad autónoma',
      type: 'select',
      options: [
        { value: 'generico', label: 'Media nacional' },
        { value: 'madrid', label: 'Madrid' },
        { value: 'cataluna', label: 'Cataluña' },
        { value: 'valenciana', label: 'C. Valenciana' },
        { value: 'andalucia', label: 'Andalucía' },
        { value: 'pais_vasco', label: 'País Vasco *' },
        { value: 'navarra', label: 'Navarra *' },
      ],
    },
    {
      key: 'situacionFamiliar',
      label: 'Situación familiar',
      type: 'select',
      options: [
        { value: 'soltero', label: 'Soltero/a' },
        { value: 'casado_1_ingreso', label: 'Casado/a, 1 ingreso' },
        { value: 'casado_2_ingresos', label: 'Casado/a, 2 ingresos' },
      ],
    },
    { key: 'numHijos', label: 'Número de hijos', type: 'number' },
    {
      key: 'discapacidad',
      label: 'Discapacidad',
      type: 'select',
      options: [
        { value: 'ninguna', label: 'No' },
        { value: '33_64', label: '33% – 64%' },
        { value: '65_mas', label: '65% o más' },
      ],
    },
  ],
  defaultValues: {
    salarioBrutoAnual: 24000,
    pagasExtra: 14,
    situacionFamiliar: 'soltero',
    numHijos: 0,
    comunidadAutonoma: 'generico',
    discapacidad: 'ninguna',
  },
  faqs: [
    {
      question: '¿Cómo se calcula el salario neto a partir del bruto?',
      answer:
        'Al salario bruto se le restan las cotizaciones a la Seguridad Social del trabajador (contingencias comunes, desempleo, formación profesional y MEI, en torno al 6,5% del bruto) y la retención de IRPF, calculada de forma progresiva sobre la base liquidable tras aplicar el mínimo personal y familiar.',
    },
    {
      question: '¿Por qué influye la comunidad autónoma en el resultado?',
      answer:
        'El IRPF se compone de un tramo estatal, igual en toda España, y un tramo autonómico que cada comunidad puede fijar de forma distinta. Por eso el mismo salario bruto puede dar un neto ligeramente distinto según dónde resides fiscalmente.',
    },
    {
      question: '¿Qué diferencia hay entre 12 y 14 pagas?',
      answer:
        'El neto anual total es el mismo. Con 14 pagas, dos de ellas son extras (normalmente en verano y Navidad). Con 12 pagas, ese importe se prorratea entre los 12 meses, por lo que cada nómina mensual es mayor pero no hay pagas adicionales.',
    },
    {
      question: '¿Este cálculo es exacto o solo orientativo?',
      answer:
        'Es una estimación fiable para la mayoría de casos del Régimen General, pero no sustituye el cálculo oficial de tu empresa o la Agencia Tributaria. País Vasco y Navarra tienen regímenes forales con un cálculo distinto al del resto de España.',
    },
    {
      question: '¿Cuánto se paga de Seguridad Social en una nómina?',
      answer:
        'El trabajador aporta aproximadamente un 6,5% de su salario bruto: 4,70% de contingencias comunes, 1,55% de desempleo, 0,10% de formación profesional y 0,15% del Mecanismo de Equidad Intergeneracional (MEI). La empresa, además, paga otro porcentaje adicional (bastante mayor) que no aparece descontado en tu nómina.',
    },
    {
      question: '¿Cómo afectan los hijos y la discapacidad a la nómina?',
      answer:
        'Aumentan el "mínimo exento": la parte de tus ingresos que no tributa. Cada hijo a cargo suma un importe adicional, y una discapacidad reconocida (33-64% o 65% o más) suma un mínimo adicional todavía mayor, reduciendo la base sobre la que se calcula el IRPF y, por tanto, aumentando el neto.',
    },
  ],
  content: [
    { type: 'heading', text: 'De qué se compone tu nómina: del bruto al neto' },
    {
      type: 'paragraph',
      text:
        'Tu salario bruto anual no es lo que acaba en tu cuenta. Antes de llegar al neto se descuentan dos bloques: las cotizaciones a la Seguridad Social a cargo del trabajador (contingencias comunes 4,70%, desempleo 1,55%, formación profesional 0,10% y el Mecanismo de Equidad Intergeneracional o MEI 0,15%, en torno al 6,5% del bruto en total), y la retención de IRPF, calculada de forma progresiva por tramos sobre tu base liquidable, después de restar el mínimo personal y familiar (que sube si tienes hijos a cargo o discapacidad).',
    },
    { type: 'heading', text: 'Por qué el mismo salario da un neto distinto según la comunidad autónoma' },
    {
      type: 'paragraph',
      text:
        'El IRPF se compone de un tramo estatal (igual en toda España) y un tramo autonómico que cada comunidad fija de forma independiente. Por eso alguien en Madrid y alguien en Cataluña con el mismo salario bruto pueden tener un neto ligeramente distinto.',
    },
    { type: 'heading', text: '12 pagas vs 14 pagas: no cambia el total, cambia el reparto' },
    {
      type: 'paragraph',
      text:
        'El salario neto anual es idéntico con 12 o con 14 pagas: lo único que cambia es cómo se reparte a lo largo del año. Con 14 pagas, dos son extras (normalmente junio y diciembre); con 12, ese importe se prorratea cada mes, dando una nómina mensual algo más alta pero sin extras separadas.',
    },
    {
      type: 'paragraph',
      text:
        'Aviso sobre País Vasco y Navarra: estas dos comunidades tienen régimen foral, su IRPF lo gestionan las Haciendas Forales con sus propias tablas, distintas del resto de España. La estimación de esta calculadora para esas comunidades es solo orientativa.',
    },
  ],
  calculate,
}
