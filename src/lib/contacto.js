export const WHATSAPP_NUMERO = '573133635338'
export const SITIO_URL = 'https://www.crownlux.co'

export function whatsappLink(mensaje) {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

// Plantilla de pedido que llega al WhatsApp de la tienda.
// La usan la card del catálogo y el detalle de producto, para que el pedido llegue siempre igual.
export function mensajePedido(gorra, cantidad = 1) {
  const total = gorra.precio * cantidad
  return (
    'Hola, quiero realizar un pedido!\n\n' +
    'Gorra: ' + gorra.nombre + '\n' +
    (gorra.color ? 'Color: ' + gorra.color + '\n' : '') +
    (gorra.talla ? 'Talla: ' + gorra.talla + '\n' : '') +
    'Precio: $' + gorra.precio.toLocaleString('es-CO') + '\n' +
    'Cantidad: ' + cantidad + '\n' +
    (cantidad > 1 ? 'Total: $' + total.toLocaleString('es-CO') + '\n' : '') +
    '\n' +
    'Datos de envío:\n' +
    'Nombre completo: \n' +
    'Ciudad: \n' +
    'Dirección: \n' +
    'Barrio: \n' +
    'Teléfono: \n\n' +
    'Quedo atento a tu confirmación!'
  )
}

export function mensajeAvisoLlegada(gorra) {
  return `Hola, quiero que me avisen cuando llegue la gorra ${gorra.nombre}.`
}

export function mensajeAvisoRestock(gorra) {
  return `Hola, me interesa la gorra ${gorra.nombre} que está agotada. ¿Me avisan cuando vuelva?`
}
