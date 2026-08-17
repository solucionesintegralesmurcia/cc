# Plataforma de Calculadoras — Fase 1: Arquitectura Completa

## 0. Enfoque de trabajo

Vamos a avanzar en fases, cada una cerrada antes de pasar a la siguiente:

1. **Arquitectura completa** (este documento)
2. Estructura de carpetas (repo real)
3. Base de datos en Supabase (schema + migraciones + RLS)
4. Sistema de diseño y componentes base
5. Motor SEO (metadata, JSON-LD, sitemap, breadcrumbs)
6. Calculadoras, una por una (empezando por Nómina)
7. Blog
8. Panel Admin
9. Monetización
10. Seguridad y rendimiento (hardening final)

No pasamos a la fase 2 hasta que valides esta.

---

## 1. Decisiones de stack (y por qué)

| Capa | Elección | Justificación |
|---|---|---|
| Framework | Next.js 15 (App Router) | RSC + streaming + ISR nativo, mejor Core Web Vitals que Pages Router |
| Lenguaje | TypeScript estricto | Cientos de calculadoras con fórmulas distintas → tipado evita errores silenciosos |
| Estilos | Tailwind CSS + CSS variables para temas | Velocidad de desarrollo, tree-shaking, dark mode sin JS extra |
| UI primitives | Radix UI (headless) | Accesibilidad gratis, sin peso visual impuesto |
| Base de datos | Supabase (Postgres) | Auth + DB + Storage + Edge Functions en un solo proveedor, RLS nativo |
| ORM | Drizzle ORM | Tipado end-to-end con Postgres, mejor que Prisma en cold start (importante en Edge) |
| Hosting | Vercel | ISR, Edge Middleware y Image Optimization nativos |
| Validación | Zod | Valida inputs de cada calculadora y los payloads del admin |
| Estado formularios | React Hook Form + Zod resolver | Cálculos reactivos sin re-renders innecesarios |
| Analítica | Vercel Analytics + Plausible/GA4 | Core Web Vitals reales + eventos de conversión (uso de calculadora) |
| PDF | @react-pdf/renderer (server-side) | Generar el PDF de resultados sin cargar librerías pesadas en cliente |
| Email | Resend | Newsletter y captación transaccional, buena integración con React Email |

**Decisión clave que propongo y justifico:** en lugar de una tabla `calculators` genérica con un campo JSON de "fórmula dinámica" interpretada en runtime, cada calculadora es un **módulo de código** (`lib/calculators/nomina.ts`) registrado en un índice, y la tabla en Supabase solo guarda **contenido editable** (textos, FAQs, SEO, tablas fiscales). Motivo: las fórmulas fiscales/laborales españolas tienen lógica condicional compleja (tramos IRPF, bases de cotización, topes) que en JSON dinámico sería frágil, lenta de auditar y peligrosa (errores de cálculo = pérdida de confianza total en el sitio). El contenido sí vive en BD porque cambia con frecuencia y lo edita el equipo de contenido, no un dev.

---

## 2. Arquitectura de renderizado

| Tipo de página | Estrategia | Revalidación |
|---|---|---|
| Home | ISR | 1h |
| Categoría (`/categoria/laboral`) | ISR | 1h |
| Calculadora (`/calculadora/nomina`) | ISR | 6h (o on-demand al editar en admin) |
| Artículo de blog | ISR | 12h |
| Resultado compartido (`/r/[id]`) | SSR dinámico | — |
| Panel Admin | SSR + Auth (Server Actions) | — |
| Sitemap.xml | Route Handler, generado on-demand desde BD | cacheado 1h |

El propio cálculo (la interacción del usuario moviendo sliders/inputs) ocurre 100% en cliente, sin llamada al servidor — la calculadora es un Client Component ligero hidratado sobre un Server Component que trae el contenido SEO/textual ya renderizado. Esto separa "contenido indexable" (SSR/ISR) de "interactividad" (CSR), maximizando tanto SEO como Core Web Vitals.

---

## 3. Estructura de URLs (clave para SEO)

