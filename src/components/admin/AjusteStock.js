'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { moverStock } from '@/app/admin/(panel)/inventario/acciones'

const MOTIVOS = [
  { valor: 'ingreso', nombre: '+ Llegó mercancía', boton: 'Agregar al stock' },
  { valor: 'devolucion', nombre: '+ Devolución', boton: 'Sumar devolución' },
  { valor: 'perdida', nombre: '− Pérdida o daño', boton: 'Descontar del stock' },
  { valor: 'conteo', nombre: '= Conteo físico', boton: 'Guardar conteo' },
]

const unidades = (n) => `${n} ${n === 1 ? 'unidad' : 'unidades'}`

// Stock que quedaría al aplicar el movimiento (null si la cantidad aún no es válida)
function stockResultante(motivo, stock, cantidad) {
  if (cantidad === '' || !/^\d+$/.test(String(cantidad))) return null
  const n = Number(cantidad)
  if (motivo === 'conteo') return n
  if (motivo === 'perdida') return stock - n
  return stock + n
}

// Ajuste de stock de una gorra.
// - variante "fila": compacto, para la tabla de Inventario.
// - variante "tarjeta": con explicación y vista previa, para el detalle del producto.
export default function AjusteStock({ gorraId, stock, variante = 'fila' }) {
  const router = useRouter()
  const [motivo, setMotivo] = useState('ingreso')
  const [cantidad, setCantidad] = useState('')
  const [nota, setNota] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [pendiente, iniciar] = useTransition()

  const tarjeta = variante === 'tarjeta'
  const actual = MOTIVOS.find((m) => m.valor === motivo)
  const quedara = stockResultante(motivo, stock, cantidad)
  const negativo = quedara !== null && quedara < 0

  function aplicar(e) {
    e.preventDefault()
    setMensaje(null)
    iniciar(async () => {
      const r = await moverStock({ gorraId, motivo, cantidad, nota })
      if (r.error) return setMensaje({ tono: 'error', texto: r.error })
      setCantidad('')
      setNota('')
      setMensaje({ tono: 'ok', texto: `Listo: quedó en ${unidades(r.stock)}`, avisos: r.avisos })
      router.refresh()
    })
  }

  const etiquetaCantidad = motivo === 'conteo' ? `Total contado (hoy ${stock})` : 'Unidades'
  const ayuda = {
    ingreso: 'Se suman a lo que ya hay.',
    devolucion: 'Un cliente devolvió la gorra: se suma al stock.',
    perdida: 'Se restan del stock (dañada, perdida, regalo…).',
    conteo: 'Escribe el total que contaste: reemplaza el stock actual.',
  }[motivo]

  return (
    <form onSubmit={aplicar} className={`adm-ajuste${tarjeta ? ' adm-ajuste--tarjeta' : ''}`}>
      {tarjeta && <label htmlFor={`motivo-${gorraId}`} className="adm-etiqueta adm-ajuste-ancho">Movimiento</label>}
      <select
        id={`motivo-${gorraId}`}
        value={motivo}
        onChange={(e) => { setMotivo(e.target.value); setMensaje(null) }}
        className="adm-select adm-ajuste-motivo"
        aria-label={tarjeta ? undefined : 'Movimiento'}
      >
        {MOTIVOS.map((m) => <option key={m.valor} value={m.valor}>{m.nombre}</option>)}
      </select>

      {tarjeta && <p className="adm-ayuda adm-ajuste-ancho">{ayuda}</p>}

      <input
        type="number"
        min={motivo === 'conteo' ? 0 : 1}
        step={1}
        inputMode="numeric"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        className="adm-input adm-ajuste-cantidad"
        placeholder={motivo === 'conteo' ? String(stock) : 'Cant.'}
        aria-label={etiquetaCantidad}
        title={etiquetaCantidad}
        required
      />
      <input
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        className="adm-input adm-ajuste-nota"
        placeholder="Nota (opcional)"
        aria-label="Nota"
        maxLength={200}
      />

      {tarjeta && quedara !== null && (
        <p className={`adm-ajuste-ancho adm-ajuste-preview${negativo ? ' adm-rojo' : ''}`}>
          {negativo
            ? `Solo hay ${unidades(stock)}: no puedes descontar ${cantidad}.`
            : <>Pasa de <strong>{stock}</strong> a <strong>{quedara}</strong> {quedara === 1 ? 'unidad' : 'unidades'}</>}
        </p>
      )}

      <button
        type="submit"
        className={`adm-btn ${tarjeta ? 'adm-btn--primario adm-ajuste-ancho' : 'adm-btn--chico'}`}
        disabled={pendiente || cantidad === '' || negativo}
      >
        {pendiente ? 'Guardando…' : tarjeta ? actual.boton : 'Aplicar'}
      </button>

      {mensaje && (
        <span className={`adm-ajuste-mensaje ${mensaje.tono === 'error' ? 'adm-rojo' : 'adm-verde'}`} role="status">
          {mensaje.texto}
          {mensaje.avisos > 0 && (
            <>
              {' · '}
              <Link href={`/admin/avisos?gorra=${gorraId}`} style={{ textDecoration: 'underline' }}>
                {mensaje.avisos} {mensaje.avisos === 1 ? 'persona espera' : 'personas esperan'} esta gorra
              </Link>
            </>
          )}
        </span>
      )}
    </form>
  )
}
