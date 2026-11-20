import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requerirAdmin } from '@/lib/admin/sesion'
import { gorrasAdmin, coleccionesDe } from '@/lib/admin/consultas'
import FormProducto from '@/components/admin/FormProducto'
import AjusteStock from '@/components/admin/AjusteStock'
import { ChipEstadoGorra } from '@/components/admin/Chips'
import { formatoFecha, MOTIVOS_MOVIMIENTO } from '@/lib/admin/catalogos'

export const metadata = { title: 'Editar gorra · Admin' }

const ULTIMOS_MOVIMIENTOS = 5

// Cambia solo cuando cambian los datos que se editan en el formulario. Así, ajustar el stock
// desde el panel lateral no reinicia el formulario ni borra lo que estés escribiendo.
// Incluye estado y etiqueta porque el stock los cambia solo (agotado ↔ disponible).
function claveFormulario(g) {
  return [
    g.nombre, g.precio, g.precioAnterior, g.costo, g.coleccion, g.color, g.descripcion, g.estado, g.badge,
    g.marca, g.tipo, g.talla, g.material, g.visera, ...g.fotos,
  ].join('|')
}

export default async function EditarGorra({ params }) {
  const { id } = await params
  const { supabase } = await requerirAdmin()
  const gorras = await gorrasAdmin(supabase)
  const gorra = gorras.find((g) => String(g.id) === id)
  if (!gorra) notFound()

  const [{ data: movimientos }, { count: esperando }] = await Promise.all([
    supabase
      .from('movimientos_inventario')
      .select('id, created_at, cantidad, stock_resultante, motivo, nota, venta_id')
      .eq('gorra_id', gorra.id)
      .order('created_at', { ascending: false })
      .limit(ULTIMOS_MOVIMIENTOS),
    supabase
      .from('avisos')
      .select('id', { count: 'exact', head: true })
      .eq('gorra_id', gorra.id)
      .eq('atendido', false),
  ])

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
        </div>
      </div>

      <div className="adm-detalle">
        <FormProducto key={claveFormulario(gorra)} gorra={gorra} colecciones={coleccionesDe(gorras)} />

        <aside className="adm-detalle-lateral">
          <section className="adm-tarjeta" id="inventario" aria-labelledby="titulo-inventario">
            <div className="adm-tarjeta-titulo">
              <h2 id="titulo-inventario">Inventario</h2>
              <Link href={`/admin/inventario/movimientos?gorra=${gorra.id}`} className="adm-ayuda" style={{ textDecoration: 'underline' }}>
                Historial
              </Link>
            </div>

            <div className="adm-stock-actual">
              <strong className={gorra.stock === 0 ? 'adm-rojo' : undefined}>{gorra.stock}</strong>
              <span>{gorra.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}</span>
            </div>

            {esperando > 0 && (
              <div className="adm-alerta" data-tono="aviso" style={{ marginBottom: 16, fontSize: 13 }}>
                {esperando === 1 ? '1 persona espera' : `${esperando} personas esperan`} esta gorra.{' '}
                <Link href={`/admin/avisos?gorra=${gorra.id}`} style={{ textDecoration: 'underline' }}>Ver avisos</Link>
              </div>
            )}

            <AjusteStock gorraId={gorra.id} stock={gorra.stock} variante="tarjeta" />
          </section>

          <section className="adm-tarjeta" aria-labelledby="titulo-movimientos">
            <h2 id="titulo-movimientos">Últimos movimientos</h2>
            {movimientos?.length ? (
              <div className="adm-movs">
                {movimientos.map((m) => (
                  <div key={m.id} className="adm-mov">
                    <span>{MOTIVOS_MOVIMIENTO[m.motivo] ?? m.motivo}</span>
                    <span className={`adm-mov-cambio ${m.cantidad > 0 ? 'adm-verde' : 'adm-rojo'}`}>
                      {m.cantidad > 0 ? `+${m.cantidad}` : m.cantidad}
                      <small>quedó {m.stock_resultante}</small>
                    </span>
                    <span className="adm-ayuda">
                      {formatoFecha(m.created_at, { hora: true })}
                      {m.venta_id && <> · <Link href={`/admin/ventas/${m.venta_id}`} style={{ textDecoration: 'underline' }}>Venta #{m.venta_id}</Link></>}
                      {m.nota && ` · ${m.nota}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="adm-ayuda">Todavía no hay movimientos de esta gorra.</p>
            )}
          </section>
        </aside>
      </div>
    </>
  )
}
