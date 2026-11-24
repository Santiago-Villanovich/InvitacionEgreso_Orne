window.CONFIG = {
  // Vacío = modo demo (los datos quedan en este navegador). Pegá acá la URL del Apps Script publicado.
  SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbxQyew_5gLqFO-hqpGJgr1TxNhPFcptRwOl5KSiVlYLDO8hInx_88BUicZAg04dnw3fFA/exec',
  BASE_URL: new URL('.', document.currentScript.src).href,

  evento: {
    homenajeada: 'Orne Battiato',
    carrera: 'Prof. y Lic. en Psicopedagogía',
    inicio: '2026-12-12T21:00:00-03:00',
    duracionHoras: 6,
    fechaTexto: 'Viernes 18 de diciembre',
    horaTexto: '20 hs',
    lugar: 'Pura vida',
    direccion: 'Rembrandt 3951',
    mapsQuery: 'Rembrandt 3951 Francisco Alvarez, Buenos Aires',
    dressCode: 'Comodo, traé malla y toallón por si te pinta un chapuzón',
    confirmarHasta: '5 de diciembre',
    bebidas: 'Si podes y querés, sumá algo rico para tomar: gaseosa, vino, cerveza o lo que más te guste. ¡Festejamos juntos!',
  },

  // Sólo para modo demo: con SCRIPT_URL los grupos se editan desde /status (hoja Grupos).
  MOCK_GRUPOS: [
    { grupo: 'familia', horaTexto: 'de 20 a 24 hs', inicio: '2026-12-12T20:00', fin: '2026-12-13T00:00' },
    { grupo: 'amigos', horaTexto: 'desde las 23 hs', inicio: '2026-12-12T23:00', fin: '2026-12-13T04:00' },
  ],

  // Las dos polaroids de la portada: [izquierda, derecha]. Ej: ['img/chiquita.jpg', 'img/toga.jpg']
  portada: ['img/bebe_chupaleta_0.jpg', 'img/jardin_pirueta_0.jpg'],

  // Una entrada por etapa. Cada foto puede ser 'img/x.jpg' o { src: 'img/x.jpg', label: 'texto' }.
  // Sin label: la primera foto lleva el nombre de la etapa y las demás van sin texto.
  timeline: [
    { etapa: 'Jardín maternal', fotos: ['img/jardin_pilotin_1.jpg', 'img/jardin_retrato_1.jpg'] },
    { etapa: 'Jardín de infantes', fotos: ['img/jardin_amarillo_2.jpg', 'img/jardin_pileta_2.jpg'] },
    { etapa: 'Primaria', fotos: ['img/primaria_patito_3.jpg','img/primaria_baile_3.jpg' ] },
    { etapa: 'Secundaria', fotos: ['img/secundaria_egreso_globos_4.jpg','img/secundaria_egreso_vestido_4.jpg'] },
    { etapa: 'Universidad', fotos: ['img/universidad_5.jpg'] },
  ],

  // tipo 'foto': foto + titulo (+ icono opcional).
  // tipo 'dato': muestra un dato de "evento" (fecha | lugar | dress | bebida | confirmar) sobre la foto de fondo.
  //   Opcionales: titulo (franja de abajo), texto (reemplaza el dato), icono.
  // Íconos: fecha, lugar, dress, bebida, confirmar, corazon, flor, estrella, birrete
  figuritas: [
    { tipo: 'foto', titulo: '', icono: 'corazon', foto: 'img/jardin_pijama_parque.jpg' },
    { tipo: 'dato', dato: 'fecha', foto: 'img/bg_fecha.jpeg' },
    { tipo: 'dato', dato: 'bebida', foto: 'img/bg_bebida.jpg' },
    { tipo: 'dato', dato: 'lugar', foto: 'img/bg_lugar.jpeg' },
    { tipo: 'foto', titulo: '', icono: 'flor', foto: 'img/secundaria_parque.jpg' },
    { tipo: 'dato', dato: 'dress', foto: 'img/bg_desscode.jpg' },
    { tipo: 'dato', dato: 'confirmar', foto: 'img/bg_confirmacion.jpg', brillante: true },
    { tipo: 'foto', titulo: 'Llego el dia Abu', foto: 'img/jardin_ceci.jpg', brillante: true },
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
