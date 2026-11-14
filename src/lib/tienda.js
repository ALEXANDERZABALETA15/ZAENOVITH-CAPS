// Condiciones de compra que se muestran junto al botón de compra.
// Deben coincidir con /politica-de-cambios, /preguntas-frecuentes y /como-comprar.
export const BENEFICIOS_COMPRA = [
  {
    icono: '🚚',
    titulo: 'Envío gratis en Ibagué',
    detalle: 'Al resto de Colombia en 2 a 5 días hábiles',
  },
  {
    icono: '💳',
    titulo: 'Paga como prefieras',
    detalle: 'Nequi, Bancolombia, efectivo o transferencia',
  },
  {
    icono: '📦',
    titulo: 'Foto antes de despachar',
    detalle: 'Te mostramos tu gorra empacada antes del envío',
  },
  {
    icono: '🛡️',
    titulo: 'Garantía de 7 días',
    detalle: 'Si llega con algún daño, te la cambiamos sin costo',
  },
]

// Secciones desplegables del detalle de producto.
// Envíos y cambios salen de /politica-de-cambios y /preguntas-frecuentes.
export const INFO_DESPLEGABLE = [
  {
    titulo: 'Envíos y pagos',
    parrafos: [
      'Envío gratis en Ibagué. Al resto de Colombia llegamos en 2 a 5 días hábiles, según la ciudad.',
      'Pagas con Nequi, Bancolombia, efectivo o transferencia. Confirmamos cada pedido por WhatsApp antes de despacharlo y te enviamos foto del empaque.',
    ],
  },
  {
    titulo: 'Cambios y garantía',
    parrafos: [
      'Si tu gorra llega dañada, con algún cambio de color, o te llega un modelo o color distinto al que pediste, te la cambiamos sin costo.',
      'Repórtalo por WhatsApp dentro de los 7 días siguientes a la entrega, con foto o video. La gorra debe estar sin usar y con sus etiquetas originales.',
    ],
    enlace: { texto: 'Ver política completa', href: '/politica-de-cambios' },
  },
  {
    // PENDIENTE: validar con CROWNLUX (son recomendaciones generales de cuidado de gorras)
    titulo: 'Cuidado de tu gorra',
    parrafos: [
      'Límpiala a mano con un paño húmedo y jabón suave. No la metas a la lavadora ni a la secadora.',
      'Déjala secar al aire, con su forma, lejos del sol directo. Guárdala sin aplastar la visera para que conserve la estructura.',
    ],
  },
]
