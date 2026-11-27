'use client'

import { useCuentaRegresiva } from '@/lib/useCuentaRegresiva'

const LETRAS = ['d', 'h', 'm', 's']

// Cuenta regresiva de la temporada en cajitas (03d 14h 22m 09s); estilos en globals.css ("Temporada").
// Los lectores de pantalla oyen la fecha de cierre en vez de un número que cambia cada segundo.
export default function RelojTemporada({ temporada, className = '' }) {
  const valores = useCuentaRegresiva(temporada.fin)

  return (
    <span className={`reloj-temporada ${className}`}>
      <span className="reloj-temporada__titulo" aria-hidden="true">Termina en</span>
      <span className="sr-only">Termina {temporada.cierre}</span>
      <span className="reloj-temporada__cajas" aria-hidden="true">
        {valores.map((valor, i) => (
          <span key={LETRAS[i]} className="reloj-temporada__caja">
            {valor}
            <span className="reloj-temporada__letra">{LETRAS[i]}</span>
          </span>
        ))}
      </span>
    </span>
  )
}
