import Link from 'next/link'
import { requerirAdmin } from '@/lib/admin/sesion'
import FormProducto from '@/components/admin/FormProducto'

export const metadata = { title: 'Nueva gorra · Admin' }

export default async function NuevaGorra() {
  await requerirAdmin()

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <Link href="/admin/productos" className="adm-ayuda">← Productos</Link>
          <h1>Nueva gorra</h1>
        </div>
      </div>
      <FormProducto />
    </>
  )
}
