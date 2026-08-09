'use client'

import Hero from '@/components/ui/Hero'
import Colecciones from '@/components/ui/Colecciones'
import GorrasGrid from '@/components/ui/GorrasGrid'
import Confianza from '@/components/ui/Confianza'
import ComoProcesar from '@/components/ui/ComoProcesar'
import Resenas from '@/components/ui/Resenas'
import Contacto from '@/components/ui/Contacto'
import { ColeccionProvider } from '@/lib/ColeccionContext'

export default function Home() {
  return (
    <ColeccionProvider>
      <main>
        <Hero />
        <Colecciones />
        <GorrasGrid />
        <Confianza />
        <ComoProcesar />
        <Resenas />
        <Contacto />
      </main>
    </ColeccionProvider>
  )
}