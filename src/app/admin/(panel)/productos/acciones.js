'use server'

import { requerirAdmin } from '@/lib/admin/sesion'
import { firmaSubida, borrarFotos } from '@/lib/admin/cloudinary'
import { refrescarTienda, mensajeError, entero, texto } from '@/lib/admin/servidor'
import { ESTADOS_GORRA, BADGES, COLECCIONES, slugDe } from '@/lib/admin/catalogos'

const MAXIMO_FOTOS = 6
const COLUMNAS_FOTOS = ['foto1', 'foto2', 'foto3', 'foto4', 'foto5', 'foto6']

export async function firmarSubidaFoto() {
  await requerirAdmin()
  try {
    return { firma: firmaSubida() }
  } catch (e) {
    return { error: e.message }
  }
}

function validar(datos) {
  const nombre = texto(datos.nombre)
  const precio = entero(datos.precio)
  const precioAnterior = entero(datos.precioAnterior)
  const costo = entero(datos.costo)
  const fotos = (Array.isArray(datos.fotos) ? datos.fotos : []).filter((f) => typeof f === 'string' && f.startsWith('https://'))

  if (!nombre) return { error: 'El nombre es obligatorio.' }
  if (!COLECCIONES.some((c) => c.valor === datos.coleccion)) return { error: 'Elige una colección.' }
  if (!texto(datos.color)) return { error: 'El color es obligatorio.' }
  if (precio === null || precio <= 0) return { error: 'El precio debe ser mayor que 0.' }
  if (precioAnterior !== null && precioAnterior <= precio) {
    return { error: 'El precio anterior debe ser mayor que el precio actual (o dejarlo vacío).' }
  }
  if (costo !== null && costo < 0) return { error: 'El costo no puede ser negativo.' }
  if (!ESTADOS_GORRA.some((e) => e.valor === datos.estado)) return { error: 'Estado no válido.' }
  if (datos.badge && !BADGES.includes(datos.badge)) return { error: 'Etiqueta no válida.' }
  if (fotos.length > MAXIMO_FOTOS) return { error: `Máximo ${MAXIMO_FOTOS} fotos.` }

  const fila = {
    nombre,
    precio,
    precio_anterior: precioAnterior,
    coleccion: datos.coleccion,
    color: texto(datos.color),
    descripcion: texto(datos.descripcion) ?? '', // la base no acepta null, pero sí vacío
    estado: datos.estado,
    badge: datos.badge || null,
    marca: texto(datos.marca),
    tipo: texto(datos.tipo),
    talla: texto(datos.talla),
    material: texto(datos.material),
    visera: texto(datos.visera),
  }
  COLUMNAS_FOTOS.forEach((columna, i) => {
    fila[columna] = fotos[i] ?? null
  })

  return { fila, costo, fotos }
}

async function guardarCosto(supabase, gorraId, costo) {
  const { error } = costo === null
    ? await supabase.from('gorras_costos').delete().eq('gorra_id', gorraId)
    : await supabase.from('gorras_costos').upsert({ gorra_id: gorraId, costo })
  return error
}

