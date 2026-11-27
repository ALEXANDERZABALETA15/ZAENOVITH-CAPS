import { Suspense } from 'react'
import SincronizarColeccionURL from '@/components/ui/SincronizarColeccionURL'
import Hero from '@/components/ui/Hero'
import PanelTemporada from '@/components/ui/PanelTemporada'
import Confianza from '@/components/ui/Confianza'
import Colecciones from '@/components/ui/Colecciones'
import Novedades from '@/components/ui/Novedades'
import GorrasGrid from '@/components/ui/GorrasGrid'
import ComoProcesar from '@/components/ui/ComoProcesar'
import Resenas from '@/components/ui/Resenas'
import Contacto from '@/components/ui/Contacto'
import { ColeccionProvider } from '@/lib/ColeccionContext'
import { getGorras, filtrarNovedades, resumenOfertas } from '@/lib/getGorras'
import { temporadaActiva } from '@/lib/temporadas'
import { metadatosPagina, jsonLd, datosTienda, TITULO_SITIO, DESCRIPCION_SITIO } from '@/lib/seo'

// La página se genera en el servidor y queda en caché; se regenera como máximo cada 10 minutos
// (o al instante con /api/revalidar). El catálogo llega en el HTML: Google lo ve y no hay spinner.
export const revalidate = 600

export const metadata = metadatosPagina({
  titulo: TITULO_SITIO,
  descripcion: DESCRIPCION_SITIO,
  ruta: '/',
})

export default async function Home() {
  const gorras = await getGorras()
  // Panel de la temporada activa (src/lib/temporadas.js); con la caché puede aparecer
  // hasta 10 minutos tarde, y en el navegador se retira en cuanto termina
  const temporada = temporadaActiva()
  const panel = temporada?.panel ? resumenOfertas(gorras) : null

  return (
    <ColeccionProvider>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(datosTienda())} />
      <Suspense fallback={null}>
        <SincronizarColeccionURL />
      </Suspense>
      <main>
        <Hero />
        {panel && (
          <PanelTemporada
            temporada={temporada}
            gorras={panel.gorras}
            descuentoMaximo={panel.descuentoMaximo}
          />
        )}
        <Confianza />
        <Colecciones />
        <Novedades gorras={filtrarNovedades(gorras)} limite={4} />
        <GorrasGrid gorras={gorras} />
        <ComoProcesar />
        <Resenas />
        <Contacto />
      </main>
    </ColeccionProvider>
  )
}
