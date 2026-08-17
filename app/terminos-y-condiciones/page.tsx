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
          Estos términos regulan el uso del sitio web {siteConfig.nombreSitio} ({siteConfig.dominio}
          , en adelante "el Sitio"), operado por {siteConfig.titular}, con correo de contacto{' '}
          {siteConfig.emailContacto}. Al acceder o usar el Sitio, aceptas estos términos en su
          totalidad.

        </p>

        <h2>1. Naturaleza del servicio</h2>
        <p>
          El Sitio ofrece calculadoras online y contenido informativo gratuito sobre nómina,
          fiscalidad, hipotecas, préstamos, ahorro y otros asuntos financieros y laborales en
          España. El uso del Sitio es gratuito y no requiere registro.
        </p>

        <h2>2. Los resultados son orientativos, no asesoramiento profesional</h2>
        <p>
          Todas las calculadoras, cifras, ejemplos y explicaciones de este Sitio se ofrecen con
          fines meramente informativos y orientativos. No constituyen asesoramiento fiscal, legal,
          laboral ni financiero, y no sustituyen la consulta con un profesional colegiado (abogado,
          graduado social, asesor fiscal o gestor administrativo).
        </p>
        <p>
          Aunque procuramos que los cálculos reflejen fielmente la normativa vigente, no
          garantizamos la exactitud, integridad o vigencia de los resultados. Antes de tomar
          cualquier decisión con consecuencias económicas o legales, verifica siempre la
          información con el organismo oficial correspondiente (Agencia Tributaria, Seguridad
          Social, etc.) o con un profesional cualificado.
        </p>

        <h2>3. Limitación de responsabilidad</h2>
        <p>
          En la máxima medida permitida por la ley, {siteConfig.titular} no será responsable de
          ningún daño, pérdida o perjuicio, directo o indirecto, derivado del uso de este Sitio o
          de decisiones tomadas basándose en la información o los cálculos que ofrece. El uso del
          Sitio y de sus calculadoras es bajo tu propia responsabilidad.
        </p>

        <h2>4. Propiedad intelectual</h2>
        <p>
          Los textos, calculadoras, diseño y demás contenido original de este Sitio son propiedad
          de {siteConfig.titular} y están protegidos por la normativa española e internacional de
          propiedad intelectual. Queda prohibida su reproducción, distribución o modificación
          total o parcial sin autorización previa por escrito, salvo que se indique expresamente
          lo contrario.
        </p>

        <h2>5. Enlaces a terceros</h2>
        <p>
          El Sitio puede incluir enlaces a páginas web de organismos oficiales o terceros sobre
          los que no tenemos control. No nos hacemos responsables del contenido, la disponibilidad
          ni las prácticas de privacidad de esos sitios externos.
        </p>

        <h2>6. Publicidad</h2>
        <p>
          Este Sitio muestra anuncios a través de redes publicitarias como Google AdSense. La
          publicidad no influye en los resultados de las calculadoras ni en el contenido
          editorial. Puedes consultar cómo se usan las cookies publicitarias en la{' '}
          <a href="/privacidad">Política de Privacidad</a>.
        </p>

        <h2>7. Uso permitido</h2>
        <p>
          Puedes usar el Sitio para fines personales y no comerciales. No está permitido extraer
          de forma automatizada (scraping) el contenido del Sitio, ni reproducir las calculadoras
          en otro sitio web sin autorización.
        </p>

        <h2>8. Modificaciones</h2>
        <p>
          Podemos actualizar estos términos en cualquier momento para reflejar cambios normativos
          o del propio Sitio. La fecha de "última actualización" indicada arriba refleja la
          versión vigente.
        </p>

        <h2>9. Legislación aplicable</h2>
        <p>
          Estos términos se rigen por la legislación española. Para cualquier controversia
          derivada del uso del Sitio, las partes se someterán a los juzgados y tribunales que
          correspondan según la normativa de protección de consumidores aplicable.
        </p>

        <h2>10. Contacto</h2>
        <p>
          Para cualquier duda sobre estos términos escríbenos a {siteConfig.emailContacto}.
        </p>
      </article>
    </main>
  )
}
