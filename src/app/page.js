'use client'

import Hero from '@/components/ui/Hero'
import Colecciones from '@/components/ui/Colecciones'
import GorrasGrid from '@/components/ui/GorrasGrid'
import Confianza from '@/components/ui/Confianza'
import ComoProcesar from '@/components/ui/ComoProcesar'
import Resenas from '@/components/ui/Resenas'
import Contacto from '@/components/ui/Contacto'
import { ColeccionProvider } from '@/lib/ColeccionContext'
import Faq from '@/components/ui/Faq'

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
        <Faq />
        <Contacto />
      </main>
    </ColeccionProvider>
  )
}