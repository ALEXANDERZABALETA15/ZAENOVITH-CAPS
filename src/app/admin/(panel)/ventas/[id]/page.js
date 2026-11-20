import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requerirAdmin } from '@/lib/admin/sesion'
import { formatoFecha, miniatura, whatsappCliente } from '@/lib/admin/catalogos'
import { ChipEstadoVenta } from '@/components/admin/Chips'
import { EstadoVenta, DatosVenta } from '@/components/admin/GestionVenta'
import { formatPrecio } from '@/lib/precio'

export const metadata = { title: 'Venta · Admin' }

export default async function DetalleVenta({ params, searchParams }) {
  const { id } = await params
  const { nueva } = await searchParams
  if (!/^\d+$/.test(id)) notFound()
  const { supabase } = await requerirAdmin()

  const { data: venta, error } = await supabase
    .from('ventas')
    .select('*, venta_items(id, gorra_id, gorra_nombre, cantidad, precio_unitario, costo_unitario, gorras(foto1))')
    .eq('id', id)
    .maybeSingle()
  if (error) throw new Error(`No se pudo leer la venta: ${error.message}`)
  if (!venta) notFound()

  const items = venta.venta_items
  const costoTotal = items.reduce((s, i) => s + (i.costo_unitario ?? 0) * i.cantidad, 0)
  const faltanCostos = items.some((i) => i.costo_unitario === null)
  const ganancia = venta.subtotal - venta.descuento - costoTotal
  const cancelada = venta.estado === 'cancelado'

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <Link href="/admin/ventas" className="adm-ayuda">← Ventas</Link>
          <h1>Venta #{venta.id}</h1>
          <p>{formatoFecha(venta.fecha, { hora: true })} · <ChipEstadoVenta estado={venta.estado} /></p>
        </div>
        <div className="adm-acciones">
          {venta.cliente_telefono && (
            <a href={whatsappCliente(venta.cliente_telefono)} target="_blank" rel="noopener noreferrer" className="adm-btn">
              WhatsApp del cliente ↗
            </a>
          )}
          <Link href="/admin/ventas/nueva" className="adm-btn">+ Otra venta</Link>
        </div>
      </div>

      {nueva && <div className="adm-alerta" data-tono="ok" role="status">Venta registrada y stock descontado.</div>}

      <section className="adm-tarjeta">
        <h2>Estado</h2>
        <EstadoVenta venta={venta} />
      </section>

      <div className="adm-rejilla">
        <section className="adm-tarjeta">
          <h2>Productos</h2>
          <table className="adm-tabla">
            <tbody>
              {items.map((i) => (
                <tr key={i.id}>
                  <td>
                    <div className="adm-producto" style={{ minWidth: 0 }}>
                      <img src={i.gorras?.foto1 ? miniatura(i.gorras.foto1) : '/sin-foto.svg'} alt="" className="adm-miniatura" />
                      <span>
                        {i.gorra_id ? <Link href={`/admin/productos/${i.gorra_id}`}>{i.gorra_nombre}</Link> : i.gorra_nombre}
                        <span className="adm-ayuda" style={{ display: 'block' }}>
                          {i.cantidad} × {formatPrecio(i.precio_unitario)}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="adm-numero">{formatPrecio(i.cantidad * i.precio_unitario)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="adm-totales" style={{ marginTop: 16, opacity: cancelada ? 0.5 : 1 }}>
            <span className="adm-suave">Productos</span><span className="adm-numero">{formatPrecio(venta.subtotal)}</span>
            {venta.descuento > 0 && (<><span className="adm-suave">Descuento</span><span className="adm-numero">−{formatPrecio(venta.descuento)}</span></>)}
            {venta.envio > 0 && (<><span className="adm-suave">Envío</span><span className="adm-numero">{formatPrecio(venta.envio)}</span></>)}
            <strong>Total</strong><strong className="adm-numero">{formatPrecio(venta.total)}</strong>
            {!cancelada && (
              <>
                <span className="adm-suave">Ganancia{faltanCostos ? ' (aprox.)' : ''}</span>
                <span className="adm-numero adm-verde">{formatPrecio(ganancia)}</span>
              </>
            )}
          </div>
          <p className="adm-ayuda" style={{ marginTop: 12 }}>
            Para corregir productos o cantidades: cancela esta venta (devuelve el stock) y regístrala de nuevo.
          </p>
        </section>

        <section className="adm-tarjeta">
          <h2>Cliente y pago</h2>
          <DatosVenta key={venta.updated_at} venta={venta} />
        </section>
      </div>
    </>
  )
}
