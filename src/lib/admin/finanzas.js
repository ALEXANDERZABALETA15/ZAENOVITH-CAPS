// Cálculos de dinero del panel. Un solo lugar para que Inicio, Ventas e Inventario
// cuenten la utilidad igual.
//
// Utilidad de una venta = lo cobrado por las gorras (subtotal − descuento) − lo que costaron.
// El envío no cuenta: es plata que se le paga a la transportadora.
// El costo de cada gorra queda guardado en la venta al registrarla (costo_unitario), así que
// cambiar el costo después no altera las ventas viejas.

const costoItems = (items = []) => items.reduce((s, i) => s + (i.costo_unitario ?? 0) * i.cantidad, 0)

export function utilidadVenta(venta) {
  const items = venta.venta_items || []
  return {
    utilidad: (venta.subtotal ?? 0) - (venta.descuento ?? 0) - costoItems(items),
    // Si alguna gorra no tenía costo, la utilidad sale más alta de lo real
    costoIncompleto: items.some((i) => i.costo_unitario === null || i.costo_unitario === undefined),
  }
}

// Suma de un grupo de ventas (las canceladas no cuentan)
export function resumenVentas(ventas) {
  return ventas
    .filter((v) => v.estado !== 'cancelado')
    .reduce(
      (r, v) => {
        const { utilidad, costoIncompleto } = utilidadVenta(v)
        r.ventas += 1
        r.ingresos += v.total ?? 0
        r.neto += (v.subtotal ?? 0) - (v.descuento ?? 0)
        r.utilidad += utilidad
        r.unidades += (v.venta_items || []).reduce((s, i) => s + i.cantidad, 0)
        if (costoIncompleto) r.costoIncompleto += 1
        return r
      },
      { ventas: 0, ingresos: 0, neto: 0, utilidad: 0, unidades: 0, costoIncompleto: 0 }
    )
}

// Margen sobre lo vendido: 25 = de cada $100 vendidos, $25 son ganancia
export function margen(utilidad, ventas) {
  return ventas > 0 ? Math.round((utilidad / ventas) * 100) : null
}

// Lo que hay en bodega (sin contar gorras ocultas):
// - invertido: lo que costó el stock actual
// - valorVenta: lo que entraría si se vende todo al precio actual
// - utilidad: la ganancia de vender todo. Solo cuenta gorras con costo cargado, para no inflarla;
//   las que no tienen costo se reportan aparte.
export function valorInventario(gorras) {
  return gorras
    .filter((g) => g.estado !== 'oculto' && g.stock > 0)
    .reduce(
      (r, g) => {
        r.unidades += g.stock
        r.valorVenta += g.stock * g.precio
        if (g.costo === null || g.costo === undefined) {
          r.sinCosto.gorras += 1
          r.sinCosto.unidades += g.stock
          r.sinCosto.valorVenta += g.stock * g.precio
        } else {
          r.invertido += g.stock * g.costo
          r.valorVentaConCosto += g.stock * g.precio
          r.utilidad += g.stock * (g.precio - g.costo)
        }
        return r
      },
      {
        unidades: 0,
        invertido: 0,
        valorVenta: 0,
        valorVentaConCosto: 0,
        utilidad: 0,
        sinCosto: { gorras: 0, unidades: 0, valorVenta: 0 },
      }
    )
}
