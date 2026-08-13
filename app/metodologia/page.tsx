import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Metodología',
  description: 'Cómo verificamos las fórmulas y datos de nuestras calculadoras.',
  robots: { index: true, follow: true },
  alternates: { canonical: '/metodologia' },
}

export default function MetodologiaPage() {
  return (
    <main className="container-page py-12">
      <article className="prose dark:prose-invert max-w-3xl">
        <h1>Metodología</h1>
        <p className="text-sm text-slate-500">
          Última actualización: {siteConfig.ultimaRevisionLegal}
        </p>

        <p>
          Esta página explica de dónde salen los datos y fórmulas que usamos en cada calculadora,
          para que puedas verificarlos tú mismo.
        </p>

        <h2>Fuentes que usamos</h2>
        <ul>
          <li>Tramos y tipos de IRPF: normativa estatal vigente publicada en el BOE.</li>
          <li>
            Tipos de cotización a la Seguridad Social (trabajador y empresa): valores oficiales
            publicados por la Tesorería General de la Seguridad Social.
          </li>
          <li>
            Indemnizaciones por despido: Estatuto de los Trabajadores (días por año según tipo de
            despido y topes en mensualidades).
          </li>
          <li>Tipos de IVA: Ley del IVA (Ley 37/1992) y sus actualizaciones.</li>
        </ul>

        <h2>Cómo verificamos cada calculadora</h2>
        <ol>
          <li>Contrastamos la fórmula con el texto normativo vigente, no con artículos de terceros.</li>
          <li>
            Probamos el resultado con casos conocidos (por ejemplo, salarios de referencia con
            resultado ya publicado por fuentes oficiales) para detectar errores de cálculo.
          </li>
          <li>
            Revisamos casos extremos: valores mínimos, máximos, y combinaciones poco habituales de
            los campos del formulario.
          </li>
          <li>Actualizamos cada calculadora cuando cambia la normativa aplicable.</li>
        </ol>

        <h2>Simplificaciones conocidas</h2>
        <p>
          Algunas calculadoras usan aproximaciones explícitas cuando el cálculo exacto requeriría
          datos que no es razonable pedir en un formulario simple. Por ejemplo:
        </p>
        <ul>
          <li>
            El ajuste por comunidad autónoma en la calculadora de nómina es orientativo; las
            escalas autonómicas completas varían cada año y por tramos propios de cada región.
          </li>
          <li>
            País Vasco y Navarra tienen regímenes forales con cálculo de IRPF distinto al del
            resto de España, que nuestras calculadoras no reproducen al detalle.
          </li>
          <li>
            La cotización por accidentes de trabajo (a cargo de la empresa) depende del código
            CNAE de la actividad; usamos un valor medio orientativo.
          </li>
        </ul>
        <p>
          Cuando existe una simplificación relevante, lo indicamos en las preguntas frecuentes de
          la calculadora correspondiente.
        </p>

        <h2>Reportar un error</h2>
        <p>
          Si detectas un dato desactualizado o un error de cálculo, escríbenos a{' '}
          {siteConfig.emailContacto} o desde la <Link href="/contacto">página de contacto</Link>.
          Corregimos los errores reportados con prioridad.
        </p>
      </article>
    </main>
  )
}
