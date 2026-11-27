'use client'

import { useId } from 'react'
import { useTemporada } from '@/lib/TemporadaContext'

// Colores de la marca; una temporada puede cambiarlos con sello.colores (ver src/lib/temporadas.js)
const COLORES = {
  fondo: '#0a0a0a',
  borde: '#c7c7c7',
  interior: '#3fb68b',
  texto: '#c7c7c7',
  centro: '#ffffff',
}

const ESTRELLA = '50,37 53.23,45.55 62.36,45.98 55.23,51.7 57.64,60.52 50,55.5 42.36,60.52 44.77,51.7 37.64,45.98 46.77,45.55'

// Sello circular de la temporada activa: texto en el anillo y monograma (o estrella) al centro.
// Decorativo: lo que dice ya está escrito cerca (barra, etiqueta de la gorra).
// El tamaño lo fija cada clase en globals.css ("Temporada"); `tamano` es el de respaldo.
export default function SelloTemporada({ tamano = 64, girar = false, className = '' }) {
  const temporada = useTemporada()
  const id = useId()
  if (!temporada?.sello) return null

  const { anillo, centro, icono } = temporada.sello
  const c = { ...COLORES, ...temporada.sello.colores }
  const arco = `sello-${id.replace(/[^\w-]/g, '')}`

  return (
    <svg
      viewBox="0 0 100 100"
      width={tamano}
      height={tamano}
      aria-hidden="true"
      focusable="false"
      className={`sello-temporada ${className}`}
    >
      <defs>
        <path id={arco} d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
      </defs>
      <circle cx="50" cy="50" r="48" fill={c.fondo} stroke={c.borde} strokeWidth="1.5" />
      <circle cx="50" cy="50" r="28" fill="none" stroke={c.interior} strokeWidth="1.2" />
      <g className={girar ? 'sello-temporada__giro' : undefined}>
        <text className="sello-temporada__anillo" fill={c.texto}>
          {/* textLength reparte las letras en toda la vuelta, sea cual sea el texto */}
          <textPath href={`#${arco}`} textLength="226" lengthAdjust="spacing">{anillo}</textPath>
        </text>
      </g>
      {icono === 'estrella' ? (
        <polygon points={ESTRELLA} fill={c.centro} />
      ) : (
        <text x="50" y="58.5" textAnchor="middle" className="sello-temporada__centro" fill={c.centro}>
          {centro}
        </text>
      )}
    </svg>
  )
}
