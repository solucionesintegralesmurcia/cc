import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: `Qué cookies utiliza ${siteConfig.nombreSitio}, con qué finalidad y cómo puedes gestionarlas.`,
  robots: { index: true, follow: true },
  alternates: { canonical: '/cookies' },
}

const cookieRows = [
  {
    tipo: 'Técnicas / esenciales',
    ejemplo: 'Preferencia de tema (claro/oscuro), consentimiento de cookies',
    finalidad: 'Necesarias para el funcionamiento básico del sitio. No requieren consentimiento.',
    duracion: 'Sesión / hasta 1 año',
  },
  {
    tipo: 'Analíticas',
    ejemplo: 'Google Analytics / Vercel Analytics',
    finalidad: 'Medir el tráfico y el comportamiento agregado de los usuarios para mejorar el sitio.',
    duracion: 'Hasta 2 años',
  },
  {
    tipo: 'Publicitarias',
    ejemplo: 'Google AdSense',
    finalidad: 'Mostrar anuncios y, si das tu consentimiento, personalizarlos según tu navegación.',
    duracion: 'Hasta 13 meses',
  },
]

export default function CookiesPage() {
  return (
    <main className="container-page py-12">
      <article className="prose dark:prose-invert max-w-3xl">
        <h1>Política de Cookies</h1>
        <p className="text-sm text-slate-500">
          Última actualización: {siteConfig.ultimaRevisionLegal}
        </p>

        <h2>1. ¿Qué es una cookie?</h2>
        <p>
          Una cookie es un pequeño archivo que se almacena en tu navegador al visitar un sitio
          web. Sirve para recordar información sobre tu visita, como tus preferencias o, en el
          caso de las cookies publicitarias, para mostrar anuncios más relevantes.
        </p>

        <h2>2. Cookies que utilizamos</h2>
        <div className="not-prose overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                <th className="py-2 pr-4 font-medium text-slate-500">Tipo</th>
                <th className="py-2 pr-4 font-medium text-slate-500">Ejemplo</th>
                <th className="py-2 pr-4 font-medium text-slate-500">Finalidad</th>
                <th className="py-2 font-medium text-slate-500">Duración</th>
              </tr>
            </thead>
            <tbody>
              {cookieRows.map((row) => (
                <tr key={row.tipo} className="border-b border-slate-100 dark:border-slate-900">
                  <td className="py-2 pr-4 font-medium">{row.tipo}</td>
                  <td className="py-2 pr-4">{row.ejemplo}</td>
                  <td className="py-2 pr-4">{row.finalidad}</td>
                  <td className="py-2">{row.duracion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>3. Cookies de terceros: Google AdSense</h2>
        <p>
          Google, como proveedor de publicidad de terceros, utiliza cookies para mostrar anuncios
          en este sitio. El uso que Google hace de estas cookies le permite a Google y a sus
          socios publicitarios mostrar anuncios basados en tu visita a este sitio o a otros sitios
          web. Puedes inhabilitar la publicidad personalizada en{' '}
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            adssettings.google.com
          </a>
          .
        </p>

        <h2>4. Cómo gestionar o desactivar las cookies</h2>
        <p>
          Puedes permitir, bloquear o eliminar las cookies instaladas en tu equipo mediante la
          configuración de tu navegador:
        </p>
        <ul>
          <li>
            <a
              href="https://support.google.com/chrome/answer/95647"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Google Chrome
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Mozilla Firefox
            </a>
          </li>
          <li>
            <a
              href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Safari
            </a>
          </li>
          <li>
            <a
              href="https://support.microsoft.com/es-es/microsoft-edge"
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Microsoft Edge
            </a>
          </li>
        </ul>
        <p>
          Ten en cuenta que desactivar determinadas cookies puede afectar a la funcionalidad del
          sitio.
        </p>

        <h2>5. Más información</h2>
        <p>
          Consulta también nuestra <a href="/privacidad">Política de Privacidad</a> para conocer
          en detalle el tratamiento de tus datos personales.
        </p>
      </article>
    </main>
  )
}
