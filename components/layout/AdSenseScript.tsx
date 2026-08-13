'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

const CONSENT_KEY = 'cookie-consent'

// ⚠️ Activar solo DESPUÉS de que AdSense apruebe el sitio. Mientras solicitas
// la aprobación, el código de solicitud de AdSense pide que el script esté
// presente pero SIN anuncios activos todavía; una vez aprobado, sustituye
// ADSENSE_CLIENT_ID por tu ca-pub-XXXXXXXXXXXXXXXX real.
const ADSENSE_CLIENT_ID = 'ca-pub-0000000000000000' // ⚠️ rellenar

export function AdSenseScript() {
  const [consentGiven, setConsentGiven] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem(CONSENT_KEY)
    setConsentGiven(stored === 'accepted')

    function onConsentChange(e: Event) {
      const detail = (e as CustomEvent).detail
      setConsentGiven(detail === 'accepted')
    }

    window.addEventListener('cookie-consent-changed', onConsentChange)
    return () => window.removeEventListener('cookie-consent-changed', onConsentChange)
  }, [])

  if (!consentGiven) return null

  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  )
}
