import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'
import { calculators } from '@/lib/calculators'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: `Quién está detrás de ${siteConfig.nombreSitio} y cómo verificamos cada calculadora.`,
  robots: { index: true, follow: true },
  alternates: { canonical: '/sobre-nosotros' },
}

export default function SobreNosotrosPage() {
  const numCalculadoras = Object.keys(calculators).length

  return (
    <main className="container-page py-12">
      <article className="prose dark:prose-invert max-w-3xl">
        <h1>Sobre {siteConfig.nombreSitio}</h1>

        <h2>Quién está detrás</h2>
        <div className="not-prose flex items-start gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <div className="h-16 w-16 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div>
            <p className="font-semibold">{siteConfig.autor.nombre}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{siteConfig.autor.bio}</p>
          </div>
        </div>
        <p>
          {siteConfig.nombreSitio} nació de una necesidad muy concreta: poder calcular en segundos
          cuánto cobrarías de una nómina, cuánto pagarías de IRPF o qué cuota tendría una hipoteca,
          sin tener que rellenar formularios interminables en la sede electrónica correspondiente.
          Lo que empezó como un proyecto pequeño ha crecido hasta convertirse en una colección de{' '}
          {numCalculadoras} calculadoras gratuitas que cubren nómina, fiscalidad, hipotecas,
          préstamos, ahorro, vehículos y empresas en España.
        </p>
        <p>
          Revisamos y actualizamos cada calculadora, cada texto explicativo y cada dato de esta web
          nosotros mismos. Si tienes alguna duda o encuentras algo que no cuadra, escríbenos a{' '}
          {siteConfig.emailContacto}.
        </p>

        <h2>Por qué existe esta web</h2>
        <p>
          Cuando necesitas saber una cifra concreta en España (cuánto cobrarás en neto, cuánto
          pagarás de IRPF, qué cuota tendría un préstamo), sueles encontrarte con tres opciones
          poco satisfactorias. Las calculadoras oficiales de la Administración son fiables, pero
          suelen ser difíciles de usar: campos sin explicar, formularios largos y poca adaptación
          al móvil. Los comparadores comerciales tienen mejor diseño, pero casi siempre están
          pensados para venderte un producto financiero al final del proceso. Y una búsqueda en
          Google te da la fórmula, pero no te hace el cálculo.
        </p>
        <p>
          La idea detrás de {siteConfig.nombreSitio} es sencilla: herramientas ligeras y gratuitas,
          sin necesidad de registrarte, con la fórmula y la fuente explicadas junto al resultado
          para que puedas comprobarlo tú mismo. Si solo necesitas un número, lo tienes en segundos.
          Si quieres entender de dónde sale, tienes la explicación justo al lado.
        </p>
        <p>
          Esta web se financia con publicidad. La publicidad no influye nunca en los cálculos ni
          en las recomendaciones, y los anuncios están siempre bien diferenciados del contenido.
        </p>

        <h2>Cómo construimos y revisamos cada calculadora</h2>
        <p>Cada calculadora pasa por el mismo proceso antes de publicarse:</p>
        <ol>
          <li>
            <strong>Investigación de fuentes oficiales.</strong> Antes de escribir una sola línea
            de código reunimos la normativa aplicable: el BOE, la Seguridad Social, la Agencia
            Tributaria o el organismo competente según el tema.
          </li>
          <li>
            <strong>Implementación y validación.</strong> La lógica de cálculo se contrasta contra
            casos conocidos hasta que la cifra cuadra.
          </li>
          <li>
            <strong>Revisión periódica.</strong> Revisamos con regularidad si los importes,
            porcentajes y tramos siguen vigentes.
          </li>
          <li>
            <strong>Actualización ante cambios normativos.</strong> Cuando cambia una ley, el
            IRPF, el SMI o un tipo de cotización, actualizamos todas las calculadoras afectadas.
          </li>
        </ol>
        <p>
          El detalle completo de nuestro proceso está en la página de{' '}
          <Link href="/metodologia">Metodología</Link>.
        </p>
        <p>
          Aun así, ninguna calculadora sustituye el asesoramiento de un gestor, abogado o asesor
          fiscal en casos complejos (autónomos, ingresos en el extranjero, situaciones familiares
          atípicas). El objetivo es darte una primera orientación fiable, no sustituir una
          consulta profesional.
        </p>

        <h2>¿Encontraste un error?</h2>
        <p>
          Si detectas un fallo en algún cálculo o quieres proponer una calculadora nueva,
          escríbenos a {siteConfig.emailContacto} indicando el nombre de la calculadora y el
          problema que has encontrado, o desde nuestra <Link href="/contacto">página de contacto</Link>.
        </p>
      </article>
    </main>
  )
}
