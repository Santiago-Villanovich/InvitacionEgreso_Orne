window.CONFIG = {
  // Vacío = modo demo (los datos quedan en este navegador). Pegá acá la URL del Apps Script publicado.
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxQyew_5gLqFO-hqpGJgr1TxNhPFcptRwOl5KSiVlYLDO8hInx_88BUicZAg04dnw3fFA/exec',
  BASE_URL: new URL('.', document.currentScript.src).href,

  evento: {
    homenajeada: 'Nombre Apellido',
    carrera: 'Lic. en Psicopedagogía',
    inicio: '2026-12-12T21:00:00-03:00',
    duracionHoras: 6,
    fechaTexto: 'Sábado 12 de diciembre',
    horaTexto: '21 hs',
    lugar: 'Salón Las Glicinas',
    direccion: 'Av. Siempreviva 742, Buenos Aires',
    mapsQuery: 'Obelisco, Buenos Aires',
    dressCode: 'Colorido, brillante y cómodo para bailar',
    confirmarHasta: '1 de diciembre',
    bebidas: 'Si querés, sumá algo rico para tomar: gaseosa, vino, cerveza o lo que más te guste. ¡Brindamos juntos!',
  },

  // Cada familia de la hoja Invitados tiene un grupo (columna "grupo"). Lo que pongas acá pisa los datos de "evento" para ese grupo.
  grupos: {
    familia: { inicio: '2026-12-12T20:00:00-03:00', duracionHoras: 4, horaTexto: 'de 20 a 24 hs' },
    amigos: { inicio: '2026-12-12T23:00:00-03:00', duracionHoras: 5, horaTexto: 'desde las 23 hs' },
  },

  timeline: [
    { anio: '2003', etapa: 'Salita de 3', texto: 'Primer guardapolvo, primeras témperas y ya organizando a todos.', foto: '' },
    { anio: '2008', etapa: 'Primaria', texto: 'Cuadernos forrados, letra cursiva y la mochila más pesada del grado.', foto: '' },
    { anio: '2015', etapa: 'Secundaria', texto: 'Viaje de egresados, carpetas con stickers y la decisión: quiero ayudar a aprender.', foto: '' },
    { anio: '2021', etapa: 'Facultad', texto: 'Parciales, prácticas, mates infinitos y muchas ganas.', foto: '' },
    { anio: '2026', etapa: '¡Licenciada!', texto: 'Ahora sí: Psicopedagoga. Y lo quiero festejar con ustedes.', foto: '' },
  ],

  // tipo 'foto' usa foto/titulo; tipo 'dato' toma el valor de evento: fecha | lugar | dress | bebida | confirmar
  figuritas: [
    { tipo: 'foto', titulo: 'Salita de 3', foto: '' },
    { tipo: 'dato', dato: 'fecha' },
    { tipo: 'dato', dato: 'bebida' },
    { tipo: 'dato', dato: 'lugar' },
    { tipo: 'foto', titulo: 'Viaje de egresados', foto: '' },
    { tipo: 'dato', dato: 'dress' },
    { tipo: 'foto', titulo: 'Último final', foto: '', brillante: true },
    { tipo: 'dato', dato: 'confirmar', brillante: true },
  ],

  MOCK_INVITADOS: [
    { slug: 'familia-perez', familia: 'Familia Pérez', miembros: ['Pepe', 'Laura', 'Juan', 'Sofi'], grupo: 'familia' },
    { slug: 'abuela-marta', familia: 'Abuela Marta', miembros: ['Marta'], grupo: 'familia' },
    { slug: 'tios-gomez', familia: 'Tíos Gómez', miembros: ['Carlos', 'Inés'], grupo: 'familia' },
    { slug: 'amigas-facu', familia: 'Las chicas de la facu', miembros: ['Cami', 'Flor', 'Agus'], grupo: 'amigos' },
  ],

  MOCK_COMPRAS: [
    { item: 'Pizza (porciones)', xPersona: 4, cantidad: '', precio: 1200, comprado: false },
    { item: 'Gaseosas 2,25 L', xPersona: 0.5, cantidad: '', precio: 3200, comprado: false },
    { item: 'Torta', xPersona: '', cantidad: 1, precio: 60000, comprado: true },
    { item: 'Globos y guirnaldas', xPersona: '', cantidad: 1, precio: 18000, comprado: true },
    { item: 'Vasos y platos', xPersona: 2, cantidad: '', precio: 180, comprado: false },
  ],
};
