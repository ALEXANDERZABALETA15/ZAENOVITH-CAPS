// Valores y nombres visibles del panel. Deben coincidir con los CHECK de supabase/admin.sql.
import { transformar } from '@/lib/imagenes'

export const ESTADOS_GORRA = [
  { valor: 'activo', nombre: 'Disponible' },
  { valor: 'agotado', nombre: 'Agotada' },
  { valor: 'proximo', nombre: 'Próximamente' },
  { valor: 'oculto', nombre: 'Oculta (no sale en la web)' },
]

// Los mismos de src/lib/badges.js
export const BADGES = ['Nuevo', 'Destacado', 'Oferta', 'Exclusivo', 'Proximamente', 'Agotado']

export const TIPOS_GORRA = ['Snapback', 'Fitted', 'Trucker', 'Dad hat', 'Strapback']
export const VISERAS = ['Curva', 'Plana']

export const ESTADOS_VENTA = [
  { valor: 'pendiente', nombre: 'Pendiente de pago' },
  { valor: 'pagado', nombre: 'Pagada' },
  { valor: 'enviado', nombre: 'Enviada' },
  { valor: 'entregado', nombre: 'Entregada' },
  { valor: 'cancelado', nombre: 'Cancelada' },
]

// Flujo normal de una venta: cada estado tiene un siguiente paso
export const SIGUIENTE_ESTADO_VENTA = {
  pendiente: 'pagado',
  pagado: 'enviado',
  enviado: 'entregado',
}

export const METODOS_PAGO = [
  { valor: 'nequi', nombre: 'Nequi' },
  { valor: 'bancolombia', nombre: 'Bancolombia' },
  { valor: 'efectivo', nombre: 'Efectivo' },
  { valor: 'transferencia', nombre: 'Transferencia' },
  { valor: 'otro', nombre: 'Otro' },
]

export const CANALES = [
  { valor: 'whatsapp', nombre: 'WhatsApp' },
  { valor: 'instagram', nombre: 'Instagram' },
  { valor: 'presencial', nombre: 'Presencial' },
  { valor: 'otro', nombre: 'Otro' },
]

export const MOTIVOS_MOVIMIENTO = {
  inicial: 'Stock inicial',
  ingreso: 'Ingreso de mercancía',
  venta: 'Venta',
  cancelacion: 'Venta cancelada',
  devolucion: 'Devolución',
  perdida: 'Pérdida o daño',
  ajuste: 'Ajuste / conteo',
}

// Para buscar sin importar mayúsculas ni tildes: "Camión" → "camion"
export function normalizar(texto) {
  return String(texto ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export function nombreDe(lista, valor) {
  return lista.find((x) => x.valor === valor)?.nombre ?? valor ?? '—'
}

export const STOCK_BAJO = 3

// Miniatura del panel. Es exactamente la misma URL que genera el cargador de next/image
// para un ancho de 160 (src/lib/cargadorImagenes.js), así reutiliza la transformación
// que Cloudinary ya tiene guardada en vez de crear una nueva por cada foto.
export function miniatura(url) {
  return transformar(url, 'f_auto,q_auto,w_160,c_limit')
}

// ── Fechas: la tienda opera en Colombia (UTC-5 todo el año, sin horario de verano) ──

const ZONA = 'America/Bogota'

export function formatoFecha(iso, { hora = false } = {}) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-CO', {
    timeZone: ZONA,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...(hora ? { hour: 'numeric', minute: '2-digit' } : {}),
  })
}

// "2026-11-19" del día de hoy en Colombia
export function hoyBogota() {
  return new Date().toLocaleDateString('en-CA', { timeZone: ZONA })
}

// Inicio del día / mes en Colombia, como ISO para filtrar en Supabase
export function inicioDiaBogota(fecha = hoyBogota()) {
  return `${fecha}T00:00:00-05:00`
}

export function inicioMesBogota(fecha = hoyBogota()) {
  return `${fecha.slice(0, 7)}-01T00:00:00-05:00`
}

export function inicioSemanaBogota() {
  const hoy = new Date(`${hoyBogota()}T12:00:00-05:00`)
  const diasDesdeLunes = (hoy.getUTCDay() + 6) % 7
  hoy.setUTCDate(hoy.getUTCDate() - diasDesdeLunes)
  return inicioDiaBogota(hoy.toISOString().slice(0, 10))
}

// Mensaje para avisarle a un cliente que su gorra ya está disponible
export function mensajeGorraDisponible(nombreGorra, url) {
  return `Hola! Te escribimos de CROWNLUX. La gorra ${nombreGorra} que nos pediste ya está disponible: ${url}`
}

export function whatsappCliente(telefono, mensaje) {
  const digitos = (telefono || '').replace(/\D/g, '')
  const numero = digitos.length === 10 ? `57${digitos}` : digitos
  return `https://wa.me/${numero}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`
}
