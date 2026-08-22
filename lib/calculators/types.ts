// Tipos base que toda calculadora debe respetar.
// Cada calculadora implementa esta interfaz -> un único <CalculatorForm>
// genérico sabe renderizarlas todas sin código repetido por calculadora.

export interface CalculatorMeta {
  slug: string
  categorySlug: string
  title: string
  seoTitle: string
  metaDescription: string
  shortDescription: string
  updatedAt: string
}

export interface FaqItem {
  question: string
  answer: string
}

/** Bloque de contenido extendido: subtítulo (h3) o párrafo. */
export type ContentBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }

export interface CalculationResult<T = Record<string, number>> {
  main: {
    label: string
    value: number
    unit: 'EUR' | 'PORCENTAJE' | 'DIAS' | 'ANIOS' | 'NUMERO'
  }
  breakdown: T
}

export interface FieldOption {
  value: string
  label: string
}

export interface FieldDef {
  key: string
  label: string
  type: 'number' | 'select' | 'checkbox'
  options?: FieldOption[]
  suffix?: string
  step?: number
  /** Para 'select' con opciones numéricas (ej: 12/14 pagas, 21/10/4 % IVA) */
  valueAsNumber?: boolean
}

export interface CalculatorDefinition<TInput, TBreakdown> {
  meta: CalculatorMeta
  faqs: FaqItem[]
  fields: FieldDef[]
  defaultValues: TInput
  calculate: (input: TInput) => CalculationResult<TBreakdown>
  /**
   * Texto explicativo extendido: párrafos y, opcionalmente, subtítulos.
   * Mismo patrón que `Article.content` en lib/articles (array de párrafos,
   * sin dangerouslySetInnerHTML). Opcional para no romper calculadoras que
   * aún no lo tengan; si falta, la página muestra el párrafo genérico.
   */
  content?: ContentBlock[]
  /**
   * Anula el formato por defecto (EUR) para claves concretas del desglose.
   * Necesario para campos que no son dinero: días, meses, kilómetros,
   * litros, coeficientes... Sin esto, el formulario genérico asume que
   * cualquier número del desglose es un importe en euros.
   */
  breakdownUnits?: Record<string, 'EUR' | 'PORCENTAJE' | 'NUMERO' | 'DIAS' | 'ANIOS'>
}
