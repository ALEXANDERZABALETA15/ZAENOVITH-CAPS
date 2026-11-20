import Link from 'next/link'
import { requerirAdmin } from '@/lib/admin/sesion'
import { gorrasAdmin } from '@/lib/admin/consultas'
import FormVenta from '@/components/admin/FormVenta'

export const metadata = { title: 'Nueva venta · Admin' }

export default async function NuevaVenta() {
  const { supabase } = await requerirAdmin()
  const gorras = (await gorrasAdmin(supabase))
    .filter((g) => g.estado !== 'oculto')
    .sort((a, b) => b.stock - a.stock || a.nombre.localeCompare(b.nombre, 'es'))
    .map((g) => ({ id: g.id, nombre: g.nombre, color: g.color, precio: g.precio, costo: g.costo, stock: g.stock, foto: g.fotos[0] ?? null }))

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <Link href="/admin/ventas" className="adm-ayuda">← Ventas</Link>
          <h1>Nueva venta</h1>
          <p>Al registrarla se descuenta el stock. Si la cancelas después, las unidades vuelven al inventario.</p>
        </div>
      </div>
      <FormVenta gorras={gorras} />
    </>
  )
}
