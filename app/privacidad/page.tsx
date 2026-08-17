import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description: `Política de privacidad de ${siteConfig.nombreSitio}: qué datos tratamos, con qué finalidad y qué derechos tienes.`,
  robots: { index: true, follow: true },
  alternates: { canonical: '/privacidad' },
}

export default function PrivacidadPage() {
  return (
    <main className="container-page py-12">
      <article className="prose dark:prose-invert max-w-3xl">
        <h1>Política de Privacidad</h1>
        <p className="text-sm text-slate-500">
          Última actualización: {siteConfig.ultimaRevisionLegal}
        </p>

        <p>
          Esta Política de Privacidad explica qué datos personales trata {siteConfig.nombreSitio} (
          {siteConfig.dominio}, en adelante "el Sitio"), operado por {siteConfig.titular}, con
          correo de contacto {siteConfig.emailContacto}, y con qué finalidad.
        </p>

        <h2>1. Lo más importante primero</h2>
        <p>
          Los datos que introduces en las calculadoras (salario, importes, situación familiar y
          demás cifras que usas para obtener un resultado) se procesan{' '}
          <strong>enteramente en tu propio navegador</strong>. No se envían a ningún servidor, no
          los vemos, no los almacenamos y no tenemos acceso a ellos en ningún momento. Puedes usar
          cualquier calculadora del Sitio sin que esos datos salgan de tu dispositivo.
        </p>

        <h2>2. Responsable del tratamiento</h2>
        <ul>
          <li>
            <strong>Responsable:</strong> {siteConfig.titular}
          </li>
          <li>
            <strong>Contacto:</strong> {siteConfig.emailContacto}
          </li>
        </ul>

        <h2>3. Qué datos se tratan y con qué base legal</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                <th className="py-2 pr-4 font-medium text-slate-500">Dato</th>
                <th className="py-2 pr-4 font-medium text-slate-500">¿Se envía a algún servidor?</th>
                <th className="py-2 pr-4 font-medium text-slate-500">Finalidad</th>
                <th className="py-2 font-medium text-slate-500">Base legal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100 dark:border-slate-900">
                <td className="py-2 pr-4">Datos introducidos en las calculadoras</td>
                <td className="py-2 pr-4">No — se procesan solo en tu navegador</td>
                <td className="py-2 pr-4">Calcular el resultado que solicitas</td>
                <td className="py-2">No aplica (no hay tratamiento por nuestra parte)</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-900">
                <td className="py-2 pr-4">Datos de navegación agregados y anónimos</td>
                <td className="py-2 pr-4">Sí, a través de herramientas de analítica</td>
                <td className="py-2 pr-4">Entender qué calculadoras se usan más y mejorar el Sitio</td>
                <td className="py-2">Interés legítimo (art. 6.1.f RGPD)</td>
              </tr>
              <tr className="border-b border-slate-100 dark:border-slate-900">
                <td className="py-2 pr-4">Correo electrónico, si nos escribes</td>
                <td className="py-2 pr-4">Sí, a nuestra bandeja de entrada</td>
                <td className="py-2 pr-4">Responder a tu consulta</td>
                <td className="py-2">Consentimiento (al enviarnos el correo)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Cuando usamos herramientas de analítica, los datos que recibimos son agregados: por
          ejemplo, "esta calculadora tuvo X visitas esta semana", nunca ligados a ti como persona
          identificable.
        </p>

        <h2>4. Publicidad y cookies</h2>
        <p>
          Este Sitio muestra publicidad a través de Google AdSense. Google, como tercero, puede
          utilizar cookies y tecnologías similares para mostrar anuncios personalizados según tu
          actividad de navegación. Antes de que se activen esas cookies, el Sitio muestra un aviso
          de cookies donde puedes aceptar o rechazar la publicidad personalizada.
        </p>
        <p>
          Puedes consultar y ajustar en cualquier momento cómo Google usa tus datos para publicidad
          en la{' '}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer nofollow">
            Configuración de Anuncios de Google
          </a>
          , y más información general en la{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            Política de Privacidad de Google
          </a>
          .
        </p>

        <h2>5. Con quién se comparten los datos</h2>
        <ul>
          <li>
            <strong>Vercel</strong> (alojamiento del Sitio), con sede en EE. UU. y la UE.
          </li>
          <li>
            <strong>Google</strong> (a través de Google AdSense), con sede en EE. UU.
          </li>
        </ul>
        <p>
          Cuando estos proveedores tratan datos fuera del Espacio Económico Europeo, se apoyan en
          mecanismos de transferencia reconocidos por el RGPD, como las Cláusulas Contractuales
          Tipo. No vendemos ni cedemos tus datos a terceros con fines distintos a los descritos en
          esta política.
        </p>

        <h2>6. Cuánto tiempo se conservan los datos</h2>
        <p>
          Los datos introducidos en las calculadoras no se conservan porque nunca llegan a
          nuestros servidores. Los correos que nos envíes se conservan mientras sea necesario para
          responder tu consulta y, salvo que la ley exija otra cosa, se eliminan pasado un tiempo
          razonable.
        </p>

        <h2>7. Tus derechos</h2>
        <p>
          Como usuario en España o la UE, tienes derecho a acceder, rectificar, suprimir, limitar
          u oponerte al tratamiento de tus datos, así como a la portabilidad de los mismos, cuando
          sea aplicable. Dado que la mayoría de los datos que tratas en el Sitio nunca llegan a
          nuestros servidores, en la práctica estos derechos se aplican principalmente a los
          correos que nos envíes directamente.
        </p>
        <p>
          Para ejercer cualquiera de estos derechos, escríbenos a {siteConfig.emailContacto}.
          También tienes derecho a presentar una reclamación ante la Agencia Española de
          Protección de Datos (
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer nofollow">
            www.aepd.es
          </a>
          ) si consideras que el tratamiento de tus datos no se ajusta a la normativa.
        </p>

        <h2>8. Menores de edad</h2>
        <p>El Sitio no está dirigido a menores de 14 años y no recopila conscientemente datos de menores.</p>

        <h2>9. Cambios en esta política</h2>
        <p>
          Podemos actualizar esta Política de Privacidad para reflejar cambios en el Sitio o en la
          normativa aplicable. La fecha de "última actualización" indicada arriba refleja la
          versión vigente.
        </p>

        <h2>10. Más información sobre cookies</h2>
        <p>
          Consulta el detalle de las cookies que utilizamos en nuestra{' '}
          <a href="/cookies">Política de Cookies</a>.
        </p>
      </article>
    </main>
  )
}