```
/                                   → home
/calculadora/[slug]                 → cada calculadora (ej: /calculadora/nomina)
/categoria/[slug]                   → listado por categoría (ej: /categoria/laboral)
/blog                                → índice blog
/blog/[slug]                        → artículo
/glosario/[termino]                 → páginas de definición (long-tail SEO)
/comparador/[slug]                  → futuras páginas comparativas (ej: hipoteca-fija-vs-variable)
/r/[resultId]                       → resultado compartible (og:image dinámica)
/admin/...                          → panel privado, noindex
```

Cada calculadora es **una sola URL canónica** con secciones ancladas (`#formula`, `#ejemplos`, `#faq`) en vez de subpáginas, para concentrar autoridad SEO en una sola página fuerte — pero el índice interno permite generar variantes long-tail (`/calculadora/nomina/andalucia`, `/calculadora/nomina/2026`) cuando el volumen de búsqueda lo justifique, reutilizando el mismo motor de cálculo con distinta configuración fiscal.

---

## 4. Motor SEO automático

Un único módulo `lib/seo/generate.ts` construye, a partir de los datos de una calculadora en BD:

- `generateMetadata()` de Next.js → title, description, canonical, OG, Twitter Card
- JSON-LD: `SoftwareApplication` (la calculadora en sí), `FAQPage`, `Article`, `BreadcrumbList`
- Slug validado y normalizado (sin tildes, minúsculas, guiones)
- Enlaces internos automáticos: cada calculadora referencia otras 3-5 relacionadas por categoría/tags, y artículos de blog que la citan

Esto se calcula una vez y se cachea, no en cada request.

---

## 5. Componentes core reutilizables

- `<CalculatorShell>`: layout común (título, breadcrumbs, tabla de contenidos, compartir, PDF, imprimir)
- `<CalculatorForm>`: inputs tipados por Zod schema de cada calculadora
- `<ResultCard>`: resultado + desglose
- `<FAQAccordion>`: renderiza FAQ + inyecta su Schema.org
- `<RelatedCalculators>` / `<RelatedArticles>`
- `<ShareButtons>` / `<PdfExportButton>` / `<PrintButton>`
- `<AdSlot>`: wrapper de anuncios lazy-loaded, con reserva de espacio (evita CLS)

---

## 6. Seguridad y rendimiento (resumen, se detalla en fase 10)

- Middleware de Next.js: rate limiting (Upstash Redis), headers de seguridad (CSP, HSTS, X-Frame-Options), bot protection en formularios (Cloudflare Turnstile en newsletter/admin)
- RLS en Supabase: contenido público de solo lectura anónima; escritura solo con rol `admin`/`editor`
- Imágenes: `next/image` + AVIF/WebP
- Fuentes: `next/font` autohospedadas (sin bloqueo de render)
- Code splitting por calculadora (cada una es un chunk independiente, no se carga el motor de las 60 calculadoras en cada visita)

---

## 7. Roadmap de fases siguientes (propuesta de orden)

1. Estructura de carpetas del repo
2. Schema completo de Supabase (con las tablas que pediste: users, calculators, results, articles, categories, faqs, settings, tax_tables) + RLS
3. Sistema de diseño (tokens, dark mode, componentes base)
4. Motor SEO (metadata + JSON-LD reales, sitemap, robots.txt)
5. Primera calculadora completa de extremo a extremo: **Nómina** (sirve de plantilla para las siguientes 19)
6. Resto de calculadoras laborales/fiscales
7. Blog
8. Admin panel
9. Monetización (AdSense, newsletter, PDF premium)
10. Hardening de seguridad + auditoría Lighthouse

---

## ¿Apruebo esta arquitectura?

Antes de escribir una sola carpeta, confírmame o ajusta:

1. ¿Drizzle ORM te parece bien, o prefieres Prisma (más popular, algo más pesado)?
2. ¿Autenticación de usuarios finales (no solo admin) desde ya, o la dejamos para cuando haya "cuenta de usuario" con historial de cálculos?
3. ¿Empezamos literalmente por la calculadora de **Nómina** como plantilla, tal como está en tu lista?
