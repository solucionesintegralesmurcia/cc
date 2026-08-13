import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: `Aviso legal de ${siteConfig.nombreSitio}: identificación del titular, condiciones de uso y propiedad intelectual.`,
  robots: { index: true, follow: true },
  alternates: { canonical: '/aviso-legal' },
}

export default function AvisoLegalPage() {
  return (
    <main className="container-page py-12">
      <article className="prose dark:prose-invert max-w-3xl">
        <h1>Aviso Legal</h1>
        <p className="text-sm text-slate-500">
          Última actualización: {siteConfig.ultimaRevisionLegal}
        </p>

        <h2>1. Datos identificativos</h2>
        <p>
          En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la
          Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los
          siguientes datos:
        </p>
        <ul>
          <li>
            <strong>Titular:</strong> {siteConfig.titular}
          </li>
          <li>
            <strong>NIF/CIF:</strong> {siteConfig.nif}
          </li>
          <li>
            <strong>Domicilio:</strong> {siteConfig.domicilio}
          </li>
          <li>
            <strong>Correo electrónico:</strong> {siteConfig.emailContacto}
          </li>
          <li>
            <strong>Sitio web:</strong> {siteConfig.dominio}
          </li>
        </ul>

        <h2>2. Objeto</h2>
        <p>
          {siteConfig.nombreSitio} ofrece calculadoras y contenido informativo relacionado con
          nómina, fiscalidad, hipotecas, préstamos y finanzas personales en España, de acceso
          gratuito para el usuario.
        </p>

        <h2>3. Carácter orientativo del contenido</h2>
        <p>
          Los resultados obtenidos mediante las calculadoras de este sitio son estimaciones
          orientativas basadas en la normativa vigente en el momento de su publicación. No
          constituyen asesoramiento fiscal, laboral, financiero ni legal, y no sustituyen la
          consulta con un profesional cualificado (asesoría, gestoría, abogado) ni el cálculo
          oficial realizado por la Agencia Tributaria, la Seguridad Social o tu empresa. El uso de
          estas herramientas es responsabilidad exclusiva del usuario.
        </p>

        <h2>4. Condiciones de uso</h2>
        <p>
          El acceso y uso de este sitio atribuye la condición de usuario y implica la aceptación
          de las condiciones incluidas en este Aviso Legal. El usuario se compromete a hacer un
          uso adecuado de los contenidos y servicios, y a no emplearlos para actividades ilícitas,
          contrarias a la buena fe o al orden público.
        </p>

        <h2>5. Propiedad intelectual e industrial</h2>
        <p>
          Todos los contenidos del sitio (textos, diseño, código, calculadoras, logotipos) son
          titularidad de {siteConfig.titular} o se utilizan con la correspondiente autorización,
          y están protegidos por la normativa de propiedad intelectual e industrial. Queda
          prohibida su reproducción total o parcial sin autorización expresa.
        </p>

        <h2>6. Exclusión de responsabilidad</h2>
        <p>
          {siteConfig.titular} no se hace responsable de los daños y perjuicios que pudieran
          derivarse de errores u omisiones en los contenidos, de la falta de disponibilidad del
          sitio, o de la transmisión de virus o programas maliciosos, a pesar de haber adoptado
          las medidas tecnológicas razonables para evitarlo.
        </p>

        <h2>7. Publicidad</h2>
        <p>
          Este sitio muestra anuncios servidos por redes publicitarias de terceros, entre ellas
          Google AdSense. Consulta nuestra{' '}
          <a href="/privacidad">Política de Privacidad</a> y nuestra{' '}
          <a href="/cookies">Política de Cookies</a> para más información sobre el tratamiento de
          datos asociado.
        </p>

        <h2>8. Legislación aplicable y jurisdicción</h2>
        <p>
          Las presentes condiciones se rigen por la legislación española. Para cualquier
          controversia, las partes se someten a los juzgados y tribunales que correspondan según
          la normativa vigente en materia de protección de consumidores y usuarios.
        </p>

        <h2>9. Contacto</h2>
        <p>
          Para cualquier consulta relacionada con este Aviso Legal, puedes escribirnos a{' '}
          {siteConfig.emailContacto} o visitar nuestra <a href="/contacto">página de contacto</a>.
        </p>
      </article>
    </main>
  )
}
