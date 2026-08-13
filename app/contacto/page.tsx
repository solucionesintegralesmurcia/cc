import type { Metadata } from 'next'
import { siteConfig } from '@/lib/site-config'

export const metadata: Metadata = {
  title: 'Contacto',
  description: `Cómo ponerte en contacto con ${siteConfig.nombreSitio}.`,
  robots: { index: true, follow: true },
  alternates: { canonical: '/contacto' },
}

export default function ContactoPage() {
  return (
    <main className="container-page py-12">
      <article className="prose dark:prose-invert max-w-2xl">
        <h1>Contacto</h1>
        <p>
          ¿Tienes una duda, has encontrado un error en algún cálculo o quieres proponernos una
          calculadora nueva? Escríbenos, respondemos personalmente todos los mensajes.
        </p>

        <div className="not-prose mt-6 rounded-2xl border border-slate-200 p-6 dark:border-slate-800">
          <p className="text-sm text-slate-500">Correo electrónico</p>
          <a href={`mailto:${siteConfig.emailContacto}`} className="text-lg font-semibold text-brand-600">
            {siteConfig.emailContacto}
          </a>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          Nota de desarrollo: este es un contacto por email directo. Un formulario de contacto con
          envío server-side (Server Action + Resend) es una mejora sencilla para una fase
          posterior, cuando el sitio tenga backend de correo configurado.
        </p>
      </article>
    </main>
  )
}
