'use server'

import { requerirAdmin } from '@/lib/admin/sesion'
import { refrescarTienda, mensajeError, entero, texto } from '@/lib/admin/servidor'
import { ESTADOS_VENTA, METODOS_PAGO, CANALES, hoyBogota } from '@/lib/admin/catalogos'

const valido = (lista, valor) => lista.some((x) => x.valor === valor)

// Fecha del formulario ("2026-11-19") → momento de la venta.
// Hoy = ahora mismo; un día anterior = mediodía de ese día en Colombia.
function fechaVenta(fecha) {
  if (!fecha || fecha === hoyBogota()) return null
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return undefined
  if (fecha > hoyBogota()) return undefined
  return `${fecha}T12:00:00-05:00`
}

function datosCliente(datos) {
  const envio = entero(datos.envio) ?? 0
  const descuento = entero(datos.descuento) ?? 0
  if (envio < 0 || descuento < 0) return { error: 'El envío y el descuento no pueden ser negativos.' }
  if (datos.metodoPago && !valido(METODOS_PAGO, datos.metodoPago)) return { error: 'Método de pago no válido.' }
  if (datos.canal && !valido(CANALES, datos.canal)) return { error: 'Canal no válido.' }

  return {
    cliente_nombre: texto(datos.clienteNombre),
    cliente_telefono: texto(datos.clienteTelefono),
    ciudad: texto(datos.ciudad),
    direccion: texto(datos.direccion),
    canal: datos.canal || 'whatsapp',
    metodo_pago: datos.metodoPago || null,
    envio,
    descuento,
    notas: texto(datos.notas),
  }
}

export async function registrarVenta(datos) {
  const { supabase } = await requerirAdmin()

  const items = (Array.isArray(datos.items) ? datos.items : []).map((i) => ({
    gorra_id: entero(i.gorraId),
    cantidad: entero(i.cantidad),
    precio_unitario: entero(i.precio),
  }))
  if (!items.length) return { error: 'Agrega al menos una gorra.' }
  if (items.some((i) => !i.gorra_id || !i.cantidad || i.cantidad <= 0)) return { error: 'Revisa las cantidades.' }
  if (items.some((i) => i.precio_unitario === null || i.precio_unitario < 0)) return { error: 'Revisa los precios.' }

  const cliente = datosCliente(datos)
  if (cliente.error) return cliente

  const estado = datos.estado || 'pendiente'
  if (!valido(ESTADOS_VENTA, estado) || estado === 'cancelado') return { error: 'Estado no válido.' }

  const fecha = fechaVenta(datos.fecha)
  if (fecha === undefined) return { error: 'La fecha no es válida (no puede ser futura).' }

  const { data: id, error } = await supabase.rpc('registrar_venta', {
    p_venta: { ...cliente, estado, fecha },
    p_items: items,
  })
  if (error) return { error: mensajeError(error, 'No se pudo registrar la venta.') }

  refrescarTienda()
  return { ok: true, id }
}

export async function cambiarEstadoVenta(id, estado) {
  const { supabase } = await requerirAdmin()
  if (!valido(ESTADOS_VENTA, estado)) return { error: 'Estado no válido.' }

  const { error } = await supabase.rpc('cambiar_estado_venta', { p_venta_id: entero(id), p_estado: estado })
  if (error) return { error: mensajeError(error, 'No se pudo cambiar el estado.') }

  // Cancelar devuelve stock: la tienda tiene que enterarse
  if (estado === 'cancelado') refrescarTienda()
  return { ok: true }
}

// Datos del cliente, pago, envío, descuento y notas. Los productos y el estado no se editan
// aquí: cambiarían el stock (para corregir productos, se cancela y se registra de nuevo).
export async function actualizarVenta(id, datos) {
  const { supabase } = await requerirAdmin()

  const cliente = datosCliente(datos)
  if (cliente.error) return cliente

  const { data: venta, error: errorLectura } = await supabase.from('ventas').select('subtotal').eq('id', entero(id)).maybeSingle()
  if (errorLectura) return { error: mensajeError(errorLectura) }
  if (!venta) return { error: 'La venta ya no existe.' }
  if (cliente.descuento > venta.subtotal) return { error: 'El descuento no puede ser mayor que el valor de los productos.' }

  const { error } = await supabase.from('ventas').update(cliente).eq('id', entero(id))
  if (error) return { error: mensajeError(error) }
  return { ok: true }
}
