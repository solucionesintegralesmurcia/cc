import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description: `Condiciones de uso de las calculadoras y servicios de ${siteConfig.nombreSitio}.`,
  robots: { index: true, follow: true },
  alternates: { canonical: '/terminos-y-condiciones' },
}

export default function TerminosPage() {
  return (
    <main className="container-page py-12">
      <article className="prose dark:prose-invert max-w-3xl">
        <h1>Términos y Condiciones</h1>
        <p className="text-sm text-slate-500">
          Última actualización: {siteConfig.ultimaRevisionLegal}
        </p>

        <p>
          Al acceder y usar {siteConfig.nombreSitio} ({siteConfig.dominio}) aceptas los siguientes
          términos. Si no estás de acuerdo con alguno de ellos, te pedimos que no utilices el
          sitio.
        </p>

        <h2>1. Descripción del servicio</h2>
        <p>
          {siteConfig.nombreSitio} ofrece calculadoras online gratuitas relacionadas con nómina,
          fiscalidad, hipotecas, préstamos, ahorro y otras materias financieras y laborales en
          España, junto con contenido informativo (artículos de blog) relacionado. El acceso es
          gratuito y no requiere registro.
        </p>

        <h2>2. Naturaleza orientativa de los resultados</h2>
        <p>
          Los cálculos que ofrece este sitio son <strong>estimaciones orientativas</strong> basadas
          en la normativa vigente en el momento de su publicación. No constituyen asesoramiento
          fiscal, laboral, financiero ni legal, y no sustituyen el cálculo oficial de la Agencia
          Tributaria, la Seguridad Social, tu empresa o un profesional colegiado. El uso de los
          resultados para tomar decisiones es responsabilidad exclusiva del usuario.
        </p>

        <h2>3. Uso permitido</h2>
        <p>Al usar el sitio, te comprometes a:</p>
        <ul>
          <li>No usar las calculadoras ni el contenido con fines ilícitos o fraudulentos.</li>
          <li>
            No intentar extraer de forma masiva y automatizada (scraping) el contenido del sitio
            sin autorización previa por escrito.
          </li>
          <li>No interferir con el funcionamiento técnico del sitio ni intentar vulnerar su seguridad.</li>
          <li>No reproducir ni redistribuir el contenido con fines comerciales sin autorización.</li>
        </ul>

        <h2>4. Propiedad intelectual</h2>
        <p>
          El código, diseño, textos, fórmulas explicadas y demás contenido original de{' '}
          {siteConfig.nombreSitio} son propiedad de {siteConfig.titular} y están protegidos por la
          normativa de propiedad intelectual. Puedes compartir enlaces a nuestras páginas
          libremente; para reproducir contenido, contáctanos primero.
        </p>

        <h2>5. Disponibilidad del servicio</h2>
        <p>
          Nos esforzamos por mantener el sitio disponible y actualizado, pero no garantizamos un
          funcionamiento ininterrumpido ni libre de errores. Nos reservamos el derecho de
          modificar, suspender o interrumpir el servicio, total o parcialmente, en cualquier
          momento y sin previo aviso.
        </p>

        <h2>6. Limitación de responsabilidad</h2>
        <p>
          {siteConfig.titular} no será responsable de ningún daño, directo o indirecto, derivado
          del uso o la imposibilidad de uso del sitio, ni de decisiones tomadas a partir de los
          resultados de nuestras calculadoras. Esto incluye, entre otros, pérdidas económicas
          derivadas de decisiones fiscales, laborales o financieras basadas exclusivamente en
          nuestras estimaciones.
        </p>

        <h2>7. Enlaces a terceros</h2>
        <p>
          El sitio puede incluir enlaces a páginas de terceros (fuentes oficiales, artículos
          citados). No nos hacemos responsables del contenido ni de las políticas de privacidad de
          esos sitios externos.
        </p>

        <h2>8. Publicidad</h2>
        <p>
          Este sitio muestra anuncios de terceros (Google AdSense) para financiarse. Consulta
          nuestra <a href="/privacidad">Política de Privacidad</a> para más información sobre el
          tratamiento de datos asociado a la publicidad.
        </p>

        <h2>9. Modificaciones de estos términos</h2>
        <p>
          Podemos actualizar estos Términos y Condiciones cuando sea necesario. Los cambios serán
          efectivos desde su publicación en esta página, indicada por la fecha de "última
          actualización".
        </p>

        <h2>10. Legislación aplicable</h2>
        <p>
          Estos términos se rigen por la legislación española. Para cualquier controversia, las
          partes se someten a los juzgados y tribunales competentes según la normativa de
          protección de consumidores y usuarios.
        </p>

        <h2>11. Contacto</h2>
        <p>
          Para cualquier duda sobre estos términos, escríbenos a {siteConfig.emailContacto} o desde
          nuestra <a href="/contacto">página de contacto</a>.
        </p>
      </article>
    </main>
  )
}
