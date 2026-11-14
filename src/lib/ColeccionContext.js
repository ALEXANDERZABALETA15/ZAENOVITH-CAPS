'use client'

import { createContext, useContext, useState } from 'react'
import { TODAS } from './colecciones'

const ColeccionContext = createContext(null)

// coleccionActiva guarda la clave normalizada (ver claveColeccion), no el nombre visible.
export function ColeccionProvider({ children }) {
  const [coleccionActiva, setColeccionActiva] = useState(TODAS)

  return (
    <ColeccionContext.Provider value={{ coleccionActiva, setColeccionActiva }}>
      {children}
    </ColeccionContext.Provider>
  )
}

export function useColeccion() {
  return useContext(ColeccionContext)
}
