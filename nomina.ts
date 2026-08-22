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
