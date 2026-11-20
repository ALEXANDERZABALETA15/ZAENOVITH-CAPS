import Link from 'next/link'
import { requerirAdmin } from '@/lib/admin/sesion'
import { gorrasAdmin, coleccionesDe } from '@/lib/admin/consultas'
import FormProducto from '@/components/admin/FormProducto'

export const metadata = { title: 'Nueva gorra · Admin' }

export default async function NuevaGorra() {
  const { supabase } = await requerirAdmin()
  const colecciones = coleccionesDe(await gorrasAdmin(supabase))

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <Link href="/admin/productos" className="adm-ayuda">← Productos</Link>
          <h1>Nueva gorra</h1>
        </div>
      </div>
      <FormProducto colecciones={colecciones} />
    </>
  )
}
