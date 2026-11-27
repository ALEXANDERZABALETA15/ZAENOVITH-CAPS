'use client'

import { useTemporada } from '@/lib/TemporadaContext'
import RelojTemporada from './RelojTemporada'

// Ficha de una gorra en oferta durante una temporada (src/lib/temporadas.js).
// Fuera de temporada, o si la gorra no está en oferta, no muestran nada.

// "Precio Black Friday", encima del precio
export function EtiquetaPrecioTemporada({ enOferta }) {
  const temporada = useTemporada()
  if (!enOferta || !temporada?.precioOferta) return null

  return (
    <p className="precio-temporada">
      <span className="punto-temporada" aria-hidden="true" />
      {temporada.precioOferta}
    </p>
  )
}

// Cuánto falta para que termine, debajo del precio
export function RelojOferta({ enOferta }) {
  const temporada = useTemporada()
  if (!enOferta || !temporada?.contador) return null

  return <RelojTemporada temporada={temporada} className="reloj-temporada--ficha" />
}
