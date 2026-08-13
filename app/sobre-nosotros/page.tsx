import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: `Quiénes somos y por qué creamos ${siteConfig.nombreSitio}.`,
  robots: { index: true, follow: true },
  alternates: { canonical: '/sobre-nosotros' },
}

export default function SobreNosotrosPage() {
  return (
    <main className="container-page py-12">
      <article className="prose dark:prose-invert max-w-3xl">
        <h1>Sobre {siteConfig.nombreSitio}</h1>

        <p>
          {siteConfig.nombreSitio} nace con un objetivo simple: reunir en un solo sitio las
          calculadoras de nómina, fiscalidad, hipotecas y finanzas personales que en España están
          repartidas en decenas de webs distintas, con fórmulas actualizadas y explicadas paso a
          paso, sin necesidad de registrarte ni de buscar entre anuncios intrusivos para encontrar
          el resultado.
        </p>

        <h2>Nuestro criterio</h2>
        <ul>
          <li>Cada calculadora indica la fecha de su última actualización.</li>
          <li>
            Documentamos las fórmulas y fuentes normativas (tramos de IRPF, tipos de cotización a
            la Seguridad Social) que usamos en cada cálculo.
          </li>
          <li>
            Todos los resultados son estimaciones orientativas: lo decimos explícitamente en cada
            calculadora, porque preferimos ser claros a prometer una precisión que no podemos
            garantizar sin conocer tu caso completo.
          </li>
        </ul>

        <h2>Quién hay detrás</h2>
        <div className="not-prose flex items-start gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <div className="h-16 w-16 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div>
            <p className="font-semibold">{siteConfig.autor.nombre}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{siteConfig.autor.bio}</p>
          </div>
        </div>

        <h2>Contacto</h2>
        <p>
          ¿Detectas un error en algún cálculo o quieres proponer una calculadora nueva? Escríbenos
          a {siteConfig.emailContacto} o visita nuestra <a href="/contacto">página de contacto</a>.
        </p>
      </article>
    </main>
  )
}
