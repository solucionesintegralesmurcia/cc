import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'
import { getCalculator } from '@/lib/calculators'

export const runtime = 'edge'

// Genera la imagen social (Open Graph / Twitter Card) de cada calculadora al
// vuelo, sin necesidad de subir una imagen manual por cada una. Se referencia
// desde lib/seo/generate.ts como `${SITE_URL}/api/og?slug=${meta.slug}`.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const calculator = slug ? getCalculator(slug) : null

  const title = calculator?.meta.title ?? 'Calculadoras España'
  const subtitle = calculator?.meta.shortDescription ?? 'Nómina, hipoteca, IRPF y mucho más'

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #0f1c40 0%, #1e3a8a 100%)',
          padding: '64px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              fontWeight: 700,
              color: '#0f1c40',
            }}
          >
            €
          </div>
          <div style={{ display: 'flex', fontSize: 28, fontWeight: 700, color: 'white' }}>
            Calculadoras<span style={{ color: '#fbbf24' }}>España</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 980 }}>
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 700, color: 'white', lineHeight: 1.15 }}>
            {title}
          </div>
          <div style={{ display: 'flex', fontSize: 28, color: '#bfdbfe' }}>{subtitle}</div>
        </div>

        <div style={{ display: 'flex', fontSize: 20, color: '#fbbf24', fontWeight: 600 }}>
          Gratis · Sin registro · Resultado instantáneo
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
