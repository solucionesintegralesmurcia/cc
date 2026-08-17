import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Calculadoras España',
    short_name: 'Calculadoras ES',
    description: 'Calculadoras gratuitas de nómina, hipoteca, IRPF, préstamos y ahorro en España.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e3a8a',
    icons: [
      { src: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { src: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      { src: '/logo-icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}
