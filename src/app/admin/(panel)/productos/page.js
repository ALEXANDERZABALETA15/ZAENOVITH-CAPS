import Link from 'next/link'
import { requerirAdmin } from '@/lib/admin/sesion'
import { gorrasAdmin, coleccionesDe } from '@/lib/admin/consultas'
import { ESTADOS_GORRA, miniatura } from '@/lib/admin/catalogos'
import { ChipEstadoGorra, ChipStock } from '@/components/admin/Chips'
import { formatPrecio } from '@/lib/precio'
import { claveColeccion } from '@/lib/colecciones'
import { textoBadge } from '@/lib/badges'

export const metadata = { title: 'Productos · Admin' }

function normalizar(texto) {
  return (texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

export default async function Productos({ searchParams }) {
  const { q = '', estado = '', coleccion = '', guardado } = await searchParams
  const { supabase } = await requerirAdmin()
  const gorras = await gorrasAdmin(supabase)
  const colecciones = coleccionesDe(gorras)

  const busqueda = normalizar(q)
  const filtradas = gorras.filter(
    (g) =>
      (!busqueda || normalizar(`${g.nombre} ${g.color} ${g.marca} ${g.id}`).includes(busqueda)) &&
      (!estado || g.estado === estado) &&
      (!coleccion || claveColeccion(g.coleccion) === claveColeccion(coleccion))
  )
  const nombreGuardada = guardado && gorras.find((g) => String(g.id) === guardado)?.nombre

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <h1>Productos</h1>
          <p>{gorras.length} gorras en total</p>
        </div>
        <Link href="/admin/productos/nuevo" className="adm-btn adm-btn--primario">+ Nueva gorra</Link>
      </div>

      {nombreGuardada && (
        <div className="adm-alerta" data-tono="ok" role="status">
          “{nombreGuardada}” se guardó. La tienda se actualiza en la próxima visita.
        </div>
      )}

      <section className="adm-tarjeta">
        <form className="adm-filtros" style={{ marginBottom: 16 }}>
          <input name="q" defaultValue={q} placeholder="Buscar por nombre, color, marca…" className="adm-input" aria-label="Buscar" />
          <select name="estado" defaultValue={estado} className="adm-select" aria-label="Estado">
            <option value="">Todos los estados</option>
            {ESTADOS_GORRA.map((e) => <option key={e.valor} value={e.valor}>{e.nombre}</option>)}
          </select>
          <select name="coleccion" defaultValue={coleccion} className="adm-select" aria-label="Colección">
            <option value="">Todas las colecciones</option>
            {colecciones.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" className="adm-btn">Filtrar</button>
          {(q || estado || coleccion) && <Link href="/admin/productos" className="adm-btn adm-btn--fantasma">Limpiar</Link>}
        </form>

        <div className="adm-tabla-scroll">
          <table className="adm-tabla">
            <thead>
              <tr>
                <th>Gorra</th>
                <th>Colección</th>
                <th>Estado</th>
                <th>Etiqueta</th>
                <th className="adm-numero">Precio</th>
                <th className="adm-numero">Costo</th>
                <th className="adm-numero">Stock</th>
                <th className="adm-numero">Fotos</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((g) => (
                <tr key={g.id}>
                  <td>
                    <Link href={`/admin/productos/${g.id}`} className="adm-producto">
                      <img src={g.fotos[0] ? miniatura(g.fotos[0]) : '/sin-foto.svg'} alt="" className="adm-miniatura" loading="lazy" />
                      <span>
                        {g.nombre}
                        <span className="adm-ayuda" style={{ display: 'block' }}>#{g.id}{g.color ? ` · ${g.color}` : ''}</span>
                      </span>
                    </Link>
                  </td>
                  <td>{g.coleccion || '—'}</td>
                  <td><ChipEstadoGorra estado={g.estado} /></td>
                  <td className="adm-suave">{g.badge ? textoBadge(g.badge) : '—'}</td>
                  <td className="adm-numero">
                    {formatPrecio(g.precio)}
                    {g.precioAnterior && <span className="adm-ayuda" style={{ display: 'block', textDecoration: 'line-through' }}>{formatPrecio(g.precioAnterior)}</span>}
                  </td>
                  <td className="adm-numero adm-suave">{g.costo !== null ? formatPrecio(g.costo) : '—'}</td>
                  <td className="adm-numero"><ChipStock stock={g.stock} /></td>
                  <td className="adm-numero" title={g.fotos.length < 3 ? 'Pocas fotos' : undefined}>
                    <span className={g.fotos.length < 3 ? 'adm-rojo' : 'adm-suave'}>{g.fotos.length}/6</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtradas.length && <p className="adm-vacio">No hay gorras con esos filtros.</p>}
        </div>
      </section>
    </>
  )
}
