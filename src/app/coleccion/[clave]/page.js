import { notFound } from 'next/navigation'
import ListadoGorras from '@/components/ui/ListadoGorras'
import { getGorras, filtrarColeccion, marcasDisponibles } from '@/lib/getGorras'
import { coleccionesDisponibles, datosColeccion, nombreColeccion } from '@/lib/colecciones'
import { metadatosPagina, jsonLd, datosListado, datosMigas } from '@/lib/seo'
import { rutaGorra, rutaMarca } from '@/lib/rutas'

// Una página por colección (/coleccion/premium…), para que Google pueda posicionar
// búsquedas como "gorras premium". En el inicio, /?coleccion=premium solo filtra el catálogo.
// Se regenera como máximo cada 10 minutos (o al instante al guardar desde el admin).
export const revalidate = 600

export async function generateStaticParams() {
  return coleccionesDisponibles(await getGorras()).map((c) => ({ clave: c.clave }))
}

// Colección sin gorras publicadas (o que no existe) → 404 real
async function cargar(params) {
  const { clave } = await params
  const gorras = await getGorras()
  const lista = filtrarColeccion(gorras, clave)
  if (!lista.length) notFound()

  const datos = datosColeccion(clave)
  const nombre = datos?.nombre ?? nombreColeccion(lista[0].coleccion)
  return {
    clave,
    gorras,
    lista,
    nombre,
    titulo: datos?.titulo ?? `Gorras ${nombre}`,
    descripcion: datos?.descripcion ?? `La colección ${nombre} de CROWNLUX.`,
    ruta: `/coleccion/${clave}`,
  }
}

export async function generateMetadata({ params }) {
  const c = await cargar(params)
  return metadatosPagina({
    titulo: `${c.titulo} en Colombia — CROWNLUX`,
    descripcion: `${c.descripcion} ${c.lista.length} ${c.lista.length === 1 ? 'modelo' : 'modelos'}. Envío gratis en Ibagué y envíos a toda Colombia.`,
    ruta: c.ruta,
  })
}

export default async function ColeccionPage({ params }) {
  const c = await cargar(params)

  // Otras colecciones y las marcas: enlaces internos para que Google recorra todo el catálogo
  const relacionados = [
    ...coleccionesDisponibles(c.gorras)
      .filter((o) => o.clave !== c.clave)
      .map((o) => ({ nombre: `Colección ${o.nombre}`, href: `/coleccion/${o.clave}` })),
    ...marcasDisponibles(c.gorras).slice(0, 6).map((m) => ({ nombre: m.nombre, href: rutaMarca(m.nombre) })),
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(datosListado({
          nombre: c.titulo,
          descripcion: c.descripcion,
          ruta: c.ruta,
          rutasGorras: c.lista.map(rutaGorra),
        }))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(datosMigas([
          { nombre: 'Inicio', ruta: '/' },
          { nombre: `Colección ${c.nombre}`, ruta: c.ruta },
        ]))}
      />
      <ListadoGorras
        etiqueta={`Colección ${c.nombre}`}
        titulo={c.titulo}
        descripcion={c.descripcion}
        textoVacio="No hay gorras en esta colección por ahora"
        gorras={c.lista}
        relacionados={relacionados}
      />
    </>
  )
}
