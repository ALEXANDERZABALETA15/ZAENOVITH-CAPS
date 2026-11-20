'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { cambiarEstadoVenta, actualizarVenta } from '@/app/admin/(panel)/ventas/acciones'
import { ESTADOS_VENTA, SIGUIENTE_ESTADO_VENTA, METODOS_PAGO, CANALES, nombreDe } from '@/lib/admin/catalogos'

const TEXTO_SIGUIENTE = {
  pagado: 'Marcar como pagada',
  enviado: 'Marcar como enviada',
  entregado: 'Marcar como entregada',
}

// Botones de avance de estado y cancelación
export function EstadoVenta({ venta }) {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [pendiente, iniciar] = useTransition()
  const siguiente = SIGUIENTE_ESTADO_VENTA[venta.estado]

  function cambiar(estado) {
    if (estado === 'cancelado' && !confirm('¿Cancelar esta venta? Las unidades vuelven al inventario. Una venta cancelada no se puede reabrir.')) return
    setError(null)
    iniciar(async () => {
      const r = await cambiarEstadoVenta(venta.id, estado)
      if (r.error) return setError(r.error)
      router.refresh()
    })
  }

  if (venta.estado === 'cancelado') {
    return <p className="adm-suave">Venta cancelada: las unidades ya volvieron al inventario.</p>
  }

  return (
    <div className="adm-form" style={{ gap: 10 }}>
      <div className="adm-acciones">
        {siguiente && (
          <button type="button" className="adm-btn adm-btn--primario" onClick={() => cambiar(siguiente)} disabled={pendiente}>
            {TEXTO_SIGUIENTE[siguiente]}
          </button>
        )}
        <select
          className="adm-select"
          style={{ width: 'auto' }}
          value=""
          onChange={(e) => e.target.value && cambiar(e.target.value)}
          disabled={pendiente}
          aria-label="Cambiar a otro estado"
        >
          <option value="">Cambiar a…</option>
          {ESTADOS_VENTA.filter((e) => e.valor !== venta.estado && e.valor !== 'cancelado').map((e) => (
            <option key={e.valor} value={e.valor}>{e.nombre}</option>
          ))}
        </select>
        <button type="button" className="adm-btn adm-btn--peligro" onClick={() => cambiar('cancelado')} disabled={pendiente}>
          Cancelar venta
        </button>
      </div>
      {error && <div className="adm-alerta" data-tono="error" role="alert">{error}</div>}
    </div>
  )
}

// Edición de datos del cliente, pago y notas (no toca productos ni stock)
export function DatosVenta({ venta }) {
  const router = useRouter()
  const [editando, setEditando] = useState(false)
  const [datos, setDatos] = useState(() => ({
    clienteNombre: venta.cliente_nombre ?? '',
    clienteTelefono: venta.cliente_telefono ?? '',
    ciudad: venta.ciudad ?? '',
    direccion: venta.direccion ?? '',
    canal: venta.canal,
    metodoPago: venta.metodo_pago ?? '',
    envio: venta.envio,
    descuento: venta.descuento,
    notas: venta.notas ?? '',
  }))
  const [error, setError] = useState(null)
  const [pendiente, iniciar] = useTransition()

  function campo(nombre) {
    return { id: `v-${nombre}`, value: datos[nombre], onChange: (e) => setDatos((d) => ({ ...d, [nombre]: e.target.value })) }
  }

  function guardar(e) {
    e.preventDefault()
    setError(null)
    iniciar(async () => {
      const r = await actualizarVenta(venta.id, datos)
      if (r.error) return setError(r.error)
      setEditando(false)
      router.refresh()
    })
  }

  if (!editando) {
    const filas = [
      ['Cliente', venta.cliente_nombre],
      ['Celular', venta.cliente_telefono],
      ['Ciudad', venta.ciudad],
      ['Dirección', venta.direccion],
      ['Canal', nombreDe(CANALES, venta.canal)],
      ['Pago', venta.metodo_pago ? nombreDe(METODOS_PAGO, venta.metodo_pago) : null],
      ['Notas', venta.notas],
    ]
    return (
      <div className="adm-form" style={{ gap: 12 }}>
        <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '6px 16px' }}>
          {filas.map(([etiqueta, valor]) => (
            <div key={etiqueta} style={{ display: 'contents' }}>
              <dt className="adm-suave">{etiqueta}</dt>
              <dd style={{ whiteSpace: 'pre-wrap' }}>{valor || '—'}</dd>
            </div>
          ))}
        </dl>
        <div>
          <button type="button" className="adm-btn adm-btn--chico" onClick={() => setEditando(true)}>Editar datos</button>
        </div>
      </div>
    )
  }

  return (
    <form className="adm-form" onSubmit={guardar}>
      {error && <div className="adm-alerta" data-tono="error" role="alert">{error}</div>}
      <div className="adm-campos">
        <div className="adm-campo"><label htmlFor="v-clienteNombre">Nombre</label><input {...campo('clienteNombre')} className="adm-input" /></div>
        <div className="adm-campo"><label htmlFor="v-clienteTelefono">Celular</label><input {...campo('clienteTelefono')} className="adm-input" inputMode="tel" /></div>
        <div className="adm-campo"><label htmlFor="v-ciudad">Ciudad</label><input {...campo('ciudad')} className="adm-input" /></div>
        <div className="adm-campo"><label htmlFor="v-direccion">Dirección</label><input {...campo('direccion')} className="adm-input" /></div>
        <div className="adm-campo">
          <label htmlFor="v-canal">Canal</label>
          <select {...campo('canal')} className="adm-select">
            {CANALES.map((c) => <option key={c.valor} value={c.valor}>{c.nombre}</option>)}
          </select>
        </div>
        <div className="adm-campo">
          <label htmlFor="v-metodoPago">Pago</label>
          <select {...campo('metodoPago')} className="adm-select">
            <option value="">Sin definir</option>
            {METODOS_PAGO.map((m) => <option key={m.valor} value={m.valor}>{m.nombre}</option>)}
          </select>
        </div>
        <div className="adm-campo"><label htmlFor="v-envio">Envío cobrado</label><input {...campo('envio')} type="number" min={0} step={1000} className="adm-input" /></div>
        <div className="adm-campo"><label htmlFor="v-descuento">Descuento</label><input {...campo('descuento')} type="number" min={0} step={1000} className="adm-input" /></div>
        <div className="adm-campo adm-campo--ancho"><label htmlFor="v-notas">Notas</label><textarea {...campo('notas')} className="adm-textarea" style={{ minHeight: 60 }} /></div>
      </div>
      <div className="adm-acciones" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="adm-btn adm-btn--fantasma" onClick={() => setEditando(false)} disabled={pendiente}>Cancelar</button>
        <button type="submit" className="adm-btn adm-btn--primario" disabled={pendiente}>{pendiente ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </form>
  )
}
