// ads.txt tiene que servirse en /ads.txt (raíz), texto plano, sin caché agresiva.
// ⚠️ Sustituye pub-0000000000000000 por tu Publisher ID real de AdSense
// (lo encuentras en AdSense > Cuenta > Información de la cuenta).
// Si usas otras redes (Ezoic, Media.net...) añade una línea por cada una,
// exactamente como te la proporcione esa red.

const ADSENSE_PUBLISHER_ID = 'pub-0000000000000000' // ⚠️ rellenar

export async function GET() {
  const body = `google.com, ${ADSENSE_PUBLISHER_ID}, DIRECT, f08c47fec0942fa0`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
