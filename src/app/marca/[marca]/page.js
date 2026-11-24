import { notFound } from 'next/navigation'
import ListadoGorras from '@/components/ui/ListadoGorras'
import { getGorras, filtrarMarca, marcasDisponibles } from '@/lib/getGorras'
import { coleccionesDisponibles } from '@/lib/colecciones'
import { metadatosPagina, jsonLd, datosListado, datosMigas } from '@/lib/seo'
import { rutaGorra, rutaMarca } from '@/lib/rutas'

// Una página por marca (/marca/new-era…), para búsquedas como "gorras New Era Colombia".
// Las marcas salen solas del campo "Marca" de cada gorra en el admin: una gorra sin marca
// no aparece en ninguna de estas páginas.
export const revalidate = 600

export async function generateStaticParams() {
  return marcasDisponibles(await getGorras()).map((m) => ({ marca: m.slug }))
}

// Marca sin gorras publicadas (o que no existe) → 404 real
async function cargar(params) {
  const { marca: slug } = await params
  const gorras = await getGorras()
  const marca = marcasDisponibles(gorras).find((m) => m.slug === slug)
  if (!marca) notFound()

  return {
    gorras,
    marca,
    lista: filtrarMarca(gorras, slug),
    titulo: `Gorras ${marca.nombre}`,
    descripcion: `Gorras ${marca.nombre} en CROWNLUX: modelos seleccionados por su calidad, material y diseño.`,
    ruta: rutaMarca(marca.nombre),
  }
}

export async function generateMetadata({ params }) {
  const m = await cargar(params)
  return metadatosPagina({
    titulo: `${m.titulo} en Colombia — CROWNLUX`,
    descripcion: `${m.descripcion} ${m.lista.length} ${m.lista.length === 1 ? 'modelo' : 'modelos'}. Envío gratis en Ibagué y envíos a toda Colombia.`,
    ruta: m.ruta,
  })
}

export default async function MarcaPage({ params }) {
  const m = await cargar(params)

  const relacionados = [
    ...marcasDisponibles(m.gorras)
      .filter((o) => o.slug !== m.marca.slug)
      .slice(0, 6)
      .map((o) => ({ nombre: o.nombre, href: rutaMarca(o.nombre) })),
    ...coleccionesDisponibles(m.gorras).map((c) => ({ nombre: `Colección ${c.nombre}`, href: `/coleccion/${c.clave}` })),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(datosListado({
          nombre: m.titulo,
          descripcion: m.descripcion,
          ruta: m.ruta,
          rutasGorras: m.lista.map(rutaGorra),
        }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(datosMigas([
          { nombre: 'Inicio', ruta: '/' },
          { nombre: m.marca.nombre, ruta: m.ruta },
        ]))}
      />
      <ListadoGorras
        etiqueta="Marca"
        titulo={m.titulo}
        descripcion={m.descripcion}
        textoVacio="No hay gorras de esta marca por ahora"
        gorras={m.lista}
        relacionados={relacionados}
      />
    </>
  )
}
