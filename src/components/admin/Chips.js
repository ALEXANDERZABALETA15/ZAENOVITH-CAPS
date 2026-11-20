import { ESTADOS_GORRA, ESTADOS_VENTA, STOCK_BAJO, nombreDe } from '@/lib/admin/catalogos'

const TONO_GORRA = { activo: 'verde', agotado: 'rojo', proximo: 'azul', oculto: undefined }
const TONO_VENTA = { pendiente: 'ambar', pagado: 'azul', enviado: 'azul', entregado: 'verde', cancelado: 'rojo' }

export function ChipEstadoGorra({ estado }) {
  const nombre = estado === 'oculto' ? 'Oculta' : nombreDe(ESTADOS_GORRA, estado)
  return <span className="adm-chip" data-tono={TONO_GORRA[estado]}>{nombre}</span>
}

export function ChipEstadoVenta({ estado }) {
  return <span className="adm-chip" data-tono={TONO_VENTA[estado]}>{nombreDe(ESTADOS_VENTA, estado)}</span>
}

export function ChipStock({ stock }) {
  const tono = stock === 0 ? 'rojo' : stock <= STOCK_BAJO ? 'ambar' : undefined
  return <span className="adm-chip adm-numero" data-tono={tono}>{stock}</span>
}
