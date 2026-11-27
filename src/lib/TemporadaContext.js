'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { temporadaActiva, temporadaPorId } from './temporadas'

const TemporadaContext = createContext(null)

// idInicial lo calcula el servidor (layout.js), así el HTML y la primera pintura coinciden.
// Después el navegador revisa la fecha cada 30 s: aunque la página venga de caché
// (páginas estáticas o regeneradas cada 10 min), la temporada se enciende y se apaga a tiempo.
export function TemporadaProvider({ idInicial = null, children }) {
  const [id, setId] = useState(idInicial)

  useEffect(() => {
    const revisar = () => setId(temporadaActiva()?.id ?? null)
    revisar()
    const intervalo = setInterval(revisar, 30000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <TemporadaContext.Provider value={temporadaPorId(id)}>
      {children}
    </TemporadaContext.Provider>
  )
}

// La temporada activa (ver src/lib/temporadas.js) o null
export function useTemporada() {
  return useContext(TemporadaContext)
}
