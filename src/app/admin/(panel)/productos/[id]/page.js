import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requerirAdmin } from '@/lib/admin/sesion'
import { gorrasAdmin, coleccionesDe } from '@/lib/admin/consultas'
import FormProducto from '@/components/admin/FormProducto'
import { ChipEstadoGorra } from '@/components/admin/Chips'
import { formatoFecha } from '@/lib/admin/catalogos'

export const metadata = { title: 'Editar gorra · Admin' }

export default async function EditarGorra({ params }) {
  const { id } = await params
  const { supabase } = await requerirAdmin()
  const gorras = await gorrasAdmin(supabase)
  const gorra = gorras.find((g) => String(g.id) === id)
  if (!gorra) notFound()

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <Link href="/admin/productos" className="adm-ayuda">← Productos</Link>
          <h1>{gorra.nombre}</h1>
          <p>
            #{gorra.id} · <ChipEstadoGorra estado={gorra.estado} /> · Última edición {formatoFecha(gorra.actualizada, { hora: true })}
          </p>
        </div>
        <div className="adm-acciones">
          {gorra.estado !== 'oculto' && (
            <a href={`/gorra/${gorra.id}`} target="_blank" rel="noopener noreferrer" className="adm-btn">Ver en la tienda ↗</a>
          )}
          <Link href={`/admin/inventario/movimientos?gorra=${gorra.id}`} className="adm-btn">Historial de stock</Link>
        </div>
      </div>
      <FormProducto key={gorra.actualizada} gorra={gorra} colecciones={coleccionesDe(gorras)} />
    </>
  )
}
