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
