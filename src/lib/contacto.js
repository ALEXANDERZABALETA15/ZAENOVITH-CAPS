export const WHATSAPP_NUMERO = '573133635338'

export function whatsappLink(mensaje) {
  const base = `https://wa.me/${WHATSAPP_NUMERO}`
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base
}

// Plantilla de pedido que llega al WhatsApp de la tienda.
// La usan la card del catálogo y el detalle de producto, para que el pedido llegue siempre igual.
export function mensajePedido(gorra) {
  return (
    'Hola, quiero realizar un pedido!\n\n' +
    'Gorra: ' + gorra.nombre + '\n' +
    (gorra.color ? 'Color: ' + gorra.color + '\n' : '') +
    'Precio: $' + gorra.precio.toLocaleString('es-CO') + '\n' +
    'Cantidad: 1\n\n' +
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
