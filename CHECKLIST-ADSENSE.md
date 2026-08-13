# Checklist para solicitar Google AdSense

Antes de rellenar el formulario de solicitud en adsense.google.com, repasa
esto de arriba a abajo. Cada punto sin marcar es un motivo real de rechazo.

## 1. Datos y propiedad (rellenar antes de nada)

- [ ] Editar `lib/site-config.ts` con datos REALES: titular, NIF, domicilio,
      email de contacto, nombre y bio del autor.
- [ ] Subir una foto real del autor a `public/autor.jpg`.
- [ ] Tener el dominio propio comprado y apuntando al despliegue de Vercel
      (no vale un dominio `.vercel.app`).
- [ ] Verificar la propiedad del dominio en Google Search Console.

## 2. Contenido

- [ ] Mínimo 20-30 páginas con contenido sustancial antes de solicitar
      (cada calculadora cuenta, cada artículo de blog cuenta).
- [ ] Ningún texto copiado de otro sitio.
- [ ] Si usas IA para redactar, revisar y editar cada artículo a mano antes
      de publicar — no publicar output de IA sin pasar por una revisión
      humana real.
- [ ] Cada calculadora explica su fórmula, no solo da un número.
- [ ] El blog tiene autoría visible (ya está montado: ver `/sobre-nosotros`).

## 3. Páginas obligatorias (ya creadas en este scaffold)

- [x] `/aviso-legal`
- [x] `/privacidad` (menciona explícitamente Google AdSense)
- [x] `/cookies`
- [x] `/sobre-nosotros` (con autor real)
- [x] `/contacto`
- [x] Enlazadas todas desde el footer

## 4. Técnico (ya montado, revisar antes de publicar)

- [x] `ads.txt` servido en `/ads.txt` — **rellenar el Publisher ID real**
      en `app/ads.txt/route.ts` en cuanto tengas cuenta de AdSense.
- [x] Banner de consentimiento de cookies antes de cargar scripts de
      publicidad/analítica (`components/layout/CookieConsent.tsx`).
- [x] Script de AdSense con carga condicional al consentimiento
      (`components/layout/AdSenseScript.tsx`) — **rellenar el Client ID**
      cuando tengas cuenta.
- [ ] HTTPS activo (automático en Vercel).
- [ ] Sitio responsive comprobado en móvil real, no solo en el navegador.
- [ ] Sin enlaces rotos: revisar con una herramienta tipo Screaming Frog o
      el informe de "Páginas" de Search Console.
- [ ] Velocidad: pasar Lighthouse y apuntar a &gt;90 en Performance.

## 5. Tráfico

- [ ] Indexar el sitio en Google Search Console y esperar a tener tráfico
      orgánico real (no de anuncios pagados ni de grupos de intercambio de
      clics) antes de solicitar. No hay un mínimo oficial, pero solicitar
      con cero visitas suele acabar en rechazo por "falta de autoridad".

## 6. Al solicitar

- [ ] Solicitar desde adsense.google.com con la cuenta de Google vinculada
      al dominio verificado en Search Console.
- [ ] Tras enviar, el código de AdSense pide pegar un snippet en el `<head>`
      — en Next.js esto se hace añadiendo el script en `app/layout.tsx`
      (puedes reutilizar el patrón de `AdSenseScript.tsx`, pero SIN
      condicionarlo al consentimiento durante la fase de solicitud, ya que
      Google necesita rastrear el sitio; vuelve a condicionarlo al
      consentimiento una vez aprobado).
- [ ] Esperar la revisión manual (puede tardar semanas). Si rechazan, leen
      el motivo, corrígelo y reenvía — es normal necesitar 2-3 intentos.
