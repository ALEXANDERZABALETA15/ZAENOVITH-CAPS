import Link from 'next/link'
import { requerirAdmin } from '@/lib/admin/sesion'
import { gorrasAdmin } from '@/lib/admin/consultas'
import { formatoFecha, mensajeGorraDisponible, whatsappCliente } from '@/lib/admin/catalogos'
import { ChipEstadoGorra } from '@/components/admin/Chips'
import AccionesAviso from '@/components/admin/AccionesAviso'
import { SITIO_URL } from '@/lib/contacto'
import { rutaGorra } from '@/lib/rutas'

export const metadata = { title: 'Avisos · Admin' }

// Personas que dejaron su celular en "Avísame cuando llegue" / "Avísame si vuelve"
export default async function Avisos({ searchParams }) {
  const { ver = 'pendientes', gorra } = await searchParams
  const { supabase } = await requerirAdmin()

  let consulta = supabase
    .from('avisos')
    .select('id, gorra_id, gorra_nombre, tipo, telefono, atendido, created_at')
    .eq('atendido', ver === 'atendidos')
    .order('created_at', { ascending: false })
    .limit(500)
  if (gorra) consulta = consulta.eq('gorra_id', gorra)

  const [{ data: avisos, error }, gorras] = await Promise.all([consulta, gorrasAdmin(supabase)])
  if (error) throw new Error(`No se pudieron leer los avisos: ${error.message}. ¿Ya ejecutaste supabase/admin.sql?`)

  const porId = new Map(gorras.map((g) => [g.id, g]))
  // Primero los que ya se pueden avisar (gorra disponible)
  const disponibles = (a) => porId.get(a.gorra_id)?.estado === 'activo' && porId.get(a.gorra_id)?.stock > 0
  const ordenados = [...avisos].sort((a, b) => Number(disponibles(b)) - Number(disponibles(a)))
  const listosParaAvisar = avisos.filter(disponibles).length

  return (
    <>
      <div className="adm-encabezado">
        <div>
          <h1>Avisos</h1>
          <p>Clientes que pidieron que les avisaras cuando una gorra llegara o volviera.</p>
        </div>
        {gorra && <Link href="/admin/avisos" className="adm-btn">Ver todas las gorras</Link>}
      </div>

      {ver !== 'atendidos' && listosParaAvisar > 0 && (
        <div className="adm-alerta" data-tono="ok">
          {listosParaAvisar === 1 ? '1 persona espera' : `${listosParaAvisar} personas esperan`} una gorra que ya está disponible.
        </div>
      )}

      <section className="adm-tarjeta">
        <nav className="adm-pestanas" style={{ marginBottom: 16 }} aria-label="Ver">
          <Link href={`/admin/avisos${gorra ? `?gorra=${gorra}` : ''}`} aria-current={ver !== 'atendidos' ? 'true' : undefined}>Pendientes</Link>
          <Link href={`/admin/avisos?ver=atendidos${gorra ? `&gorra=${gorra}` : ''}`} aria-current={ver === 'atendidos' ? 'true' : undefined}>Atendidos</Link>
        </nav>

        <div className="adm-tabla-scroll">
          <table className="adm-tabla">
            <thead>
              <tr>
                <th>Gorra</th>
                <th>Pidió</th>
                <th>Celular</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ordenados.map((a) => {
                const g = porId.get(a.gorra_id)
                const lista = disponibles(a)
                const enlace = lista
                  ? whatsappCliente(a.telefono, mensajeGorraDisponible(g.nombre, `${SITIO_URL}${rutaGorra(g)}`))
                  : null
                return (
                  <tr key={a.id}>
                    <td>
                      {g ? <Link href={`/admin/productos/${g.id}`}>{a.gorra_nombre}</Link> : a.gorra_nombre}
                      <span style={{ display: 'block', marginTop: 2 }}>
                        {g ? <ChipEstadoGorra estado={g.estado} /> : <span className="adm-ayuda">Gorra eliminada</span>}
                        {g && <span className="adm-ayuda"> · {g.stock} en stock</span>}
                      </span>
                    </td>
                    <td className="adm-suave">{a.tipo === 'llegada' ? 'Cuando llegue' : 'Si vuelve'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{a.telefono}</td>
                    <td className="adm-suave" style={{ whiteSpace: 'nowrap' }}>{formatoFecha(a.created_at)}</td>
                    <td><AccionesAviso aviso={a} enlaceWhatsApp={enlace} /></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {!avisos.length && <p className="adm-vacio">No hay avisos {ver === 'atendidos' ? 'atendidos' : 'pendientes'}.</p>}
        </div>
      </section>
    </>
  )
}
