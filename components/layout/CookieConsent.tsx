'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const CONSENT_KEY = 'cookie-consent'

type Consent = 'accepted' | 'rejected'

export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // No usamos localStorage/sessionStorage del navegador en artifacts, pero
    // en un despliegue real (Vercel, no el preview de artifact) sí es la
    // herramienta correcta para recordar el consentimiento entre visitas.
    const stored = window.localStorage.getItem(CONSENT_KEY)
    if (!stored) setVisible(true)
  }, [])

  function setConsent(value: Consent) {
    window.localStorage.setItem(CONSENT_KEY, value)
    setVisible(false)
    // Aquí es donde, tras "accepted", se activarían los scripts de
    // AdSense/Analytics que no sean estrictamente necesarios (ver
    // components/ads/AdSenseScript.tsx para el patrón de carga condicional).
    window.dispatchEvent(new CustomEvent('cookie-consent-changed', { detail: value }))
  }

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white p-4 shadow-lg dark:border-slate-800 dark:bg-slate-950">
      <div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Usamos cookies propias y de terceros (incluyendo Google AdSense) para el funcionamiento
          del sitio, analítica y publicidad. Puedes aceptar, rechazar o leer más en nuestra{' '}
          <Link href="/cookies" className="underline">
            Política de Cookies
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => setConsent('rejected')}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium dark:border-slate-700"
          >
            Rechazar
          </button>
          <button onClick={() => setConsent('accepted')} className="btn-primary !px-4 !py-2 text-sm">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
