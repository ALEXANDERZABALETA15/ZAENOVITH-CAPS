import 'server-only'
import { revalidatePath } from 'next/cache'

// La tienda está en caché (ISR). Después de cualquier cambio que se vea en la web
// (producto, precio, foto, stock, estado) se marca todo como desactualizado y cada página
// se regenera en su próxima visita. Es lo mismo que hace /api/revalidar.
export function refrescarTienda() {
  revalidatePath('/', 'layout')
}

// Los errores que lanzan las funciones SQL (RAISE EXCEPTION) ya vienen escritos para el usuario.
// Los demás se traducen a algo entendible.
export function mensajeError(error, porDefecto = 'No se pudo guardar. Inténtalo de nuevo.') {
  if (!error) return porDefecto
  if (error.code === 'P0001' && error.message) return error.message
  if (error.code === '42501') return 'No tienes permiso para hacer esto. Vuelve a iniciar sesión.'
  if (error.code === '23503') return 'No se puede: hay otros registros que dependen de este.'
  if (error.code === '42P01' || error.code === 'PGRST202' || error.code === 'PGRST205') {
    return 'Falta preparar la base de datos: ejecuta supabase/admin.sql en Supabase.'
  }
  console.error('Supabase:', error)
  return porDefecto
}

// Convierte el valor de un campo de formulario en entero (null si está vacío)
export function entero(valor) {
  if (valor === null || valor === undefined || valor === '') return null
  const numero = Number(String(valor).replace(/[^\d-]/g, ''))
  return Number.isFinite(numero) ? Math.trunc(numero) : null
}

export function texto(valor) {
  const limpio = String(valor ?? '').trim()
  return limpio || null
}
