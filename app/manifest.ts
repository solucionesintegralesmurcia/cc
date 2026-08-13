import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Calculadoras España',
    short_name: 'CalcEspaña',
    description:
      'Calculadoras gratuitas y actualizadas para nómina, hipoteca, fiscalidad y más.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a',
    lang: 'es',
    icons: [
      { src: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/logo-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/logo-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
