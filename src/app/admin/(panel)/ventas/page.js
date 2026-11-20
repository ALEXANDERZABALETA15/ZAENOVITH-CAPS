import Link from 'next/link'
import { requerirAdmin } from '@/lib/admin/sesion'
import { ESTADOS_VENTA, METODOS_PAGO, nombreDe, formatoFecha, hoyBogota } from '@/lib/admin/catalogos'
import { ChipEstadoVenta } from '@/components/admin/Chips'
import { formatPrecio } from '@/lib/precio'

export const metadata = { title: 'Ventas · Admin' }

// "2026-11" → rango del mes en Colombia
function rangoMes(mes) {
  const [anio, numero] = mes.split('-').map(Number)
  const siguiente = numero === 12 ? `${anio + 1}-01` : `${anio}-${String(numero + 1).padStart(2, '0')}`
  return { desde: `${mes}-01T00:00:00-05:00`, hasta: `${siguiente}-01T00:00:00-05:00` }
}

function nombreMes(mes) {
  return new Date(`${mes}-15T12:00:00-05:00`).toLocaleDateString('es-CO', { month: 'long', year: 'numeric', timeZone: 'America/Bogota' })
}

export default async function Ventas({ searchParams }) {
  const parametros = await searchParams
  const mes = /^\d{4}-\d{2}$/.test(parametros.mes || '') ? parametros.mes : hoyBogota().slice(0, 7)
  const estado = parametros.estado || ''
  const { supabase } = await requerirAdmin()

  const { desde, hasta } = rangoMes(mes)
  const { data: ventas, error } = await supabase
    .from('ventas')
    .select('id, fecha, cliente_nombre, ciudad, estado, metodo_pago, total, venta_items(gorra_nombre, cantidad)')
    .gte('fecha', desde)
    .lt('fecha', hasta)
    .order('fecha', { ascending: false })
  if (error) throw new Error(`No se pudieron leer las ventas: ${error.message}. ¿Ya ejecutaste supabase/admin.sql?`)

  const validas = ventas.filter((v) => v.estado !== 'cancelado')
  const totalMes = validas.reduce((s, v) => s + v.total, 0)
  const unidadesMes = validas.reduce((s, v) => s + v.venta_items.reduce((t, i) => t + i.cantidad, 0), 0)
  const porDespachar = ventas.filter((v) => v.estado === 'pendiente' || v.estado === 'pagado').length
  const lista = estado ? ventas.filter((v) => v.estado === estado) : ventas

  const enlace = (cambios) => {
    const p = new URLSearchParams({ mes, ...(estado ? { estado } : {}), ...cambios })
    if (!p.get('estado')) p.delete('estado')
    return `/admin/ventas?${p}`
  }

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <h1>Ventas</h1>
          <p style={{ textTransform: 'capitalize' }}>{nombreMes(mes)}</p>
        </div>
        <div className="adm-acciones">
          <form className="adm-filtros">
            <input type="month" name="mes" defaultValue={mes} max={hoyBogota().slice(0, 7)} className="adm-input" aria-label="Mes" style={{ minWidth: 0 }} />
            {estado && <input type="hidden" name="estado" value={estado} />}
            <button type="submit" className="adm-btn">Ver</button>
          </form>
          <Link href="/admin/ventas/nueva" className="adm-btn adm-btn--primario">+ Registrar venta</Link>
        </div>
      </div>

      <div className="adm-kpis">
        <div className="adm-kpi">
          <div className="adm-kpi-etiqueta">Vendido en el mes</div>
          <div className="adm-kpi-valor">{formatPrecio(totalMes)}</div>
          <div className="adm-kpi-detalle">{validas.length} ventas · {unidadesMes} gorras</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-etiqueta">Por despachar</div>
          <div className="adm-kpi-valor">{porDespachar}</div>
          <div className="adm-kpi-detalle">pendientes o pagadas</div>
        </div>
      </div>

      <section className="adm-tarjeta">
        <nav className="adm-pestanas" style={{ marginBottom: 16 }} aria-label="Estado">
          <Link href={enlace({ estado: '' })} aria-current={!estado ? 'true' : undefined}>Todas ({ventas.length})</Link>
          {ESTADOS_VENTA.map((e) => {
            const cantidad = ventas.filter((v) => v.estado === e.valor).length
            return (
              <Link key={e.valor} href={enlace({ estado: e.valor })} aria-current={estado === e.valor ? 'true' : undefined}>
                {e.nombre} ({cantidad})
              </Link>
            )
          })}
        </nav>

        <div className="adm-tabla-scroll">
          <table className="adm-tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Productos</th>
                <th>Pago</th>
                <th>Estado</th>
                <th className="adm-numero">Total</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((v) => (
                <tr key={v.id}>
                  <td><Link href={`/admin/ventas/${v.id}`}>#{v.id}</Link></td>
                  <td className="adm-suave" style={{ whiteSpace: 'nowrap' }}>{formatoFecha(v.fecha)}</td>
                  <td>
                    <Link href={`/admin/ventas/${v.id}`}>{v.cliente_nombre || 'Sin nombre'}</Link>
                    {v.ciudad && <span className="adm-ayuda" style={{ display: 'block' }}>{v.ciudad}</span>}
                  </td>
                  <td className="adm-suave">
                    {v.venta_items.map((i) => `${i.cantidad > 1 ? `${i.cantidad}× ` : ''}${i.gorra_nombre}`).join(', ')}
                  </td>
                  <td className="adm-suave">{v.metodo_pago ? nombreDe(METODOS_PAGO, v.metodo_pago) : '—'}</td>
                  <td><ChipEstadoVenta estado={v.estado} /></td>
                  <td className="adm-numero" style={v.estado === 'cancelado' ? { textDecoration: 'line-through', opacity: 0.5 } : undefined}>
                    {formatPrecio(v.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!lista.length && <p className="adm-vacio">No hay ventas {estado ? 'con ese estado ' : ''}en este mes.</p>}
        </div>
      </section>
    </>
  )
}
