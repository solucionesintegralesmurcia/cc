import { z } from 'zod'
import type { CalculatorDefinition } from './types'

export const gasolinaInputSchema = z.object({
  distanciaKm: z.number().min(0).max(20000),
  consumoLitros100km: z.number().min(0).max(50),
  precioLitro: z.number().min(0).max(5),
  numPersonas: z.number().int().min(1).max(20),
  idaYVuelta: z.boolean(),
})

export type GasolinaInput = z.infer<typeof gasolinaInputSchema>

interface GasolinaBreakdown extends Record<string, number> {
  distanciaTotalKm: number
  litrosConsumidos: number
  costeTotal: number
  costePorPersona: number
  costePorKm: number
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function calculate(input: GasolinaInput) {
  const parsed = gasolinaInputSchema.parse(input)
  const distanciaTotalKm = parsed.idaYVuelta ? parsed.distanciaKm * 2 : parsed.distanciaKm

  const litrosConsumidos = (distanciaTotalKm / 100) * parsed.consumoLitros100km
  const costeTotal = litrosConsumidos * parsed.precioLitro
  const costePorPersona = costeTotal / parsed.numPersonas
  const costePorKm = distanciaTotalKm > 0 ? costeTotal / distanciaTotalKm : 0

  const breakdown: GasolinaBreakdown = {
    distanciaTotalKm: round2(distanciaTotalKm),
    litrosConsumidos: round2(litrosConsumidos),
    costeTotal: round2(costeTotal),
    costePorPersona: round2(costePorPersona),
    costePorKm: round2(costePorKm),
  }

  return {
    main: { label: 'Coste total del trayecto', value: breakdown.costeTotal, unit: 'EUR' as const },
    breakdown,
  }
}

export const gasolinaCalculator: CalculatorDefinition<GasolinaInput, GasolinaBreakdown> = {
  meta: {
    slug: 'gasolina',
    categorySlug: 'vehiculos',
    title: 'Calculadora de Gasolina 2026',
    seoTitle: 'Calculadora de Gasolina 2026: Coste de un Trayecto en Coche',
    metaDescription:
      'Calcula cuánto te cuesta un trayecto en coche según distancia, consumo del vehículo y precio del combustible. Ideal para repartir gastos de viaje.',
    shortDescription: 'Calcula el coste de un viaje en coche y repártelo entre los ocupantes.',
    updatedAt: '2026-01-01',
  },
  fields: [
    { key: 'distanciaKm', label: 'Distancia', type: 'number', suffix: 'km' },
    {
      key: 'idaYVuelta',
      label: 'Es ida y vuelta',
      type: 'checkbox',
    },
    {
      key: 'consumoLitros100km',
      label: 'Consumo del vehículo',
      type: 'number',
      suffix: 'L/100km',
      step: 0.1,
    },
    { key: 'precioLitro', label: 'Precio del combustible', type: 'number', suffix: '€/L', step: 0.001 },
    { key: 'numPersonas', label: 'Personas para repartir el gasto', type: 'number' },
  ],
  defaultValues: {
    distanciaKm: 100,
    consumoLitros100km: 6.5,
    precioLitro: 1.65,
    numPersonas: 1,
    idaYVuelta: false,
  },
  faqs: [
    {
      question: '¿Dónde encuentro el consumo medio de mi coche?',
      answer:
        'Suele venir en la ficha técnica del vehículo o en el manual del propietario, expresado en litros cada 100 km. También puedes calcularlo tú mismo dividiendo los litros repostados entre los km recorridos con ese depósito, multiplicado por 100.',
    },
    {
      question: '¿Por qué el consumo real no coincide con el homologado?',
      answer:
        'Los datos de fábrica se obtienen en condiciones de laboratorio. El consumo real varía según el tipo de conducción, el tráfico, la climatización, la carga del vehículo y el estado de las ruedas, y suele ser superior al homologado.',
    },
    {
      question: '¿Cómo reparto el gasto si viajamos varias personas?',
      answer:
        'Introduce el número total de personas (incluido el conductor) en el campo correspondiente, y la calculadora divide el coste total del trayecto entre todos a partes iguales.',
    },
  ],
  calculate,
}
