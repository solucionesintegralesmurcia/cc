import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const ivaInputSchema = z.object({
  importe: z.number().min(0).max(100_000_000),
  tipoIva: z.union([z.literal(21), z.literal(10), z.literal(4)]),
  direccion: z.enum(['sin_iva_a_con_iva', 'con_iva_a_sin_iva']),
})

export type IvaInput = z.infer<typeof ivaInputSchema>

interface IvaBreakdown extends Record<string, number> {
  baseImponible: number
  cuotaIva: number
  totalConIva: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: IvaInput) {
  const parsed = ivaInputSchema.parse(input)
  const tipo = parsed.tipoIva / 100

  let baseImponible: number
  let cuotaIva: number
  let totalConIva: number

  if (parsed.direccion === 'sin_iva_a_con_iva') {
    baseImponible = parsed.importe
    cuotaIva = baseImponible * tipo
    totalConIva = baseImponible + cuotaIva
  } else {
    totalConIva = parsed.importe
    baseImponible = totalConIva / (1 + tipo)
    cuotaIva = totalConIva - baseImponible
  }

  const breakdown: IvaBreakdown = {
    baseImponible: round2(baseImponible),
    cuotaIva: round2(cuotaIva),
    totalConIva: round2(totalConIva),
  }

  return {
    main: { label: 'Precio final con IVA', value: breakdown.totalConIva, unit: 'EUR' as const },
    breakdown,
  }
}

