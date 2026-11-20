import Link from 'next/link'
import { requerirAdmin } from '@/lib/admin/sesion'
import { gorrasAdmin } from '@/lib/admin/consultas'
import { STOCK_BAJO, miniatura } from '@/lib/admin/catalogos'
import { ChipEstadoGorra, ChipStock } from '@/components/admin/Chips'
import AjusteStock from '@/components/admin/AjusteStock'
import { formatPrecio } from '@/lib/precio'

export const metadata = { title: 'Inventario · Admin' }

const FILTROS = [
  { valor: '', nombre: 'Todas' },
  { valor: 'bajo', nombre: `Stock bajo (≤ ${STOCK_BAJO})` },
  { valor: 'cero', nombre: 'Sin stock' },
  { valor: 'ocultas', nombre: 'Ocultas' },
]

export default async function Inventario({ searchParams }) {
  const { filtro = '', gorra: gorraResaltada } = await searchParams
  const { supabase } = await requerirAdmin()
  const gorras = await gorrasAdmin(supabase)

  const { data: avisos } = await supabase.from('avisos').select('gorra_id').eq('atendido', false)
  const esperando = new Map()
  ;(avisos || []).forEach((a) => esperando.set(a.gorra_id, (esperando.get(a.gorra_id) || 0) + 1))

  const visibles = gorras.filter((g) => g.estado !== 'oculto')
  const unidades = visibles.reduce((s, g) => s + g.stock, 0)
  const valorCosto = visibles.reduce((s, g) => s + g.stock * (g.costo ?? 0), 0)
  const valorVenta = visibles.reduce((s, g) => s + g.stock * g.precio, 0)
  const sinCosto = visibles.filter((g) => g.stock > 0 && g.costo === null).length
  const activasSinStock = visibles.filter((g) => g.estado === 'activo' && g.stock === 0)

  const lista = (() => {
    if (filtro === 'bajo') return visibles.filter((g) => g.stock > 0 && g.stock <= STOCK_BAJO)
    if (filtro === 'cero') return visibles.filter((g) => g.stock === 0)
    if (filtro === 'ocultas') return gorras.filter((g) => g.estado === 'oculto')
    return visibles
  })().sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <h1>Inventario</h1>
          <p>Cada cambio queda registrado. Al llegar a 0 la gorra pasa sola a agotada, y vuelve a disponible al reponerla.</p>
        </div>
        <Link href="/admin/inventario/movimientos" className="adm-btn">Historial de movimientos</Link>
      </div>

      <div className="adm-kpis">
        <div className="adm-kpi">
          <div className="adm-kpi-etiqueta">Unidades</div>
          <div className="adm-kpi-valor">{unidades}</div>
          <div className="adm-kpi-detalle">en {visibles.filter((g) => g.stock > 0).length} gorras</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-etiqueta">Valor a precio de venta</div>
          <div className="adm-kpi-valor">{formatPrecio(valorVenta)}</div>
        </div>
        <div className="adm-kpi">
          <div className="adm-kpi-etiqueta">Valor a costo</div>
          <div className="adm-kpi-valor">{formatPrecio(valorCosto)}</div>
          {sinCosto > 0 && <div className="adm-kpi-detalle adm-rojo">{sinCosto} con stock y sin costo cargado</div>}
        </div>
      </div>

      {activasSinStock.length > 0 && (
        <div className="adm-alerta" data-tono="aviso">
          {activasSinStock.length === 1 ? 'Hay 1 gorra' : `Hay ${activasSinStock.length} gorras`} marcadas como disponibles con stock 0
          ({activasSinStock.slice(0, 4).map((g) => g.nombre).join(', ')}{activasSinStock.length > 4 ? '…' : ''}).
          Haz un <strong>conteo físico</strong> para cargar las unidades reales.
        </div>
      )}

      <section className="adm-tarjeta">
        <nav className="adm-pestanas" style={{ marginBottom: 16 }} aria-label="Filtro">
          {FILTROS.map((f) => (
            <Link key={f.valor} href={f.valor ? `/admin/inventario?filtro=${f.valor}` : '/admin/inventario'} aria-current={filtro === f.valor ? 'true' : undefined}>
              {f.nombre}
            </Link>
          ))}
        </nav>

        <div className="adm-tabla-scroll">
          <table className="adm-tabla">
            <thead>
              <tr>
                <th>Gorra</th>
                <th>Estado</th>
                <th className="adm-numero">Stock</th>
                <th>Movimiento</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((g) => (
                <tr key={g.id} id={`gorra-${g.id}`} style={String(g.id) === gorraResaltada ? { outline: '1px solid var(--color-green-text)' } : undefined}>
                  <td>
                    <Link href={`/admin/productos/${g.id}`} className="adm-producto">
                      <img src={g.fotos[0] ? miniatura(g.fotos[0]) : '/sin-foto.svg'} alt="" className="adm-miniatura" loading="lazy" />
                      <span>
                        {g.nombre}
                        {esperando.get(g.id) > 0 && (
                          <span className="adm-ayuda" style={{ display: 'block' }}>
                            {esperando.get(g.id)} esperando aviso
                          </span>
                        )}
                      </span>
                    </Link>
                  </td>
                  <td><ChipEstadoGorra estado={g.estado} /></td>
                  <td className="adm-numero"><ChipStock stock={g.stock} /></td>
                  <td><AjusteStock key={g.id} gorraId={g.id} stock={g.stock} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!lista.length && <p className="adm-vacio">Nada por aquí.</p>}
        </div>
      </section>
    </>
  )
}
