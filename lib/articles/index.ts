export interface Article {
  slug: string
  title: string
  seoTitle: string
  metaDescription: string
  excerpt: string
  content: string[]           // párrafos, para poder mapearlos sin dangerouslySetInnerHTML
  relatedCalculatorSlugs: string[]
  updatedAt: string
}

export const articles: Article[] = [
  {
    slug: 'como-leer-tu-nomina',
    title: 'Cómo leer tu nómina: guía completa 2026',
    seoTitle: 'Cómo Leer tu Nómina Paso a Paso (Guía 2026)',
    metaDescription:
      'Aprende a interpretar cada apartado de tu nómina: devengos, deducciones, bases de cotización y retención de IRPF, con ejemplos reales.',
    excerpt:
      'Tu nómina tiene tres bloques clave: devengos, deducciones y bases de cotización. Te explicamos qué significa cada línea.',
    content: [
      'Una nómina en España se divide siempre en tres grandes bloques: los devengos (todo lo que la empresa te paga), las deducciones (lo que se te resta) y las bases de cotización (sobre las que se calculan esas deducciones).',
      'En los devengos encontrarás el salario base, los complementos (antigüedad, puesto, idiomas...) y, si corresponde ese mes, la parte proporcional de las pagas extra.',
      'En las deducciones aparecen las cotizaciones a la Seguridad Social a cargo del trabajador (contingencias comunes, desempleo y formación profesional) y la retención a cuenta del IRPF, que varía según tu salario y tu situación familiar.',
      'Si quieres ver estos cálculos aplicados a tu caso concreto, puedes usar la calculadora de nómina para obtener tu salario neto estimado a partir del bruto.',
      'Y si tu relación laboral termina, esos mismos conceptos (salario pendiente, vacaciones no disfrutadas y parte proporcional de pagas extra) forman la base de tu finiquito.',
    ],
    relatedCalculatorSlugs: ['nomina', 'finiquito'],
    updatedAt: '2026-01-05',
  },
  {
    slug: 'diferencia-despido-improcedente-objetivo',
    title: 'Despido improcedente vs. objetivo: diferencias y qué indemnización te corresponde',
    seoTitle: 'Despido Improcedente vs Objetivo: Diferencias e Indemnización 2026',
    metaDescription:
      'Entiende la diferencia entre despido improcedente y objetivo, y cuánta indemnización corresponde en cada caso según tu antigüedad.',
    excerpt:
      'No todos los despidos se indemnizan igual. La diferencia entre 20 y 33 días por año puede suponer miles de euros.',
    content: [
      'El despido objetivo se produce por causas económicas, técnicas, organizativas o de producción debidamente justificadas por la empresa, y da derecho a una indemnización de 20 días de salario por año trabajado, con un máximo de 12 mensualidades.',
      'El despido improcedente ocurre cuando el despido no cumple los requisitos legales o de forma, o cuando la empresa no logra justificar la causa alegada. En ese caso, la indemnización sube a 33 días de salario por año trabajado (para contratos posteriores a 2012), con un tope de 24 mensualidades.',
      'La diferencia entre ambos escenarios puede ser muy significativa en términos económicos, especialmente con antigüedades largas, por lo que conviene entender bien en qué categoría cae tu situación.',
      'Puedes estimar el importe exacto que te correspondería en cada escenario con la calculadora de indemnización por despido.',
    ],
    relatedCalculatorSlugs: ['indemnizacion', 'nomina'],
    updatedAt: '2026-01-08',
  },
  {
    slug: 'como-funciona-irpf-tramos',
    title: 'Cómo funcionan los tramos del IRPF: por qué subir de tramo no te perjudica',
    seoTitle: 'Tramos del IRPF 2026 Explicados: Cómo se Calcula Realmente',
    metaDescription:
      'Explicamos con un ejemplo numérico cómo funciona la progresividad del IRPF por tramos, y por qué ganar más nunca hace que cobres menos en neto.',
    excerpt:
      'Mucha gente cree que "subir de tramo" te hace cobrar menos. Es un mito. Te explicamos por qué con números reales.',
    content: [
      'Existe la creencia extendida de que si tu salario sube y "entras en el siguiente tramo de IRPF", vas a cobrar menos en neto que antes de la subida. Esto es matemáticamente imposible en un sistema progresivo bien diseñado, y España lo es.',
      'La clave está en que los tramos del IRPF no se aplican sobre la totalidad de tu renta, sino solo sobre la parte que cae dentro de cada tramo. Por ejemplo, si tu base liquidable son 25.000€, no pagas el 30% (tipo del tramo de 20.200€ a 35.200€) sobre los 25.000€ completos. Pagas el 19% sobre los primeros 12.450€, el 24% sobre el tramo de 12.450€ a 20.200€, y solo el 30% sobre los 4.800€ restantes que superan los 20.200€.',
      'Esto significa que un aumento de sueldo, aunque te haga entrar en un tramo superior, siempre se traduce en más dinero neto en el bolsillo, nunca en menos. Lo que cambia es el tipo marginal (el porcentaje que pagas por el próximo euro que ganes), no el tipo medio de toda tu renta.',
      'Puedes ver este cálculo aplicado a tu situación exacta, con el desglose completo por tramos, en la calculadora de IRPF.',
      'Si lo que quieres es ver el efecto directo en tu nómina mensual, la calculadora de nómina te da el neto ya con las retenciones aplicadas.',
    ],
    relatedCalculatorSlugs: ['irpf', 'nomina'],
    updatedAt: '2026-01-12',
  },
  {
    slug: 'iva-tipos-reducido-superreducido',
    title: 'IVA general, reducido y superreducido: qué tipo se aplica a cada producto',
    seoTitle: 'Tipos de IVA en España 2026: 21%, 10% y 4% Explicados',
    metaDescription:
      'Guía práctica de los tres tipos de IVA vigentes en España: qué productos y servicios llevan cada porcentaje y cómo calcularlo correctamente.',
    excerpt:
      'No todo lleva el 21%. Repasamos qué productos y servicios llevan el tipo reducido y el superreducido, y por qué importa saberlo.',
    content: [
      'En España conviven tres tipos de IVA: el general del 21%, el reducido del 10% y el superreducido del 4%. Aplicar el tipo equivocado en una factura es un error común, especialmente entre autónomos y pequeños negocios que empiezan.',
      'El tipo general (21%) se aplica por defecto a la mayoría de bienes y servicios que no tienen una excepción específica: electrónica, ropa, servicios profesionales generales, combustible, etc.',
      'El tipo reducido (10%) cubre, entre otros, la alimentación en general, el transporte de viajeros, la hostelería y restauración, y ciertos servicios de reforma de vivienda para uso particular.',
      'El tipo superreducido (4%) se reserva para productos considerados de primera necesidad: pan, leche, huevos, frutas, verduras, libros, periódicos y medicamentos para uso humano.',
      'Si necesitas calcular rápidamente cuánto IVA corresponde a un importe, en cualquiera de los dos sentidos (añadirlo a un precio sin IVA o desglosarlo de un precio final), puedes usar la calculadora de IVA.',
    ],
    relatedCalculatorSlugs: ['iva'],
    updatedAt: '2026-01-15',
  },
  {
    slug: 'hipoteca-fija-vs-variable',
    title: 'Hipoteca a tipo fijo o variable: qué diferencia hay y cómo elegir',
    seoTitle: 'Hipoteca Fija vs Variable 2026: Diferencias y Cómo Elegir',
    metaDescription:
      'Comparamos hipoteca fija y variable: cómo se calcula la cuota en cada caso, qué riesgos asume el hipotecado y cuándo conviene cada opción.',
    excerpt:
      'La diferencia no es solo el tipo de interés: es quién asume el riesgo si el mercado cambia. Te lo explicamos con ejemplos.',
    content: [
      'En una hipoteca a tipo fijo, el interés se pacta al inicio y no cambia durante toda la vida del préstamo, sin importar lo que haga el mercado. Esto da certeza total: sabes exactamente cuánto vas a pagar cada mes durante 20 o 30 años.',
      'En una hipoteca a tipo variable, el interés se compone de un diferencial fijo más un índice de referencia (normalmente el Euríbor), que se revisa cada 6 o 12 meses. Si el Euríbor sube, tu cuota sube; si baja, tu cuota baja.',
      'Históricamente, las hipotecas variables han salido más baratas a largo plazo en la mayoría de periodos, pero a cambio de asumir el riesgo de subidas de tipos, que pueden ser significativas en periodos de inflación alta, como se vio en 2022-2023.',
      'La hipoteca fija suele partir de un tipo de interés algo más alto que el variable en el momento de la firma, como "prima" por la certeza que ofrece.',
      'Sea cual sea tu caso, puedes calcular la cuota mensual exacta con el tipo de interés que estás valorando (fijo o el tipo actual si es variable) en la calculadora de hipoteca, para comparar escenarios antes de firmar.',
    ],
    relatedCalculatorSlugs: ['hipoteca', 'prestamo'],
    updatedAt: '2026-01-18',
  },
  {
    slug: 'como-funciona-interes-compuesto',
    title: 'Interés compuesto: por qué Einstein lo llamó "la octava maravilla del mundo"',
    seoTitle: 'Interés Compuesto Explicado: Cómo Hacer Crecer tus Ahorros',
    metaDescription:
      'Qué es el interés compuesto, en qué se diferencia del interés simple, y cómo un pequeño ahorro mensual puede convertirse en un capital relevante a largo plazo.',
    excerpt:
      'La diferencia entre interés simple y compuesto parece pequeña al principio, pero se dispara con el tiempo. Te lo mostramos con números.',
    content: [
      'El interés simple se calcula siempre sobre el capital inicial: si inviertes 1.000€ al 5% anual, ganas 50€ cada año, siempre sobre esos mismos 1.000€ iniciales.',
      'El interés compuesto, en cambio, se calcula sobre el capital inicial más los intereses ya acumulados. Así, en el segundo año no ganas el 5% sobre 1.000€, sino sobre 1.050€, y así sucesivamente. La diferencia parece pequeña al principio, pero crece de forma exponencial con el tiempo.',
      'Por ejemplo, 10.000€ invertidos al 6% anual durante 20 años se convierten en unos 32.000€ con interés compuesto, frente a los 22.000€ que darían con interés simple. La diferencia (10.000€) es puro efecto de la capitalización de intereses sobre intereses.',
      'Este efecto se multiplica todavía más si añades aportaciones periódicas (por ejemplo, una aportación mensual constante), porque cada aportación nueva también empieza a generar sus propios intereses compuestos desde el momento en que se realiza.',
      'Puedes simular tu propio caso, con aportación inicial, aportación mensual y horizonte temporal, en la calculadora de ahorro.',
    ],
    relatedCalculatorSlugs: ['ahorro'],
    updatedAt: '2026-01-21',
  },
  {
    slug: 'cuanto-cuesta-realmente-un-prestamo',
    title: 'Cuánto cuesta realmente un préstamo: TIN, TAE y comisiones explicadas',
    seoTitle: 'TIN vs TAE en Préstamos 2026: Qué Significan y Por Qué Importan',
    metaDescription:
      'Entiende la diferencia entre TIN y TAE en un préstamo personal, y por qué la comisión de apertura puede cambiar mucho el coste real del crédito.',
    excerpt:
      'Dos préstamos con el mismo TIN pueden costarte cantidades muy distintas según las comisiones. Te explicamos qué mirar antes de firmar.',
    content: [
      'El TIN (Tipo de Interés Nominal) es el porcentaje de interés puro que se aplica al capital prestado, y es el que se usa para calcular la cuota mensual mes a mes.',
      'La TAE (Tasa Anual Equivalente) incluye, además del TIN, las comisiones asociadas al préstamo (como la comisión de apertura) y otros gastos, expresados de forma anualizada. Por ley, la TAE es el dato que mejor refleja el coste real de un préstamo, y es el que deberías comparar entre distintas ofertas, no solo el TIN.',
      'Un préstamo con TIN del 7% y comisión de apertura del 2% puede acabar costando más en total que otro con TIN del 7,5% y sin comisión de apertura, dependiendo del importe y del plazo. Por eso comparar solo el TIN puede llevar a una decisión equivocada.',
      'La comisión de apertura se cobra normalmente una única vez, al formalizar el préstamo, como un porcentaje sobre el capital prestado.',
      'Para ver el coste total real de un préstamo, incluyendo la comisión de apertura sobre el capital y el total de intereses a lo largo del plazo, puedes usar la calculadora de préstamo personal.',
    ],
    relatedCalculatorSlugs: ['prestamo', 'hipoteca'],
    updatedAt: '2026-01-24',
  },
]

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug) ?? null
}

export function getAllArticleSlugs() {
  return articles.map((a) => a.slug)
}
