import Hero from '@/components/ui/Hero'
import GorrasGrid from '@/components/ui/GorrasGrid'
import Confianza from '@/components/ui/Confianza'
import Resenas from '@/components/ui/Resenas'
import Colecciones from '@/components/ui/Colecciones'
import ComoProcesar from '@/components/ui/ComoProcesar'
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
      </main>
    </ColeccionProvider>
  )
}
