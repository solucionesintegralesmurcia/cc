import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Sobre Nosotros',
  description: `Qué hacemos, cómo verificamos nuestros datos y cómo nos financiamos en ${siteConfig.nombreSitio}.`,
  robots: { index: true, follow: true },
  alternates: { canonical: '/sobre-nosotros' },
}

export default function SobreNosotrosPage() {
  return (
    <main className="container-page py-12">
      <article className="prose dark:prose-invert max-w-3xl">
        <h1>Sobre {siteConfig.nombreSitio}</h1>

        <p>
          {siteConfig.nombreSitio} existe por una frustración conocida: cada vez que alguien
          necesita calcular su nómina, su indemnización o la cuota de una hipoteca, se encuentra
          con webs que no explican de dónde sale el número, con datos desactualizados o con
          calculadoras que no citan ninguna fuente.
        </p>

        <h2>Qué hacemos</h2>
        <p>
          Construimos <strong>calculadoras gratuitas, claras y sin registro</strong> para las
          cuentas más habituales en España: nómina, fiscalidad, hipotecas, préstamos y ahorro.
          Cada herramienta no se limita a dar un número: muestra el desglose completo para que
          puedas comprobarlo, cuestionarlo o llevárselo a tu gestor o asesor.
        </p>

        <h2>Cómo trabajamos: nuestra metodología</h2>
        <p>Tres reglas que no negociamos:</p>
        <ul>
          <li>
            <strong>Fuentes verificables.</strong> Los tipos de cotización, tramos de IRPF y
            fórmulas usadas parten de la normativa vigente (AEAT, Seguridad Social, BOE), nunca de
            blogs de terceros. Consulta el detalle en nuestra{' '}
            <Link href="/metodologia">página de metodología</Link>.
          </li>
          <li>
            <strong>Fecha de actualización visible.</strong> Cada calculadora indica cuándo se
            actualizaron sus datos. Si un valor puede quedar desfasado (un tipo, un tramo), lo
            decimos.
          </li>
          <li>
            <strong>Resultados explicados, no solo un número.</strong> Mostramos el desglose
            completo del cálculo. Una calculadora que no enseña su fórmula no merece tu confianza.
          </li>
        </ul>

        <h2>Qué no hacemos</h2>
        <p>
          No ofrecemos asesoramiento fiscal, laboral ni financiero. Nuestros resultados son{' '}
          <strong>orientativos</strong>: cada situación personal tiene matices que una calculadora
          no puede capturar por completo. Para decisiones importantes, consulta con un profesional
          colegiado. Tampoco pedimos datos personales para usar las calculadoras: introduces tus
          cifras, obtienes el resultado, y no se guardan en nuestros servidores.
        </p>

        <h2>Cómo nos financiamos</h2>
        <p>
          {siteConfig.nombreSitio} es gratuito y lo seguirá siendo. Nos financiamos mediante
          publicidad de terceros (Google AdSense). No incluimos enlaces de afiliados encubiertos
          ni recomendaciones de productos financieros pagadas: nuestros cálculos no se ven
          influidos por ningún interés comercial. Puedes leer el detalle en nuestra{' '}
          <Link href="/privacidad">Política de Privacidad</Link>.
        </p>

        <h2>Quién está detrás</h2>
        <div className="not-prose flex items-start gap-4 rounded-2xl border border-slate-200 p-5 dark:border-slate-800">
          <div className="h-16 w-16 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800" />
          <div>
            <p className="font-semibold">{siteConfig.autor.nombre}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{siteConfig.autor.bio}</p>
          </div>
        </div>

        <h2>¿Encontraste un error?</h2>
        <p>
          Leemos todos los mensajes. Si detectas un error en algún cálculo o quieres proponer una
          calculadora nueva, escríbenos a {siteConfig.emailContacto} o desde nuestra{' '}
          <Link href="/contacto">página de contacto</Link>. Los errores reportados se corrigen con
          prioridad.
        </p>
      </article>
    </main>
  )
}
