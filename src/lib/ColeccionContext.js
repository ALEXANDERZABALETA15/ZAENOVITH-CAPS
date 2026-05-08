'use client'

import { createContext, useContext, useState } from 'react'

const ColeccionContext = createContext(null)

export function ColeccionProvider({ children }) {
  const [coleccionActiva, setColeccionActiva] = useState('Todas')

  return (
    <ColeccionContext.Provider value={{ coleccionActiva, setColeccionActiva }}>
      {children}
    </ColeccionContext.Provider>
  )
}

export function useColeccion() {
  return useContext(ColeccionContext)
}