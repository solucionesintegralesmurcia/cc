import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const prestamoInputSchema = z.object({
  importePrestamo: z.number().min(1).max(5_000_000),
  tipoInteresAnual: z.number().min(0).max(40),
  plazoMeses: z.number().min(1).max(600),
  comisionAperturaPorcentaje: z.number().min(0).max(10),
})

export type PrestamoInput = z.infer<typeof prestamoInputSchema>

interface PrestamoBreakdown extends Record<string, number> {
  comisionApertura: number
  cuotaMensual: number
  totalPagado: number
  totalIntereses: number
  costeTotalPrestamo: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: PrestamoInput) {
  const parsed = prestamoInputSchema.parse(input)
  const n = parsed.plazoMeses
  const r = parsed.tipoInteresAnual / 100 / 12

  const cuotaMensual =
    r === 0
      ? parsed.importePrestamo / n
      : (parsed.importePrestamo * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1)

  const comisionApertura = parsed.importePrestamo * (parsed.comisionAperturaPorcentaje / 100)
  const totalPagado = cuotaMensual * n
  const totalIntereses = totalPagado - parsed.importePrestamo
  const costeTotalPrestamo = totalIntereses + comisionApertura

  const breakdown: PrestamoBreakdown = {
    comisionApertura: round2(comisionApertura),
    cuotaMensual: round2(cuotaMensual),
    totalPagado: round2(totalPagado),
    totalIntereses: round2(totalIntereses),
    costeTotalPrestamo: round2(costeTotalPrestamo),
  }

  return {
    main: { label: 'Cuota mensual', value: breakdown.cuotaMensual, unit: 'EUR' as const },
    breakdown,
  }
}

