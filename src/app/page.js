'use client'

import { Suspense } from 'react'
import SincronizarColeccionURL from '@/components/ui/SincronizarColeccionURL'
import Hero from '@/components/ui/Hero'
import Confianza from '@/components/ui/Confianza'
import Colecciones from '@/components/ui/Colecciones'
import Novedades from '@/components/ui/Novedades'
import GorrasGrid from '@/components/ui/GorrasGrid'
import ComoProcesar from '@/components/ui/ComoProcesar'
import Resenas from '@/components/ui/Resenas'
import Contacto from '@/components/ui/Contacto'
import { ColeccionProvider } from '@/lib/ColeccionContext'

export default function Home() {
  return (
    <ColeccionProvider>
      <Suspense fallback={null}>
        <SincronizarColeccionURL />
      </Suspense>
      <main>
        <Hero />
        <Confianza />
        <Colecciones />
        <Novedades limite={4} />
        <GorrasGrid />
        <ComoProcesar />
        <Resenas />
        <Contacto />
      </main>
    </ColeccionProvider>
  )
}