export const ivaCalculator: CalculatorDefinition<IvaInput, IvaBreakdown> = {
  meta: {
    slug: 'iva',
    categorySlug: 'fiscal',
    title: 'Calculadora de IVA 2026',
    seoTitle: 'Calculadora de IVA 2026: Calcula el IVA al 21%, 10% o 4%',
    metaDescription:
      'Calcula el IVA de cualquier importe, tanto para añadir el IVA a un precio sin impuestos como para desglosar el IVA incluido en un precio final.',
    shortDescription: 'Añade o desglosa el IVA (21%, 10%, 4%) de cualquier importe al instante.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'importe', label: 'Importe', type: 'number', suffix: '€' },
    {
      key: 'tipoIva',
      label: 'Tipo de IVA',
      type: 'select',
      valueAsNumber: true,
      options: [
        { value: '21', label: '21% (General)' },
        { value: '10', label: '10% (Reducido)' },
        { value: '4', label: '4% (Superreducido)' },
      ],
    },
    {
      key: 'direccion',
      label: '¿Qué importe has introducido?',
      type: 'select',
      options: [
        { value: 'sin_iva_a_con_iva', label: 'Precio sin IVA (quiero añadirlo)' },
        { value: 'con_iva_a_sin_iva', label: 'Precio con IVA (quiero desglosarlo)' },
      ],
    },
  ],
  defaultValues: {
    importe: 100,
    tipoIva: 21,
    direccion: 'sin_iva_a_con_iva',
  },
  faqs: [
    {
      question: '¿Qué productos llevan el IVA reducido del 10%?',
      answer:
        'Se aplica, entre otros, a alimentos en general, transporte de viajeros, hostelería y restauración, y determinados servicios de reforma de vivienda.',
    },
    {
      question: '¿Qué productos llevan el IVA superreducido del 4%?',
      answer:
        'Se aplica a productos de primera necesidad como pan, leche, frutas, verduras, libros, periódicos y medicamentos.',
    },
    {
      question: '¿Cómo se calcula la base imponible a partir de un precio con IVA?',
      answer:
        'Se divide el precio final entre (1 + tipo de IVA en decimal). Por ejemplo, con IVA del 21%, se divide entre 1,21. No se debe restar directamente el porcentaje del precio final, porque ese porcentaje se calcula sobre la base, no sobre el precio con impuestos incluidos.',
    },
    {
      question: '¿Por qué no puedo simplemente restar el 21% del precio final?',
      answer:
        'Porque el 21% se aplica sobre la base imponible, no sobre el precio final. Si restas el 21% de 121 €, obtienes 95,59 €, un resultado incorrecto: la base real es 100 €. La única forma correcta de desglosar el IVA es dividiendo el precio final entre 1,21 (o el divisor correspondiente al tipo aplicado).',
    },
    {
      question: '¿El IVA es el mismo para autónomos que para empresas?',
      answer:
        'Sí, los tipos de IVA (21%, 10%, 4%) son los mismos independientemente de si quien factura es autónomo o empresa. Lo que cambia son las obligaciones de declaración y liquidación trimestral, no el tipo aplicable a cada producto o servicio.',
    },
    {
      question: '¿Qué es el IVA soportado y el IVA repercutido?',
      answer:
        'El IVA repercutido es el que tú cobras a tus clientes al emitir facturas por tus ventas o servicios. El IVA soportado es el que tú pagas a tus proveedores al comprar bienes o servicios para tu actividad. La diferencia entre ambos (repercutido menos soportado) es lo que ingresas o te devuelve Hacienda cada trimestre.',
    },
    {
      question: '¿Cómo y cuándo se declara el IVA?',
      answer:
        'Autónomos y empresas declaran el IVA trimestralmente mediante el modelo 303 (plazos: hasta el 20 de abril, julio y octubre, y hasta el 30 de enero para el cuarto trimestre), y presentan además un resumen anual mediante el modelo 390 en enero. En cada declaración trimestral se liquida la diferencia entre el IVA repercutido y el soportado de ese periodo.',
    },
    {
      question: '¿Qué es el recargo de equivalencia y a quién afecta?',
      answer:
        'Es un régimen especial de IVA obligatorio para autónomos comerciantes minoristas que venden directamente al consumidor final sin transformar los productos. En lugar de liquidar el IVA trimestralmente, pagan un recargo adicional a sus proveedores (que varía según el tipo de IVA del producto) y quedan exentos de presentar el modelo 303, simplificando su gestión administrativa a cambio de no poder deducirse el IVA soportado.',
    },
    {
      question: '¿Qué operaciones están exentas de IVA?',
      answer:
        'Algunas actividades están exentas por ley, entre ellas ciertos servicios médicos y sanitarios, la educación reglada, algunos servicios financieros y de seguros, y el alquiler de vivienda habitual (no así el alquiler de locales comerciales, que sí lleva IVA). Estar exento no es lo mismo que tener tipo 0%: en la exención, ni se repercute IVA a los clientes ni se puede deducir el IVA soportado en las compras relacionadas.',
    },
    {
      question: '¿Cómo funciona el IVA en compras a otros países de la UE?',
      answer:
        'En operaciones entre empresas o autónomos de distintos países de la Unión Europea (inscritos en el Registro de Operadores Intracomunitarios, ROI), la factura suele emitirse sin IVA, aplicando el mecanismo de inversión del sujeto pasivo: es el comprador quien autoliquida el IVA en su propio país, tanto como soportado como repercutido, de forma que el resultado neto es cero si el bien se destina a la actividad económica.',
    },
  ],
  content: [
    { type: 'heading', text: 'Los tres tipos de IVA en España' },
    {
      type: 'paragraph',
      text:
        'General (21%): se aplica por defecto a la mayoría de bienes y servicios que no tienen un tipo reducido específico. Reducido (10%): alimentación en general, hostelería y restauración, transporte de viajeros, y ciertas reformas de vivienda. Superreducido (4%): productos de primera necesidad como pan, leche, huevos, frutas, verduras, libros, periódicos y medicamentos.',
    },
    { type: 'heading', text: 'Cómo añadir o desglosar el IVA' },
    {
      type: 'paragraph',
      text:
        'Para añadir IVA a un precio sin impuestos: Precio final = Base × (1 + tipo). Por ejemplo, 100 € + IVA del 21% = 121 €.',
    },
    {
      type: 'paragraph',
      text:
        'Para desglosar el IVA de un precio que ya lo incluye (el caso típico: "tengo un ticket de 121 € y quiero saber cuánto es IVA"), la operación no es simplemente multiplicar por el tipo, hay que dividir: Base imponible = Precio final / (1 + tipo). Con el ejemplo anterior: 121 / 1,21 = 100 € de base, y 21 € de cuota de IVA.',
    },
    { type: 'heading', text: 'Errores comunes al calcular el IVA' },
    {
      type: 'paragraph',
      text:
        'Un error frecuente es restar directamente el 21% de un precio final para "quitar el IVA": eso da un resultado incorrecto. Con 121 €, restar el 21% (25,41 €) da 95,59 €, cuando la base real es 100 €. Siempre hay que dividir entre (1 + tipo), nunca multiplicar por el tipo sobre el precio final.',
    },
    { type: 'heading', text: 'IVA soportado vs IVA repercutido: la clave para autónomos y empresas' },
    {
      type: 'paragraph',
      text:
        'Si eres autónomo o tienes una empresa, cada factura que emites incluye "IVA repercutido" (el que le cobras a tu cliente) y cada factura que recibes de tus proveedores incluye "IVA soportado" (el que tú pagas). Cada trimestre, Hacienda te exige la diferencia entre ambos: si has repercutido más de lo que has soportado, pagas esa diferencia; si has soportado más de lo que has repercutido (por ejemplo, tras una inversión grande), Hacienda te lo compensa o devuelve.',
    },
    { type: 'heading', text: 'Cuándo y cómo se declara el IVA en España' },
    {
      type: 'paragraph',
      text:
        'La declaración se hace trimestralmente mediante el modelo 303, con plazos hasta el 20 de abril, 20 de julio y 20 de octubre, y hasta el 30 de enero para el cuarto trimestre del año anterior. Además, en enero se presenta el modelo 390, un resumen anual de todas las operaciones del ejercicio. Llevar un registro ordenado de facturas emitidas y recibidas durante el trimestre facilita mucho esta declaración.',
    },
    { type: 'heading', text: 'Regímenes especiales: recargo de equivalencia e IVA intracomunitario' },
    {
      type: 'paragraph',
      text:
        'El recargo de equivalencia es obligatorio para comerciantes minoristas que venden productos sin transformarlos: en lugar de declarar IVA trimestralmente, pagan un recargo adicional a sus proveedores y quedan liberados de presentar el modelo 303. En las compras a otros países de la Unión Europea entre profesionales registrados en el ROI, se suele aplicar la inversión del sujeto pasivo: el vendedor factura sin IVA y es el comprador quien lo autoliquida en su propio país.',
    },
  ],
  calculate,
}
