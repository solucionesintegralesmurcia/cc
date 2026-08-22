// components/CalculatorSEOContent.tsx
//
// Úsalo así en cada page.tsx de calculadora, DEBAJO del widget interactivo:
//
//   import CalculatorSEOContent from "@/components/CalculatorSEOContent";
//   import { nominaContent } from "@/content/calculadoras/nomina";
//   ...
//   <CalculadoraNomina />
//   <CalculatorSEOContent content={nominaContent} />
//
// El componente ya incluye el schema.org FAQPage (JSON-LD) para intentar
// conseguir "rich results" / featured snippets en Google.

import type { CalculatorContent } from "@/content/calculadoras/types";

export default function CalculatorSEOContent({
  content,
}: {
  content: CalculatorContent;
}) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12 prose prose-slate">
      <p className="text-sm text-slate-500 mb-8">
        Contenido actualizado: {content.lastUpdated}
      </p>

      {/* Introducción */}
      <p className="text-lg leading-relaxed">{content.intro}</p>

      {/* Metodología */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        {content.methodologyTitle}
      </h2>
      {content.methodologyParagraphs.map((p, i) => (
        <p key={i} className="leading-relaxed mb-4">
          {p}
        </p>
      ))}

      {/* Ejemplo práctico */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        {content.exampleTitle}
      </h2>
      <p className="leading-relaxed mb-4">{content.exampleIntro}</p>

      <div className="overflow-x-auto not-prose mb-4">
        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <tbody>
            {content.exampleTable.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-slate-50" : "bg-white"}
              >
                <td className="px-4 py-2 font-medium text-slate-700 border-b border-slate-100">
                  {row.label}
                </td>
                <td className="px-4 py-2 text-right border-b border-slate-100">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed mb-4">{content.exampleConclusion}</p>

      {/* FAQ */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Preguntas frecuentes
      </h2>
      <div className="space-y-4 not-prose">
        {content.faqs.map((faq, i) => (
          <details
            key={i}
            className="border border-slate-200 rounded-lg p-4 group"
          >
            <summary className="font-medium cursor-pointer text-slate-800">
              {faq.question}
            </summary>
            <p className="mt-2 text-slate-600 leading-relaxed">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>

      {/* Enlaces internos */}
      <div className="grid sm:grid-cols-2 gap-8 mt-10 not-prose">
        {content.relatedCalculators.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Calculadoras relacionadas
            </h3>
            <ul className="space-y-1">
              {content.relatedCalculators.map((c) => (
                <li key={c.href}>
                  <a
                    href={c.href}
                    className="text-blue-700 hover:underline text-sm"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {content.relatedArticles.length > 0 && (
          <div>
            <h3 className="font-semibold text-slate-800 mb-2">
              Artículos relacionados
            </h3>
            <ul className="space-y-1">
              {content.relatedArticles.map((a) => (
                <li key={a.href}>
                  <a
                    href={a.href}
                    className="text-blue-700 hover:underline text-sm"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {content.disclaimer && (
        <p className="text-xs text-slate-400 mt-10 border-t border-slate-100 pt-4">
          {content.disclaimer}
        </p>
      )}

      {/* JSON-LD para rich results de Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </section>
  );
}

// content/calculadoras/nomina.ts
import type { CalculatorContent } from "./types";

export const nominaContent: CalculatorContent = {
  slug: "nomina",
  title: "Calculadora de Nómina 2026",
  lastUpdated: "Agosto 2026",

  intro:
    "Saber cuánto vas a cobrar realmente cada mes es una de las dudas más habituales de cualquier trabajador en España, ya sea antes de firmar un contrato, al negociar un aumento de sueldo o simplemente para entender por qué tu salario neto es menor que el bruto que aparece en tu contrato. La diferencia entre el salario bruto y el neto depende de varios factores: tus retenciones de Seguridad Social, tu tramo de IRPF, tu situación familiar y el convenio colectivo que te aplique. Esta calculadora te permite convertir tu salario bruto anual o mensual en el neto real que verás en tu cuenta bancaria, con el desglose completo de cada deducción.",

  methodologyTitle: "¿Cómo se calcula el salario neto a partir del bruto?",
  methodologyParagraphs: [
    "El cálculo parte siempre del salario bruto anual, es decir, la cantidad total que figura en tu contrato antes de cualquier descuento. A ese importe se le restan dos grandes bloques: las cotizaciones a la Seguridad Social y la retención de IRPF.",
    "Las cotizaciones a la Seguridad Social en 2026 rondan el 6,4% del salario bruto para el trabajador (contingencias comunes, desempleo, formación profesional y el mecanismo de equidad intergeneracional, MEI). Existe además un tope máximo de cotización, por lo que a partir de cierto salario bruto anual el porcentaje efectivo de cotización disminuye ligeramente al superarse la base máxima.",
    "La retención de IRPF, en cambio, no es un porcentaje fijo: se calcula de forma progresiva según tramos de renta, y varía según tu situación personal y familiar (soltero, casado, con hijos a cargo, con discapacidad, etc.). Hacienda publica cada año unas tablas de retenciones que las empresas están obligadas a aplicar, y que tienen en cuenta tanto tu salario anual estimado como tus circunstancias personales declaradas en el modelo 145.",
    "El resultado final —tu salario neto— es el bruto anual menos la suma de ambas deducciones, dividido entre el número de pagas que recibas (12, 14 si tienes pagas extra no prorrateadas, o las que establezca tu convenio).",
  ],

  exampleTitle: "Ejemplo práctico: 25.000€ brutos anuales",
  exampleIntro:
    "Veamos un caso real para un trabajador soltero, sin hijos, con un salario bruto anual de 25.000€ en 2026, cobrado en 12 pagas:",
  exampleTable: [
    { label: "Salario bruto anual", value: "25.000 €" },
    { label: "Cotización Seguridad Social (6,4%)", value: "-1.600 €" },
    { label: "Base sujeta a IRPF", value: "23.400 €" },
    { label: "Retención IRPF estimada (~14%)", value: "-3.500 €" },
    { label: "Salario neto anual", value: "19.900 €" },
    { label: "Salario neto mensual (12 pagas)", value: "≈ 1.658 €" },
  ],
  exampleConclusion:
    "Como puedes ver, de un bruto de 25.000€ anuales, el trabajador recibe realmente unos 19.900€ al año, casi un 20% menos. Este porcentaje de descuento aumenta a medida que sube el salario bruto, porque el IRPF es progresivo: a más ingresos, mayor porcentaje de retención.",

  faqs: [
    {
      question: "¿Por qué mi nómina no coincide exactamente con esta calculadora?",
      answer:
        "Esta herramienta ofrece una estimación basada en las tablas generales de 2026. Tu nómina real puede variar ligeramente según tu convenio colectivo, complementos salariales, pagas extra prorrateadas o no, y circunstancias personales concretas como número de hijos, pensión compensatoria o grado de discapacidad, que Hacienda tiene en cuenta para ajustar el porcentaje de retención.",
    },
    {
      question: "¿Qué diferencia hay entre salario bruto y salario neto?",
      answer:
        "El salario bruto es el importe total que aparece en tu contrato de trabajo, antes de cualquier descuento. El salario neto es lo que realmente ingresas en tu cuenta bancaria cada mes, una vez restadas las cotizaciones a la Seguridad Social y la retención de IRPF.",
    },
    {
      question: "¿Las pagas extra también tienen retención?",
      answer:
        "Sí. Tanto si las pagas extra están prorrateadas mes a mes como si se cobran de forma independiente en verano y Navidad, están sujetas tanto a cotización a la Seguridad Social como a retención de IRPF, igual que cualquier otra mensualidad.",
    },
    {
      question: "¿Tener hijos reduce la retención de IRPF en la nómina?",
      answer:
        "Sí. Declarar hijos a cargo en el modelo 145 que entregas a tu empresa reduce el porcentaje de retención de IRPF que se aplica en cada nómina, ya que Hacienda aplica un mínimo familiar más alto cuanto mayor es el número de descendientes.",
    },
    {
      question: "¿Qué es el MEI y por qué aparece descontado en mi nómina?",
      answer:
        "El Mecanismo de Equidad Intergeneracional (MEI) es una cotización adicional destinada a reforzar la Seguridad Social ante el reto demográfico del envejecimiento poblacional. Se aplica desde 2023 y afecta tanto al trabajador como a la empresa, aunque en un porcentaje mucho menor para el primero.",
    },
    {
      question: "¿Cómo afecta un contrato temporal o a tiempo parcial al cálculo?",
      answer:
        "Los porcentajes de cotización a la Seguridad Social son los mismos independientemente del tipo de contrato. Lo que sí varía es el salario bruto anual sobre el que se calcula todo: en un contrato a tiempo parcial, el bruto anual será proporcional a la jornada, lo que normalmente sitúa al trabajador en un tramo de IRPF más bajo.",
    },
  ],

  relatedCalculators: [
    { label: "Calculadora de Finiquito", href: "/calculadora/finiquito" },
    { label: "Calculadora de IRPF", href: "/calculadora/irpf" },
    {
      label: "Calculadora de Indemnización por Despido",
      href: "/calculadora/indemnizacion",
    },
    {
      label: "Calculadora de Coste de Empleado para la Empresa",
      href: "/calculadora/coste-empresa",
    },
  ],
  relatedArticles: [
    {
      label: "Cómo leer tu nómina: guía completa 2026",
      href: "/blog/como-leer-tu-nomina",
    },
    {
      label: "Cómo funcionan los tramos del IRPF",
      href: "/blog/como-funciona-irpf-tramos",
    },
  ],

  disclaimer:
    "Los cálculos de esta página son orientativos y se basan en las tablas generales de retención de IRPF y cotización a la Seguridad Social vigentes en 2026. No sustituyen el asesoramiento de un gestor laboral ni el cálculo exacto que realiza tu departamento de recursos humanos.",
};

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
