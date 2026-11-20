import Link from 'next/link'
import { requerirAdmin } from '@/lib/admin/sesion'
import { gorrasAdmin } from '@/lib/admin/consultas'
import { STOCK_BAJO, inicioDiaBogota, inicioSemanaBogota, inicioMesBogota, hoyBogota, formatoFecha, miniatura } from '@/lib/admin/catalogos'
import { ChipEstadoVenta, ChipStock } from '@/components/admin/Chips'
import { formatPrecio } from '@/lib/precio'

function resumen(ventas) {
  return ventas.reduce(
    (r, v) => {
      const costo = v.venta_items.reduce((s, i) => s + (i.costo_unitario ?? 0) * i.cantidad, 0)
      r.ventas += 1
      r.ingresos += v.total
      r.ganancia += v.subtotal - v.descuento - costo
      r.unidades += v.venta_items.reduce((s, i) => s + i.cantidad, 0)
      return r
    },
    { ventas: 0, ingresos: 0, ganancia: 0, unidades: 0 }
  )
}

function mesAnterior() {
  const [anio, mes] = hoyBogota().split('-').map(Number)
  return mes === 1 ? `${anio - 1}-12-01` : `${anio}-${String(mes - 1).padStart(2, '0')}-01`
}

function Kpi({ etiqueta, datos, detalle }) {
  return (
    <div className="adm-kpi">
      <div className="adm-kpi-etiqueta">{etiqueta}</div>
      <div className="adm-kpi-valor">{formatPrecio(datos.ingresos)}</div>
      <div className="adm-kpi-detalle">
        {datos.ventas} {datos.ventas === 1 ? 'venta' : 'ventas'} · {datos.unidades} gorras
        {datos.ventas > 0 && <> · <span className="adm-verde">ganancia {formatPrecio(datos.ganancia)}</span></>}
      </div>
      {detalle && <div className="adm-kpi-detalle">{detalle}</div>}
    </div>
  )
}

