// El NIF y el domicilio ya NO se muestran en el Aviso Legal (siguiendo el
// mismo criterio que otros sitios similares sin actividad económica formal
// dada de alta). Quedan aquí por si en el futuro te das de alta como
// autónomo/empresa y quieres publicarlos.
export const siteConfig = {
  nombreSitio: 'Calculadoras España',
  dominio: 'https://calculadorasespana.es',
  titular: 'Pablo González',
  nif: '', // opcional — solo si tienes actividad económica dada de alta
  domicilio: '', // opcional — solo si tienes actividad económica dada de alta
  emailContacto: 'calculadorasespana@gmail.es',
  telefonoContacto: '', // opcional
  registroMercantil: '', // opcional, solo si eres sociedad

  autor: {
    nombre: 'Pablo González',
    bio: 'Desarrollador y creador de Calculadoras España. Construyo y reviso cada calculadora personalmente, contrastando fórmulas con fuentes oficiales (BOE, Seguridad Social, Agencia Tributaria) antes de publicarlas.',
    fotoUrl: '/autor.jpg', // ⚠️ sube una foto real a /public/autor.jpg
  },

  ultimaRevisionLegal: '2026-01-01',
}