// id = null → crea una gorra nueva
export async function guardarGorra(id, datos) {
  const { supabase } = await requerirAdmin()

  const validado = validar(datos)
  if (validado.error) return validado
  const { fila, costo, fotos } = validado

  if (id === null) {
    const stockInicial = entero(datos.stockInicial) ?? 0
    if (stockInicial < 0) return { error: 'El stock inicial no puede ser negativo.' }

    // slug y sku siguen el formato de las gorras existentes ("nombre-en-slug-12", "CRW-0012"),
    // pero llevan el id, que solo se conoce después de insertar: se crea con valores temporales
    // únicos y luego se completan. Al editar no se cambian, para no romper enlaces.
    const base = slugDe(fila.nombre)
    const marca = Date.now().toString(36)

    // La gorra nace con 0 y el stock inicial entra como movimiento, así queda en el historial
    const { data, error } = await supabase
      .from('gorras')
      .insert({ ...fila, stock: 0, slug: `${base}-${marca}`, sku: `CRW-TMP-${marca}` })
      .select('id')
      .single()
    if (error) return { error: mensajeError(error) }

    const { error: errorSlug } = await supabase
      .from('gorras')
      .update({ slug: `${base}-${data.id}`, sku: `CRW-${String(data.id).padStart(4, '0')}` })
      .eq('id', data.id)
    if (errorSlug) console.error('Supabase (slug/sku):', errorSlug) // la gorra ya quedó con valores válidos

    const errorCosto = await guardarCosto(supabase, data.id, costo)
    if (errorCosto) return { error: mensajeError(errorCosto, 'La gorra se creó, pero no se pudo guardar el costo.'), id: data.id }

    if (stockInicial > 0) {
      const { error: errorStock } = await supabase.rpc('mover_stock', {
        p_gorra_id: data.id,
        p_cantidad: stockInicial,
        p_motivo: 'inicial',
      })
      if (errorStock) return { error: mensajeError(errorStock, 'La gorra se creó, pero no se pudo cargar el stock.'), id: data.id }
    }

    refrescarTienda()
    return { ok: true, id: data.id }
  }

  // Edición: el stock NO se toca aquí (se cambia desde Inventario para que quede registrado)
  const { data: anterior, error: errorLectura } = await supabase
    .from('gorras')
    .select(COLUMNAS_FOTOS.join(','))
    .eq('id', id)
    .maybeSingle()
  if (errorLectura) return { error: mensajeError(errorLectura) }
  if (!anterior) return { error: 'La gorra ya no existe.' }

  const { error } = await supabase.from('gorras').update(fila).eq('id', id)
  if (error) return { error: mensajeError(error) }

  const errorCosto = await guardarCosto(supabase, id, costo)
  if (errorCosto) return { error: mensajeError(errorCosto, 'Se guardó la gorra, pero no el costo.') }

  // Fotos que se quitaron o reemplazaron: se borran de Cloudinary solo después de guardar,
  // para que la web nunca quede apuntando a una foto que ya no existe.
  const quitadas = COLUMNAS_FOTOS.map((c) => anterior[c]).filter((url) => url && !fotos.includes(url))
  await borrarFotos(quitadas)

  refrescarTienda()
  return { ok: true, id }
}

// Fotos subidas en un formulario que al final no se guardó
export async function descartarFotosSinGuardar(urls) {
  const { supabase } = await requerirAdmin()
  if (!Array.isArray(urls) || !urls.length) return

  // Nunca borrar una foto que alguna gorra esté usando
  const { data, error } = await supabase.from('gorras').select(COLUMNAS_FOTOS.join(','))
  if (error) return
  const enUso = new Set(data.flatMap((g) => COLUMNAS_FOTOS.map((c) => g[c])))
  await borrarFotos(urls.filter((u) => !enUso.has(u)))
}

export async function eliminarGorra(id) {
  const { supabase } = await requerirAdmin()

  const { count, error: errorVentas } = await supabase
    .from('venta_items')
    .select('id', { count: 'exact', head: true })
    .eq('gorra_id', id)
  if (errorVentas) return { error: mensajeError(errorVentas) }
  if (count > 0) {
    return { error: 'Esta gorra tiene ventas registradas. Para sacarla de la web, cámbiale el estado a "Oculta": así conservas el historial.' }
  }

  const { data: gorra } = await supabase.from('gorras').select(COLUMNAS_FOTOS.join(',')).eq('id', id).maybeSingle()

  const { error } = await supabase.from('gorras').delete().eq('id', id)
  if (error) return { error: mensajeError(error, 'No se pudo eliminar la gorra.') }

  if (gorra) await borrarFotos(COLUMNAS_FOTOS.map((c) => gorra[c]).filter(Boolean))

  refrescarTienda()
  return { ok: true }
}