export default async function Inicio() {
  const { supabase } = await requerirAdmin()

  const inicioMesPasado = inicioDiaBogota(mesAnterior())
  const [ventasRes, porDespacharRes, avisosRes, gorras] = await Promise.all([
    supabase
      .from('ventas')
      .select('id, fecha, cliente_nombre, estado, subtotal, descuento, total, venta_items(gorra_id, gorra_nombre, cantidad, costo_unitario)')
      .gte('fecha', inicioMesPasado)
      .neq('estado', 'cancelado')
      .order('fecha', { ascending: false }),
    supabase
      .from('ventas')
      .select('id, fecha, cliente_nombre, ciudad, estado, total')
      .in('estado', ['pendiente', 'pagado'])
      .order('fecha', { ascending: true }),
    supabase.from('avisos').select('gorra_id').eq('atendido', false),
    gorrasAdmin(supabase),
  ])
  const error = ventasRes.error || porDespacharRes.error || avisosRes.error
  if (error) throw new Error(`No se pudo cargar el resumen: ${error.message}. ¿Ya ejecutaste supabase/admin.sql?`)

  const ventas = ventasRes.data
  const desde = (inicio) => ventas.filter((v) => new Date(v.fecha) >= new Date(inicio))
  const hoy = resumen(desde(inicioDiaBogota()))
  const semana = resumen(desde(inicioSemanaBogota()))
  const delMes = desde(inicioMesBogota())
  const mes = resumen(delMes)
  const pasado = resumen(ventas.filter((v) => new Date(v.fecha) < new Date(inicioMesBogota())))

  // Más vendidas del mes
  const conteo = new Map()
  delMes.flatMap((v) => v.venta_items).forEach((i) => {
    const clave = i.gorra_id ?? i.gorra_nombre
    const actual = conteo.get(clave) || { nombre: i.gorra_nombre, id: i.gorra_id, unidades: 0 }
    actual.unidades += i.cantidad
    conteo.set(clave, actual)
  })
  const top = [...conteo.values()].sort((a, b) => b.unidades - a.unidades).slice(0, 5)
  const maximo = top[0]?.unidades || 1

  // Inventario
  const visibles = gorras.filter((g) => g.estado !== 'oculto')
  const stockBajo = visibles.filter((g) => g.estado === 'activo' && g.stock > 0 && g.stock <= STOCK_BAJO)
  const activasSinStock = visibles.filter((g) => g.estado === 'activo' && g.stock === 0)
  const sinCosto = visibles.filter((g) => g.costo === null).length
  const disponibles = new Set(visibles.filter((g) => g.estado === 'activo' && g.stock > 0).map((g) => g.id))
  const avisosListos = avisosRes.data.filter((a) => disponibles.has(a.gorra_id)).length

  const pendientes = porDespacharRes.data
  const variacion = pasado.ingresos ? Math.round(((mes.ingresos - pasado.ingresos) / pasado.ingresos) * 100) : null

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <h1>Inicio</h1>
          <p>{formatoFecha(new Date().toISOString())}</p>
        </div>
        <Link href="/admin/ventas/nueva" className="adm-btn adm-btn--primario">+ Registrar venta</Link>
      </div>

      <div className="adm-kpis">
        <Kpi etiqueta="Hoy" datos={hoy} />
        <Kpi etiqueta="Esta semana" datos={semana} />
        <Kpi
          etiqueta="Este mes"
          datos={mes}
          detalle={variacion !== null ? `${variacion >= 0 ? '+' : ''}${variacion}% vs. mes pasado (${formatPrecio(pasado.ingresos)})` : null}
        />
      </div>

      {(activasSinStock.length > 0 || avisosListos > 0 || sinCosto > 0) && (
        <div className="adm-form" style={{ gap: 8 }}>
          {activasSinStock.length > 0 && (
            <div className="adm-alerta" data-tono="aviso">
              {activasSinStock.length} {activasSinStock.length === 1 ? 'gorra disponible tiene' : 'gorras disponibles tienen'} stock 0.{' '}
              <Link href="/admin/inventario?filtro=cero" style={{ textDecoration: 'underline' }}>Cargar el conteo</Link>
            </div>
          )}
          {avisosListos > 0 && (
            <div className="adm-alerta" data-tono="ok">
              {avisosListos === 1 ? '1 cliente espera' : `${avisosListos} clientes esperan`} una gorra que ya está disponible.{' '}
              <Link href="/admin/avisos" style={{ textDecoration: 'underline' }}>Avisarles</Link>
            </div>
          )}
          {sinCosto > 0 && (
            <div className="adm-alerta">
              {sinCosto} {sinCosto === 1 ? 'gorra no tiene' : 'gorras no tienen'} costo cargado: la ganancia sale más alta de lo real.{' '}
              <Link href="/admin/productos" style={{ textDecoration: 'underline' }}>Ver productos</Link>
            </div>
          )}
        </div>
      )}

      <div className="adm-rejilla">
        <section className="adm-tarjeta">
          <h2>Por despachar ({pendientes.length})</h2>
          {pendientes.length ? (
            <table className="adm-tabla">
              <tbody>
                {pendientes.slice(0, 8).map((v) => (
                  <tr key={v.id}>
                    <td>
                      <Link href={`/admin/ventas/${v.id}`}>#{v.id} · {v.cliente_nombre || 'Sin nombre'}</Link>
                      <span className="adm-ayuda" style={{ display: 'block' }}>{formatoFecha(v.fecha)}{v.ciudad ? ` · ${v.ciudad}` : ''}</span>
                    </td>
                    <td><ChipEstadoVenta estado={v.estado} /></td>
                    <td className="adm-numero">{formatPrecio(v.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="adm-vacio">Todo despachado.</p>
          )}
        </section>

        <section className="adm-tarjeta">
          <h2>Más vendidas del mes</h2>
          {top.length ? (
            <div className="adm-barras">
              {top.map((g) => (
                <div key={g.id ?? g.nombre} className="adm-barra-fila">
                  <span>{g.id ? <Link href={`/admin/productos/${g.id}`}>{g.nombre}</Link> : g.nombre}</span>
                  <span className="adm-numero">{g.unidades}</span>
                  <div className="adm-barra" aria-hidden="true"><span style={{ width: `${(g.unidades / maximo) * 100}%` }} /></div>
                </div>
              ))}
            </div>
          ) : (
            <p className="adm-vacio">Aún no hay ventas este mes.</p>
          )}
        </section>

        <section className="adm-tarjeta">
          <h2>Stock bajo</h2>
          {stockBajo.length ? (
            <table className="adm-tabla">
              <tbody>
                {stockBajo.sort((a, b) => a.stock - b.stock).map((g) => (
                  <tr key={g.id}>
                    <td>
                      <Link href={`/admin/inventario?gorra=${g.id}#gorra-${g.id}`} className="adm-producto" style={{ minWidth: 0 }}>
                        <img src={g.fotos[0] ? miniatura(g.fotos[0]) : '/sin-foto.svg'} alt="" className="adm-miniatura" />
                        {g.nombre}
                      </Link>
                    </td>
                    <td className="adm-numero"><ChipStock stock={g.stock} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="adm-vacio">Ninguna gorra disponible con {STOCK_BAJO} unidades o menos.</p>
          )}
        </section>
      </div>
    </>
  )
}
