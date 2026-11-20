'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { registrarVenta } from '@/app/admin/(panel)/ventas/acciones'
import { ESTADOS_VENTA, METODOS_PAGO, CANALES, miniatura, hoyBogota } from '@/lib/admin/catalogos'
import { formatPrecio } from '@/lib/precio'

function normalizar(texto) {
  return (texto || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

// Lee el mensaje que arma la tienda en src/lib/contacto.js → mensajePedido
// ("Gorra: …", "Cantidad: …", "Nombre completo: …", etc.)
function leerPedido(mensaje, gorras) {
  const campo = (etiqueta) => {
    const m = mensaje.match(new RegExp(`^[ \\t*_]*${etiqueta}[ \\t*_]*:[ \\t]*(.*)$`, 'im'))
    return m ? m[1].trim() : ''
  }
  const nombreGorra = normalizar(campo('Gorra'))
  const gorra =
    gorras.find((g) => normalizar(g.nombre) === nombreGorra) ||
    (nombreGorra && gorras.find((g) => normalizar(g.nombre).includes(nombreGorra) || nombreGorra.includes(normalizar(g.nombre))))

  const direccion = [campo('Direcci[oó]n'), campo('Barrio')].filter(Boolean).join(', ')

  return {
    gorra,
    nombreGorra: campo('Gorra'),
    cantidad: parseInt(campo('Cantidad'), 10) || 1,
    precio: parseInt(campo('Precio').replace(/\D/g, ''), 10) || null,
    cliente: {
      clienteNombre: campo('Nombre completo'),
      ciudad: campo('Ciudad'),
      direccion,
      clienteTelefono: campo('Tel[eé]fono').replace(/[^\d+]/g, ''),
    },
  }
}

const INICIAL = {
  clienteNombre: '', clienteTelefono: '', ciudad: '', direccion: '',
  canal: 'whatsapp', metodoPago: '', estado: 'pendiente',
  envio: '', descuento: '', notas: '',
}

export default function FormVenta({ gorras }) {
  const router = useRouter()
  const [datos, setDatos] = useState(() => ({ ...INICIAL, fecha: hoyBogota() }))
  const [lineas, setLineas] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [pedido, setPedido] = useState('')
  const [aviso, setAviso] = useState(null)
  const [error, setError] = useState(null)
  const [guardando, iniciar] = useTransition()

  const porId = useMemo(() => new Map(gorras.map((g) => [g.id, g])), [gorras])

  const resultados = useMemo(() => {
    const q = normalizar(busqueda)
    if (!q) return []
    return gorras.filter((g) => normalizar(`${g.nombre} ${g.color ?? ''} ${g.id}`).includes(q)).slice(0, 8)
  }, [busqueda, gorras])

  function campo(nombre) {
    return {
      id: nombre,
      value: datos[nombre],
      onChange: (e) => setDatos((d) => ({ ...d, [nombre]: e.target.value })),
    }
  }

  function agregar(gorra, cantidad = 1, precio = null) {
    setLineas((ls) => {
      const existente = ls.find((l) => l.gorraId === gorra.id)
      if (existente) return ls.map((l) => (l.gorraId === gorra.id ? { ...l, cantidad: Number(l.cantidad) + cantidad } : l))
      return [...ls, { gorraId: gorra.id, cantidad, precio: precio ?? gorra.precio }]
    })
    setBusqueda('')
  }

  function cambiarLinea(gorraId, cambios) {
    setLineas((ls) => ls.map((l) => (l.gorraId === gorraId ? { ...l, ...cambios } : l)))
  }

  function usarPedido() {
    const leido = leerPedido(pedido, gorras)
    setDatos((d) => ({
      ...d,
      canal: 'whatsapp',
      ...Object.fromEntries(Object.entries(leido.cliente).filter(([, v]) => v)),
    }))
    if (leido.gorra) {
      agregar(leido.gorra, leido.cantidad, leido.precio)
      setAviso({ tono: 'ok', texto: `Pedido leído: ${leido.cantidad} × ${leido.gorra.nombre}. Revisa los datos antes de guardar.` })
    } else {
      setAviso({
        tono: 'aviso',
        texto: leido.nombreGorra
          ? `No encontré la gorra "${leido.nombreGorra}": búscala abajo. Los datos del cliente sí se cargaron.`
          : 'No reconocí el formato. Pega el mensaje completo del pedido.',
      })
    }
    setPedido('')
  }

  const subtotal = lineas.reduce((s, l) => s + (Number(l.precio) || 0) * (Number(l.cantidad) || 0), 0)
  const descuento = Number(datos.descuento) || 0
  const envio = Number(datos.envio) || 0
  const total = subtotal - descuento + envio
  const costoTotal = lineas.reduce((s, l) => {
    const costo = porId.get(l.gorraId)?.costo
    return costo === null || costo === undefined ? s : s + costo * (Number(l.cantidad) || 0)
  }, 0)
  const faltanCostos = lineas.some((l) => porId.get(l.gorraId)?.costo == null)
  const ganancia = subtotal - descuento - costoTotal

  function guardar(e) {
    e.preventDefault()
    setError(null)
    if (!lineas.length) return setError('Agrega al menos una gorra.')
    const sinStock = lineas.find((l) => Number(l.cantidad) > (porId.get(l.gorraId)?.stock ?? 0))
    if (sinStock) return setError(`No hay suficiente stock de "${porId.get(sinStock.gorraId).nombre}" (quedan ${porId.get(sinStock.gorraId).stock}).`)

    iniciar(async () => {
      const r = await registrarVenta({ ...datos, items: lineas })
      if (r.error) return setError(r.error)
      router.push(`/admin/ventas/${r.id}?nueva=1`)
      router.refresh()
    })
  }

  return (
    <form className="adm-form" onSubmit={guardar} noValidate>
      {error && <div className="adm-alerta" data-tono="error" role="alert">{error}</div>}

      <section className="adm-tarjeta">
        <h2>Pegar pedido de WhatsApp</h2>
        <p className="adm-ayuda" style={{ marginBottom: 10 }}>
          Copia el mensaje que te llegó desde la tienda (“Hola, quiero realizar un pedido!…”) y pégalo aquí: se llenan la gorra y los datos del cliente.
        </p>
        <textarea value={pedido} onChange={(e) => setPedido(e.target.value)} className="adm-textarea" placeholder="Pega aquí el mensaje…" aria-label="Mensaje del pedido" />
        <div className="adm-acciones" style={{ marginTop: 10 }}>
          <button type="button" className="adm-btn" onClick={usarPedido} disabled={!pedido.trim()}>Leer pedido</button>
          {aviso && <span className={aviso.tono === 'ok' ? 'adm-verde' : 'adm-rojo'} role="status">{aviso.texto}</span>}
        </div>
      </section>

      <section className="adm-tarjeta">
        <h2>Productos</h2>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="adm-input"
            placeholder="Buscar gorra por nombre, color o #…"
            aria-label="Buscar gorra"
          />
          {resultados.length > 0 && (
            <div className="adm-tarjeta" style={{ position: 'absolute', zIndex: 10, left: 0, right: 0, top: '100%', marginTop: 4, padding: 6 }}>
              {resultados.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  className="adm-btn adm-btn--fantasma"
                  style={{ width: '100%', justifyContent: 'flex-start', border: 'none' }}
                  onClick={() => agregar(g)}
                  disabled={g.stock === 0}
                >
                  <img src={g.foto ? miniatura(g.foto) : '/sin-foto.svg'} alt="" className="adm-miniatura" style={{ width: 32, height: 32 }} />
                  <span style={{ flex: 1, textAlign: 'left' }}>{g.nombre}</span>
                  <span className="adm-suave">{formatPrecio(g.precio)} · {g.stock === 0 ? 'sin stock' : `${g.stock} disp.`}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {lineas.length ? (
          <div className="adm-lineas">
            <div className="adm-linea adm-ayuda" aria-hidden="true">
              <span>Gorra</span><span>Cantidad</span><span>Precio c/u</span><span className="adm-numero">Subtotal</span><span />
            </div>
            {lineas.map((l) => {
              const g = porId.get(l.gorraId)
              return (
                <div key={l.gorraId} className="adm-linea">
                  <div className="adm-producto">
                    <img src={g.foto ? miniatura(g.foto) : '/sin-foto.svg'} alt="" className="adm-miniatura" />
                    <span>
                      {g.nombre}
                      <span className="adm-ayuda" style={{ display: 'block' }}>{g.stock} en stock</span>
                    </span>
                  </div>
                  <input
                    type="number" min={1} max={g.stock} step={1} inputMode="numeric"
                    value={l.cantidad}
                    onChange={(e) => cambiarLinea(l.gorraId, { cantidad: e.target.value })}
                    className="adm-input" aria-label={`Cantidad de ${g.nombre}`}
                  />
                  <input
                    type="number" min={0} step={1000} inputMode="numeric"
                    value={l.precio}
                    onChange={(e) => cambiarLinea(l.gorraId, { precio: e.target.value })}
                    className="adm-input" aria-label={`Precio de ${g.nombre}`}
                  />
                  <span className="adm-numero">{formatPrecio((Number(l.precio) || 0) * (Number(l.cantidad) || 0))}</span>
                  <button
                    type="button" className="adm-btn adm-btn--fantasma adm-btn--chico"
                    onClick={() => setLineas((ls) => ls.filter((x) => x.gorraId !== l.gorraId))}
                    aria-label={`Quitar ${g.nombre}`}
                  >✕</button>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="adm-vacio">Busca una gorra para agregarla.</p>
        )}
      </section>

      <section className="adm-tarjeta">
        <h2>Cliente y entrega</h2>
        <div className="adm-campos">
          <div className="adm-campo"><label htmlFor="clienteNombre">Nombre</label><input {...campo('clienteNombre')} className="adm-input" autoComplete="off" /></div>
          <div className="adm-campo"><label htmlFor="clienteTelefono">Celular</label><input {...campo('clienteTelefono')} className="adm-input" inputMode="tel" autoComplete="off" /></div>
          <div className="adm-campo"><label htmlFor="ciudad">Ciudad</label><input {...campo('ciudad')} className="adm-input" autoComplete="off" /></div>
          <div className="adm-campo"><label htmlFor="direccion">Dirección y barrio</label><input {...campo('direccion')} className="adm-input" autoComplete="off" /></div>
        </div>
      </section>

      <section className="adm-tarjeta">
        <h2>Pago</h2>
        <div className="adm-campos">
          <div className="adm-campo">
            <label htmlFor="fecha">Fecha</label>
            <input {...campo('fecha')} type="date" max={hoyBogota()} className="adm-input" />
          </div>
          <div className="adm-campo">
            <label htmlFor="canal">Canal</label>
            <select {...campo('canal')} className="adm-select">
              {CANALES.map((c) => <option key={c.valor} value={c.valor}>{c.nombre}</option>)}
            </select>
          </div>
          <div className="adm-campo">
            <label htmlFor="metodoPago">Método de pago</label>
            <select {...campo('metodoPago')} className="adm-select">
              <option value="">Sin definir</option>
              {METODOS_PAGO.map((m) => <option key={m.valor} value={m.valor}>{m.nombre}</option>)}
            </select>
          </div>
          <div className="adm-campo">
            <label htmlFor="estado">Estado</label>
            <select {...campo('estado')} className="adm-select">
              {ESTADOS_VENTA.filter((e) => e.valor !== 'cancelado').map((e) => <option key={e.valor} value={e.valor}>{e.nombre}</option>)}
            </select>
          </div>
          <div className="adm-campo">
            <label htmlFor="envio">Envío cobrado</label>
            <input {...campo('envio')} type="number" min={0} step={1000} inputMode="numeric" placeholder="0" className="adm-input" />
          </div>
          <div className="adm-campo">
            <label htmlFor="descuento">Descuento</label>
            <input {...campo('descuento')} type="number" min={0} step={1000} inputMode="numeric" placeholder="0" className="adm-input" />
          </div>
          <div className="adm-campo adm-campo--ancho">
            <label htmlFor="notas">Notas</label>
            <textarea {...campo('notas')} className="adm-textarea" style={{ minHeight: 60 }} placeholder="Guía de envío, transportadora, detalles del pedido…" />
          </div>
        </div>

        <div className="adm-totales" style={{ marginTop: 20 }}>
          <span className="adm-suave">Productos</span><span className="adm-numero">{formatPrecio(subtotal)}</span>
          {descuento > 0 && (<><span className="adm-suave">Descuento</span><span className="adm-numero">−{formatPrecio(descuento)}</span></>)}
          {envio > 0 && (<><span className="adm-suave">Envío</span><span className="adm-numero">{formatPrecio(envio)}</span></>)}
          <strong>Total</strong><strong className="adm-numero">{formatPrecio(total)}</strong>
          {lineas.length > 0 && (
            <>
              <span className="adm-suave">Ganancia{faltanCostos ? ' (aprox.)' : ''}</span>
              <span className="adm-numero adm-verde">{formatPrecio(ganancia)}</span>
            </>
          )}
        </div>
        {faltanCostos && lineas.length > 0 && (
          <p className="adm-ayuda" style={{ textAlign: 'right' }}>Alguna gorra no tiene costo cargado: la ganancia sale más alta de lo real.</p>
        )}
      </section>

      <div className="adm-acciones" style={{ justifyContent: 'flex-end' }}>
        <button type="button" className="adm-btn adm-btn--fantasma" onClick={() => router.push('/admin/ventas')} disabled={guardando}>Cancelar</button>
        <button type="submit" className="adm-btn adm-btn--primario" disabled={guardando || !lineas.length}>
          {guardando ? 'Registrando…' : `Registrar venta · ${formatPrecio(total)}`}
        </button>
      </div>
    </form>
  )
}
