'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { moverStock } from '@/app/admin/(panel)/inventario/acciones'

const MOTIVOS = [
  { valor: 'ingreso', nombre: '+ Llegó mercancía' },
  { valor: 'devolucion', nombre: '+ Devolución' },
  { valor: 'perdida', nombre: '− Pérdida o daño' },
  { valor: 'conteo', nombre: '= Conteo físico' },
]

// Controles de una fila del inventario
export default function AjusteStock({ gorraId, stock }) {
  const router = useRouter()
  const [motivo, setMotivo] = useState('ingreso')
  const [cantidad, setCantidad] = useState('')
  const [nota, setNota] = useState('')
  const [mensaje, setMensaje] = useState(null)
  const [pendiente, iniciar] = useTransition()

  function aplicar(e) {
    e.preventDefault()
    setMensaje(null)
    iniciar(async () => {
      const r = await moverStock({ gorraId, motivo, cantidad, nota })
      if (r.error) return setMensaje({ tono: 'error', texto: r.error })
      setCantidad('')
      setNota('')
      setMensaje({ tono: 'ok', texto: `Stock: ${r.stock}`, avisos: r.avisos })
      router.refresh()
    })
  }

  const etiquetaCantidad = motivo === 'conteo' ? `Total contado (hoy ${stock})` : 'Unidades'

  return (
    <form onSubmit={aplicar} className="adm-filtros" style={{ flexWrap: 'wrap' }}>
      <select value={motivo} onChange={(e) => setMotivo(e.target.value)} className="adm-select" aria-label="Movimiento" style={{ minWidth: 0 }}>
        {MOTIVOS.map((m) => <option key={m.valor} value={m.valor}>{m.nombre}</option>)}
      </select>
      <input
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        value={cantidad}
        onChange={(e) => setCantidad(e.target.value)}
        className="adm-input adm-input--chico"
        placeholder={motivo === 'conteo' ? String(stock) : '0'}
        aria-label={etiquetaCantidad}
        title={etiquetaCantidad}
        required
      />
      <input
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        className="adm-input"
        placeholder="Nota (opcional)"
        aria-label="Nota"
        style={{ minWidth: 0, width: 150 }}
      />
      <button type="submit" className="adm-btn adm-btn--chico" disabled={pendiente || cantidad === ''}>
        {pendiente ? '…' : 'Aplicar'}
      </button>
      {mensaje && (
        <span className={mensaje.tono === 'error' ? 'adm-rojo' : 'adm-verde'} role="status" style={{ fontSize: 12 }}>
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
