// El NIF y el domicilio son datos legales reales que exige la LSSI-CE para
// el Aviso Legal: NO se inventan, hay que rellenarlos con los tuyos antes
// de publicar. El resto ya está actualizado con los datos que diste.
export const siteConfig = {
  nombreSitio: 'Calculadoras España',
  dominio: 'https://calculadorasespana.es',
  titular: 'Pablo González',
  nif: 'X0000000X', // ⚠️ rellenar con tu NIF/CIF real (obligatorio para el Aviso Legal)
  domicilio: 'Calle Ejemplo 1, 28001 Madrid, España', // ⚠️ rellenar con tu domicilio real
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
