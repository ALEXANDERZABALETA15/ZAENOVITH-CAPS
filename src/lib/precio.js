export function formatPrecio(precio) {
  return precio.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function porcentajeDescuento(precio, precioAnterior) {
  if (!precioAnterior || precioAnterior <= precio) return null
  return Math.round((1 - precio / precioAnterior) * 100)
}
