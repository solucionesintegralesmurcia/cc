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

        <h2>1. Responsable del tratamiento</h2>
        <ul>
          <li>
            <strong>Responsable:</strong> {siteConfig.titular}
          </li>
          <li>
            <strong>Contacto:</strong> {siteConfig.emailContacto}
          </li>
        </ul>

        <h2>2. Qué datos tratamos</h2>
        <p>
          {siteConfig.nombreSitio} no requiere registro para usar las calculadoras. Podemos tratar
          los siguientes datos según cómo interactúes con el sitio:
        </p>
        <ul>
          <li>
            <strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas
            visitadas y tiempo de permanencia, recogidos de forma automática con fines
            estadísticos y de mejora del servicio.
          </li>
          <li>
            <strong>Datos introducidos en las calculadoras:</strong> los valores que introduces
            (salario, importes, etc.) se procesan en tu propio navegador para realizar el cálculo
            y, salvo que uses expresamente una función de guardado o envío por email, no se
            almacenan en nuestros servidores.
          </li>
          <li>
            <strong>Datos de contacto:</strong> si nos escribes por email o a través del
            formulario de contacto, tratamos el nombre y correo que nos facilites para responder
            a tu consulta.
          </li>
          <li>
            <strong>Newsletter (si te suscribes):</strong> tratamos tu email exclusivamente para
            enviarte las comunicaciones a las que te has suscrito, hasta que canceles la
            suscripción.
          </li>
        </ul>

        <h2>3. Publicidad y Google AdSense</h2>
        <p>
          Este sitio se financia mediante publicidad de terceros, principalmente Google AdSense.
          No incluimos enlaces de afiliados encubiertos ni recomendaciones de productos
          financieros pagadas: nuestros cálculos no se ven influidos por ningún interés comercial.
        </p>
        <p>
          Google, como tercero, puede
          utilizar cookies y tecnologías similares para mostrar anuncios basados en tus visitas
          anteriores a este sitio o a otros sitios web, y puede usar identificadores de
          publicidad. Puedes inhabilitar la publicidad personalizada visitando los{' '}
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            ajustes de anuncios de Google
          </a>
          , y consultar cómo Google trata los datos de los sitios que usan sus servicios en{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            este enlace
          </a>
          .
        </p>

        <h2>4. Base legal del tratamiento</h2>
        <p>
          Tratamos tus datos con base en tu consentimiento (cookies no esenciales, publicidad
          personalizada, newsletter), en la ejecución de una relación precontractual o contractual
          (responder a tu contacto) y en nuestro interés legítimo (analítica agregada para mejorar
          el sitio), de acuerdo con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018
          (LOPDGDD).
        </p>

        <h2>5. Conservación de los datos</h2>
        <p>
          Los datos de contacto se conservan mientras sea necesario para atender tu consulta. Los
          datos de la newsletter se conservan hasta que canceles la suscripción. Los datos de
          navegación agregados se conservan según los plazos de las herramientas de analítica
          utilizadas.
        </p>

        <h2>6. Cesión de datos a terceros</h2>
        <p>
          No vendemos tus datos personales. Compartimos datos únicamente con proveedores
          necesarios para el funcionamiento del sitio (hosting, analítica, publicidad, envío de
          email), que actúan como encargados del tratamiento o, en el caso de Google, bajo sus
          propias políticas de privacidad como responsable independiente para determinados usos
          publicitarios.
        </p>

        <h2>7. Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y
          portabilidad escribiendo a {siteConfig.emailContacto}. También tienes derecho a
          presentar una reclamación ante la Agencia Española de Protección de Datos (
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer nofollow">
            www.aepd.es
          </a>
          ) si consideras que el tratamiento no se ajusta a la normativa.
        </p>

        <h2>8. Más información sobre cookies</h2>
        <p>
          Consulta el detalle de las cookies que utilizamos en nuestra{' '}
          <a href="/cookies">Política de Cookies</a>.
        </p>
      </article>
    </main>
  )
}
