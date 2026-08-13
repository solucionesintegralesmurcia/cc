'use client'

import { useEffect, useRef } from 'react'

interface Props {
  slotId: string // ⚠️ el "ID de bloque de anuncios" que te da AdSense al crear cada unidad
  className?: string
}

// Componente inerte hasta que actives AdSense de verdad (ver AdSenseScript.tsx).
// Reserva espacio con min-height para no generar Cumulative Layout Shift
// cuando el anuncio cargue.
export function AdSlot({ slotId, className }: Props) {
  const ref = useRef<HTMLModElement>(null)

  useEffect(() => {
    try {
      // @ts-expect-error -- adsbygoogle se inyecta globalmente por el script de AdSense
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // Antes de la aprobación de AdSense, o sin consentimiento de cookies,
      // el script no está cargado y esto no hace nada — es intencional.
    }
  }, [])

  return (
    <ins
      ref={ref}
      className={`adsbygoogle block min-h-[100px] ${className ?? ''}`}
      style={{ display: 'block' }}
      data-ad-client="ca-pub-0000000000000000" // ⚠️ mismo Publisher ID que en ads.txt
      data-ad-slot={slotId}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  )
}
