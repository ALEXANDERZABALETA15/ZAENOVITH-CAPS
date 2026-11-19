import ListadoGorras from '@/components/ui/ListadoGorras'
import { getGorras, filtrarNovedades } from '@/lib/getGorras'
import { metadatosPagina } from '@/lib/seo'

// Generada en el servidor y en caché; se regenera como máximo cada 10 minutos
export const revalidate = 600

export const metadata = metadatosPagina({
  titulo: 'Novedades — CROWNLUX',
  descripcion: 'Las últimas gorras que llegaron a CROWNLUX. Envío gratis en Ibagué y envíos a toda Colombia.',
  ruta: '/novedades',
})

export default async function NovedadesPage() {
  const gorras = filtrarNovedades(await getGorras())

  return (
    <ListadoGorras
      etiqueta="Recién Llegadas"
      titulo="Novedades"
      descripcion="Las últimas piezas que llegaron a CROWNLUX. Sé el primero en tenerlas."
      textoVacio="Próximamente nuevas llegadas"
      gorras={gorras}
    />
  )
}
