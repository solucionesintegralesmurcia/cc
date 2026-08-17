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
import { cuotaAutonomoCalculator } from './cuota-autonomos'
import { rentabilidadCalculator } from './rentabilidad-inversion'
import { presupuestoCalculator } from './presupuesto-mensual'
import { plusvaliaCalculator } from './plusvalia-municipal'
import { gastosViviendaCalculator } from './gastos-compraventa-vivienda'
import { horasExtraCalculator } from './horas-extra'
import { paroCalculator } from './prestacion-paro'
import { jubilacionCalculator } from './pension-jubilacion'
import { imcCalculator } from './imc'
import { porcentajesCalculator } from './porcentajes'
import { propinasCalculator } from './propinas'
import { descuentosCalculator } from './descuentos-rebajas'
import { fianzaAlquilerCalculator } from './fianza-alquiler'
import { bajaMaternidadCalculator } from './baja-maternidad-paternidad'

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
  'cuota-autonomos': cuotaAutonomoCalculator,
  'rentabilidad-inversion': rentabilidadCalculator,
  'presupuesto-mensual': presupuestoCalculator,
  'plusvalia-municipal': plusvaliaCalculator,
  'gastos-compraventa-vivienda': gastosViviendaCalculator,
  'horas-extra': horasExtraCalculator,
  'prestacion-paro': paroCalculator,
  'pension-jubilacion': jubilacionCalculator,
  imc: imcCalculator,
  porcentajes: porcentajesCalculator,
  propinas: propinasCalculator,
  'descuentos-rebajas': descuentosCalculator,
  'fianza-alquiler': fianzaAlquilerCalculator,
  'baja-maternidad-paternidad': bajaMaternidadCalculator,
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
