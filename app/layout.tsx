import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CookieConsent } from '@/components/layout/CookieConsent'
import { AdSenseScript } from '@/components/layout/AdSenseScript'

export const viewport: Viewport = {
  themeColor: '#1e3a8a',
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calculadorasespana.es'),
  title: {
    default: 'Calculadoras España | Nómina, Hipoteca, IRPF y más',
    template: '%s | Calculadoras España',
  },
  description:
    'La plataforma de calculadoras online más completa de España: nómina, hipoteca, IRPF, jubilación, autónomos y mucho más. Gratis y actualizadas.',
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: '/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    siteName: 'Calculadoras España',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Calculadoras España' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <Header />
        {children}
        <Footer />
        <CookieConsent />
        <AdSenseScript />
      </body>
    </html>
  )
}
