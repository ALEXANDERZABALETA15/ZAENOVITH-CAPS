// Eventos de conversión. El pago ocurre fuera del sitio (WhatsApp), así que estos clics
// son la única señal de venta que se puede medir.
// Si GA4 o Meta Pixel no están configurados (ver components/Analitica.js), no hace nada.

function itemGA(gorra, cantidad = 1) {
  return {
    item_id: String(gorra.id),
    item_name: gorra.nombre,
    item_category: gorra.coleccion,
    price: gorra.precio,
    quantity: cantidad,
  }
}

// Los scripts de GA/Meta cargan después de la página: si un evento llega antes
// (ej. "vio el producto" al cargar), se reintenta unos segundos antes de descartarlo.
function enviar(eventoGA, paramsGA, eventoMeta, paramsMeta, metaPersonalizado = false, intento = 0) {
  if (typeof window === 'undefined') return
  const listo = typeof window.gtag === 'function' || typeof window.fbq === 'function'
  if (!listo) {
    if (intento < 10) {
      setTimeout(() => enviar(eventoGA, paramsGA, eventoMeta, paramsMeta, metaPersonalizado, intento + 1), 400)
    }
    return
  }
  try {
    if (typeof window.gtag === 'function' && eventoGA) {
      window.gtag('event', eventoGA, paramsGA)
    }
    if (typeof window.fbq === 'function' && eventoMeta) {
      window.fbq(metaPersonalizado ? 'trackCustom' : 'track', eventoMeta, paramsMeta)
    }
  } catch {
    // La medición nunca debe romper la compra
  }
}

// Vio el detalle de un producto
export function eventoVerProducto(gorra) {
  enviar(
    'view_item',
    { currency: 'COP', value: gorra.precio, items: [itemGA(gorra)] },
    'ViewContent',
    { content_ids: [String(gorra.id)], content_name: gorra.nombre, content_type: 'product', value: gorra.precio, currency: 'COP' }
  )
}

// Clic en "Comprar" (abre WhatsApp con el pedido). origen: 'card' | 'detalle' | 'barra_movil'
export function eventoComprar(gorra, cantidad = 1, origen = 'detalle') {
  const valor = gorra.precio * cantidad
  enviar(
    'begin_checkout',
    { currency: 'COP', value: valor, origen, items: [itemGA(gorra, cantidad)] },
    'InitiateCheckout',
    { content_ids: [String(gorra.id)], content_name: gorra.nombre, content_type: 'product', num_items: cantidad, value: valor, currency: 'COP' }
  )
}

// Dejó su número en "Avísame". tipo: 'llegada' | 'restock'
export function eventoAvisoRegistrado(gorra, tipo) {
  enviar(
    'generate_lead',
    { currency: 'COP', value: gorra.precio, tipo_aviso: tipo, item_id: String(gorra.id), item_name: gorra.nombre },
    'Lead',
    { content_ids: [String(gorra.id)], content_name: gorra.nombre, content_category: tipo }
  )
}

// Eligió escribir por WhatsApp desde el formulario de aviso
export function eventoAvisoWhatsApp(gorra, tipo) {
  enviar(
    'aviso_whatsapp',
    { tipo_aviso: tipo, item_id: String(gorra.id), item_name: gorra.nombre },
    'AvisoWhatsApp',
    { content_ids: [String(gorra.id)], content_category: tipo },
    true
  )
}

// Compartió un producto
export function eventoCompartir(gorra, metodo) {
  enviar(
    'share',
    { method: metodo, content_type: 'product', item_id: String(gorra.id) },
    'Compartir',
    { content_ids: [String(gorra.id)], method: metodo },
    true
  )
}
