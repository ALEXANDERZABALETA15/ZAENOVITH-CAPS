import Link from 'next/link'
import { requerirAdmin } from '@/lib/admin/sesion'
import { MOTIVOS_MOVIMIENTO, formatoFecha } from '@/lib/admin/catalogos'

export const metadata = { title: 'Movimientos · Admin' }

const LIMITE = 300

export default async function Movimientos({ searchParams }) {
  const { gorra } = await searchParams
  const { supabase } = await requerirAdmin()

  let consulta = supabase
    .from('movimientos_inventario')
    .select('id, created_at, cantidad, stock_resultante, motivo, nota, venta_id, gorra_id, gorras(nombre)')
    .order('created_at', { ascending: false })
    .limit(LIMITE)
  if (gorra) consulta = consulta.eq('gorra_id', gorra)

  const { data: movimientos, error } = await consulta
  if (error) throw new Error(`No se pudo leer el historial: ${error.message}`)

  const nombreGorra = gorra && movimientos[0]?.gorras?.nombre

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <Link href="/admin/inventario" className="adm-ayuda">← Inventario</Link>
          <h1>Movimientos{nombreGorra ? `: ${nombreGorra}` : ''}</h1>
          <p>Últimos {LIMITE} cambios de stock{gorra ? ' de esta gorra' : ''}.</p>
        </div>
        {gorra && <Link href="/admin/inventario/movimientos" className="adm-btn">Ver todas las gorras</Link>}
      </div>

      <section className="adm-tarjeta">
        <div className="adm-tabla-scroll">
          <table className="adm-tabla">
            <thead>
              <tr>
                <th>Fecha</th>
                {!gorra && <th>Gorra</th>}
                <th>Motivo</th>
                <th className="adm-numero">Cambio</th>
                <th className="adm-numero">Quedó en</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {movimientos.map((m) => (
                <tr key={m.id}>
                  <td className="adm-suave" style={{ whiteSpace: 'nowrap' }}>{formatoFecha(m.created_at, { hora: true })}</td>
                  {!gorra && (
                    <td>
                      <Link href={`/admin/inventario/movimientos?gorra=${m.gorra_id}`}>{m.gorras?.nombre ?? `#${m.gorra_id}`}</Link>
                    </td>
                  )}
                  <td>{MOTIVOS_MOVIMIENTO[m.motivo] ?? m.motivo}</td>
                  <td className={`adm-numero ${m.cantidad > 0 ? 'adm-verde' : 'adm-rojo'}`}>
                    {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                  </td>
                  <td className="adm-numero">{m.stock_resultante}</td>
                  <td className="adm-suave">
                    {m.venta_id && <Link href={`/admin/ventas/${m.venta_id}`} style={{ textDecoration: 'underline' }}>Venta #{m.venta_id}</Link>}
                    {m.venta_id && m.nota && ' · '}
                    {m.nota}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!movimientos.length && <p className="adm-vacio">Todavía no hay movimientos.</p>}
        </div>
      </section>
    </>
  )
}
