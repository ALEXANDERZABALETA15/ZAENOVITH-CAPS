'use client'

import Hero from '@/components/ui/Hero'
import Colecciones from '@/components/ui/Colecciones'
import GorrasGrid from '@/components/ui/GorrasGrid'
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
        <Resenas />
        <Contacto />
      </main>
    </ColeccionProvider>
  )
}