import { nominaCalculator } from './nomina'
import { finiquitoCalculator } from './finiquito'
import { indemnizacionCalculator } from './indemnizacion'
import { ivaCalculator } from './iva'
import { irpfCalculator } from './irpf'
import { hipotecaCalculator } from './hipoteca'
import { prestamoCalculator } from './prestamo'
import { ahorroCalculator } from './ahorro'
import { gasolinaCalculator } from './gasolina'
import { costeEmpresaCalculator } from './coste-empresa'
import { cuotaAutonomosCalculator } from './cuota-autonomos'
import { rentabilidadInversionCalculator } from './rentabilidad-inversion'
import { presupuesto503020Calculator } from './presupuesto-50-30-20'
import { plusvaliaMunicipalCalculator } from './plusvalia-municipal'
import { gastosCompraventaCalculator } from './gastos-compraventa'

// Para publicar una calculadora nueva: crea su módulo (ver README) y
// añádela aquí. Home, sitemap, categorías, JSON-LD y buscador la recogen
// automáticamente sin tocar nada más.
export const calculators = {
  nomina: nominaCalculator,
  finiquito: finiquitoCalculator,
  indemnizacion: indemnizacionCalculator,
  iva: ivaCalculator,
  irpf: irpfCalculator,
  hipoteca: hipotecaCalculator,
  prestamo: prestamoCalculator,
  ahorro: ahorroCalculator,
  gasolina: gasolinaCalculator,
  'coste-empresa': costeEmpresaCalculator,
  'cuota-autonomos': cuotaAutonomosCalculator,
  'rentabilidad-inversion': rentabilidadInversionCalculator,
  'presupuesto-50-30-20': presupuesto503020Calculator,
  'plusvalia-municipal': plusvaliaMunicipalCalculator,
  'gastos-compraventa': gastosCompraventaCalculator,
} as const

export type CalculatorSlug = keyof typeof calculators

export function getCalculator(slug: string) {
  return calculators[slug as CalculatorSlug] ?? null
}

export function getAllCalculatorSlugs(): CalculatorSlug[] {
  return Object.keys(calculators) as CalculatorSlug[]
}

export function getCalculatorsByCategory(categorySlug: string) {
  return Object.values(calculators).filter((c) => c.meta.categorySlug === categorySlug)
}
