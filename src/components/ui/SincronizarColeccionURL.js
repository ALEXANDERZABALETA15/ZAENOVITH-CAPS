'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useColeccion } from '@/lib/ColeccionContext'
import { claveColeccion } from '@/lib/colecciones'

// Aplica ?coleccion=urbano al filtro del catálogo.
// Lo usan la ruta de navegación del detalle y los links de colección del footer.
// Va dentro de <Suspense> porque useSearchParams lo exige en páginas estáticas.
export default function SincronizarColeccionURL() {
  const searchParams = useSearchParams()
  const { setColeccionActiva } = useColeccion()
  const coleccion = searchParams.get('coleccion')

  useEffect(() => {
    if (coleccion) setColeccionActiva(claveColeccion(coleccion))
  }, [coleccion, setColeccionActiva])

  return null
}
