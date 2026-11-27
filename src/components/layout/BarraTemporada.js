'use client'

import Link from 'next/link'
import RelojTemporada from '@/components/ui/RelojTemporada'

// Barra superior durante una temporada (src/lib/temporadas.js): reemplaza la del envío gratis.
// Toda la barra es un enlace. Estilos en globals.css ("Temporada").
export default function BarraTemporada({ temporada }) {
  const { barra } = temporada

  return (
    <Link
      href={barra.enlace.href}
      className="barra-temporada"
      style={barra.fondo ? { background: barra.fondo } : undefined}
    >
      <span className="barra-temporada__titulo">
        {barra.titulo}
        {barra.extra && <span className="barra-temporada__extra"> {barra.extra}</span>}
      </span>
      <span className="barra-temporada__separador" aria-hidden="true" />
      {temporada.contador ? (
        <RelojTemporada temporada={temporada} className="reloj-temporada--barra" />
      ) : (
        <span className="barra-temporada__texto">{barra.texto}</span>
      )}
      <span className="barra-temporada__separador barra-temporada__ancho" aria-hidden="true" />
      <span className="barra-temporada__enlace">{barra.enlace.texto}</span>
    </Link>
  )
}