export const prestamoCalculator: CalculatorDefinition<PrestamoInput, PrestamoBreakdown> = {
  meta: {
    slug: 'prestamo',
    categorySlug: 'prestamos',
    title: 'Calculadora de Préstamo Personal 2026',
    seoTitle: 'Calculadora de Préstamo Personal 2026: Cuota, Intereses y Comisiones',
    metaDescription:
      'Calcula la cuota mensual de tu préstamo personal, el total de intereses y el coste total incluyendo la comisión de apertura.',
    shortDescription: 'Calcula la cuota, los intereses totales y el coste real de un préstamo.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'importePrestamo', label: 'Importe del préstamo', type: 'number', suffix: '€' },
    {
      key: 'tipoInteresAnual',
      label: 'TIN (tipo de interés anual)',
      type: 'number',
      suffix: '%',
      step: 0.01,
    },
    { key: 'plazoMeses', label: 'Plazo', type: 'number', suffix: 'meses' },
    {
      key: 'comisionAperturaPorcentaje',
      label: 'Comisión de apertura',
      type: 'number',
      suffix: '%',
      step: 0.01,
    },
  ],
  defaultValues: {
    importePrestamo: 10000,
    tipoInteresAnual: 8,
    plazoMeses: 60,
    comisionAperturaPorcentaje: 1,
  },
  faqs: [
    {
      question: '¿Qué diferencia hay con la calculadora de hipoteca?',
      answer:
        'La lógica financiera es la misma (amortización francesa con cuota constante), pero los préstamos personales suelen tener plazos más cortos, tipos de interés más altos y, a menudo, una comisión de apertura que aquí se incluye en el coste total.',
    },
    {
      question: '¿La comisión de apertura se paga una sola vez?',
      answer:
        'Sí, normalmente se descuenta del capital entregado o se paga junto con la primera cuota, y se calcula como un porcentaje sobre el importe total del préstamo.',
    },
    {
      question: '¿Por qué el coste total del préstamo es mayor que los intereses?',
      answer:
        'Porque además de los intereses generados durante todo el plazo, hay que sumar comisiones como la de apertura, que forman parte del coste real de financiarte.',
    },
    {
      question: '¿Qué diferencia hay entre TIN y TAE en un préstamo personal?',
      answer:
        'El TIN es el tipo de interés puro, el que se usa para calcular la cuota mensual. La TAE incluye además la comisión de apertura y otros gastos asociados repartidos a lo largo de la vida del préstamo, por lo que refleja mejor el coste real total. En préstamos personales, con plazos más cortos que una hipoteca, la diferencia entre TIN y TAE suele notarse más, porque las comisiones se reparten entre menos cuotas.',
    },
    {
      question: '¿Compensa pedir un préstamo personal a más plazo para pagar menos cada mes?',
      answer:
        'Reduce la cuota mensual, pero aumenta el total de intereses pagados porque el capital tarda más en amortizarse y genera intereses durante más tiempo. Alargar el plazo tiene sentido si necesitas aligerar tu presupuesto mensual, pero siempre implica pagar más por el mismo dinero prestado a largo plazo.',
    },
    {
      question: '¿Qué es la amortización anticipada y tiene coste en un préstamo personal?',
      answer:
        'Es la posibilidad de devolver parte o la totalidad del préstamo antes de lo pactado, para reducir el capital pendiente y ahorrar en intereses futuros. La normativa española limita la comisión que puede cobrar la entidad por amortización anticipada, con topes legales según el tipo de préstamo; muchas entidades incluso no cobran comisión alguna en préstamos personales, pero conviene comprobarlo en el contrato antes de firmar.',
    },
    {
      question: '¿Qué es un préstamo preconcedido y por qué el interés puede ser distinto?',
      answer:
        'Es una oferta de financiación que un banco te hace de forma proactiva, normalmente por ser ya cliente, con un importe y condiciones ya evaluadas de antemano. El tipo de interés suele ser más competitivo que el de una solicitud nueva sin vinculación previa con la entidad, ya que el banco ya conoce tu perfil de riesgo a partir de tu historial como cliente.',
    },
    {
      question: '¿Cómo afecta mi historial crediticio (ASNEF, RAI) a las condiciones del préstamo?',
      answer:
        'Aparecer en ficheros de morosidad como ASNEF o RAI dificulta mucho el acceso a préstamos personales en condiciones normales, ya que la mayoría de entidades tradicionales los deniegan directamente. Existen financieras especializadas en conceder préstamos a personas con historial negativo, pero suelen aplicar tipos de interés bastante más altos para compensar el riesgo asumido.',
    },
    {
      question: '¿Qué diferencia hay entre un préstamo personal y una tarjeta revolving?',
      answer:
        'El préstamo personal tiene un importe, plazo y cuota fijados desde el principio, con un TIN generalmente más bajo. La tarjeta revolving permite ir disponiendo de crédito de forma flexible y devolverlo en cuotas pequeñas, pero suele aplicar tipos de interés muy superiores (a menudo por encima del 20% TAE), lo que puede alargar mucho la devolución y encarecer notablemente el coste total si solo se paga la cuota mínima.',
    },
  ],
  content: [
    { type: 'heading', text: 'Cómo se calcula la cuota de un préstamo personal' },
    {
      type: 'paragraph',
      text:
        'Al igual que una hipoteca, la mayoría de préstamos personales en España usan el sistema de amortización francesa: cuota mensual constante durante todo el plazo, con la proporción de intereses más alta al principio y de capital más alta al final. A diferencia de una hipoteca, los préstamos personales suelen tener plazos más cortos (entre 1 y 10 años), tipos de interés más altos, y con frecuencia una comisión de apertura que se paga una sola vez, normalmente descontada del capital entregado o sumada a la primera cuota.',
    },
    {
      type: 'paragraph',
      text:
        'Ejemplo resuelto: un préstamo de 10.000 € a 5 años (60 meses) con un TIN del 8% y una comisión de apertura del 1% da una cuota mensual de aproximadamente 203 €. A lo largo del préstamo pagarás unos 12.180 € en total, de los cuales cerca de 2.180 € son intereses, más 100 € de comisión de apertura: el coste total de financiarte esos 10.000 € ronda los 2.280 €.',
    },
    { type: 'heading', text: 'TIN, TAE y comisión de apertura: qué mirar antes de firmar' },
    {
      type: 'paragraph',
      text:
        'El TIN es el interés que determina tu cuota mensual, pero no refleja el coste real del préstamo si existen comisiones adicionales. La TAE sí las incluye, repartidas a lo largo del plazo, por lo que es la cifra que deberías comparar entre distintas ofertas de financiación, no solo el TIN. En préstamos personales, al tener plazos más cortos que una hipoteca, una misma comisión de apertura tiene más peso relativo sobre la TAE final.',
    },
    { type: 'heading', text: 'Cómo afecta el plazo elegido al coste total' },
    {
      type: 'paragraph',
      text:
        'Elegir un plazo más largo reduce la cuota mensual, haciendo el préstamo más asumible en el día a día, pero incrementa el total de intereses pagados porque el capital pendiente genera intereses durante más tiempo. Elegir un plazo más corto exige cuotas mensuales más altas, pero reduce notablemente el coste total del préstamo. No hay una opción "correcta" universal: depende de tu capacidad de pago mensual frente a tu prioridad de minimizar el coste total.',
    },
    { type: 'heading', text: 'Alternativas de financiación y cuándo conviene cada una' },
    {
      type: 'paragraph',
      text:
        'Frente a un préstamo personal con cuota y plazo fijos, existen alternativas como las tarjetas revolving (crédito flexible pero con tipos de interés normalmente mucho más altos, especialmente si solo se paga la cuota mínima) o los préstamos preconcedidos que algunos bancos ofrecen a sus propios clientes con condiciones más competitivas. Para necesidades de financiación puntuales y con fecha de devolución clara, un préstamo personal con cuota fija suele ser la opción más predecible y, casi siempre, la más barata en coste total.',
    },
  ],
  calculate,
}
