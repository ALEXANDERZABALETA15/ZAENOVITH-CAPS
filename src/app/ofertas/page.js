import ListadoGorras from '@/components/ui/ListadoGorras'
import { getGorras, filtrarOfertas } from '@/lib/getGorras'
import { metadatosPagina } from '@/lib/seo'

// Generada en el servidor y en caché; se regenera como máximo cada 10 minutos
export const revalidate = 600

export const metadata = metadatosPagina({
  titulo: 'Ofertas — CROWNLUX',
  descripcion: 'Gorras premium con precio especial. Envío gratis en Ibagué y envíos a toda Colombia.',
  ruta: '/ofertas',
})

export default async function OfertasPage() {
  const gorras = filtrarOfertas(await getGorras())

  return (
    <ListadoGorras
      etiqueta="Precios Especiales"
      titulo="Ofertas"
      descripcion="Gorras premium a precios especiales por tiempo limitado. No te las pierdas."
      textoVacio="No hay ofertas disponibles en este momento"
      gorras={gorras}
    />
  )
}
