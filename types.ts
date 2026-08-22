// content/calculadoras/types.ts
// Tipos compartidos por TODAS las páginas de calculadora.
// Cada calculadora exporta un objeto que cumple esta interfaz.

export interface FaqItem {
  question: string;
  answer: string; // texto plano, sin HTML. El componente ya da formato.
}

export interface ExampleRow {
  label: string;
  value: string;
}

export interface CalculatorContent {
  slug: string; // debe coincidir con la ruta, ej: "nomina"
  title: string; // H1 real de la página (ya lo tendrás en el page.tsx probablemente)
  lastUpdated: string; // ej: "Agosto 2026"

  intro: string; // 100-150 palabras

  methodologyTitle: string; // ej: "¿Cómo se calcula el salario neto?"
  methodologyParagraphs: string[]; // 2-4 párrafos

  exampleTitle: string; // ej: "Ejemplo práctico"
  exampleIntro: string; // 1-2 frases de contexto del ejemplo
  exampleTable: ExampleRow[]; // desglose fila a fila
  exampleConclusion: string; // 1-2 frases cerrando el ejemplo

  faqs: FaqItem[]; // 4-6 preguntas, oro para featured snippets

  relatedCalculators: { label: string; href: string }[];
  relatedArticles: { label: string; href: string }[];

  disclaimer?: string; // opcional, si quieres uno específico además del genérico del footer
}
