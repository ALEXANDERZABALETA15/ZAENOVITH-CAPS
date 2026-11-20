'use client'

import { useEffect, useRef, useState } from 'react'
import { cargarFoto, recortarYComprimir, formatoPeso, LADO_MAXIMO } from '@/lib/admin/procesarFoto'

const ZOOM_MAXIMO = 3

// Encuadre cuadrado (1:1, como las cards y la galería). Se arrastra la foto para moverla
// y se acerca con la barra o la rueda del mouse. La foto siempre cubre todo el cuadro.
export default function RecortadorFoto({ archivo, posicion, alConfirmar, alCancelar }) {
  const marcoRef = useRef(null)
  const arrastre = useRef(null)
  const [imagen, setImagen] = useState(null)
  const [urlVista, setUrlVista] = useState(null)
  const [marco, setMarco] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [desplazamiento, setDesplazamiento] = useState({ x: 0, y: 0 })
  const [error, setError] = useState(null)
  const [procesando, setProcesando] = useState(false)

  // Carga la foto (con la orientación corregida) y la deja centrada en el cuadro
  useEffect(() => {
    let vigente = true
    const url = URL.createObjectURL(archivo)
    cargarFoto(archivo)
      .then((bitmap) => {
        if (!vigente) return bitmap.close?.()
        const lado = marcoRef.current?.clientWidth || 400
        const e = lado / Math.min(bitmap.width, bitmap.height)
        setMarco(lado)
        setUrlVista(url)
        setImagen(bitmap)
        setDesplazamiento({ x: (lado - bitmap.width * e) / 2, y: (lado - bitmap.height * e) / 2 })
      })
      .catch((e) => vigente && setError(e.message))
    return () => {
      vigente = false
      URL.revokeObjectURL(url)
    }
  }, [archivo])

  const escalaBase = imagen && marco ? marco / Math.min(imagen.width, imagen.height) : 1
  const escala = escalaBase * zoom

  function limitar({ x, y }, escalaActual = escala) {
    if (!imagen) return { x, y }
    const minX = marco - imagen.width * escalaActual
    const minY = marco - imagen.height * escalaActual
    return { x: Math.min(0, Math.max(minX, x)), y: Math.min(0, Math.max(minY, y)) }
  }

  function cambiarZoom(nuevo) {
    const z = Math.min(ZOOM_MAXIMO, Math.max(1, nuevo))
    const nuevaEscala = escalaBase * z
    // Mantiene fijo el punto del centro del cuadro
    const cx = (marco / 2 - desplazamiento.x) / escala
    const cy = (marco / 2 - desplazamiento.y) / escala
    setZoom(z)
    setDesplazamiento(limitar({ x: marco / 2 - cx * nuevaEscala, y: marco / 2 - cy * nuevaEscala }, nuevaEscala))
  }

  function alPresionar(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    arrastre.current = { px: e.clientX, py: e.clientY, ...desplazamiento }
  }
  function alMover(e) {
    if (!arrastre.current) return
    const { px, py, x, y } = arrastre.current
    setDesplazamiento(limitar({ x: x + e.clientX - px, y: y + e.clientY - py }))
  }
  function alSoltar() {
    arrastre.current = null
  }

  function alTeclear(e) {
    const paso = e.shiftKey ? 40 : 10
    const movimientos = { ArrowLeft: [paso, 0], ArrowRight: [-paso, 0], ArrowUp: [0, paso], ArrowDown: [0, -paso] }
    if (movimientos[e.key]) {
      e.preventDefault()
      const [dx, dy] = movimientos[e.key]
      setDesplazamiento((d) => limitar({ x: d.x + dx, y: d.y + dy }))
    }
  }

  // La rueda del mouse acerca/aleja (listener manual: React registra wheel como pasivo)
  useEffect(() => {
    const nodo = marcoRef.current
    if (!nodo) return
    const alRodar = (e) => {
      e.preventDefault()
      cambiarZoom(zoom - e.deltaY * 0.002)
    }
    nodo.addEventListener('wheel', alRodar, { passive: false })
    return () => nodo.removeEventListener('wheel', alRodar)
  })

  async function confirmar() {
    setProcesando(true)
    try {
      const recorte = { x: -desplazamiento.x / escala, y: -desplazamiento.y / escala, lado: marco / escala }
      const { blob, lado } = await recortarYComprimir(imagen, recorte)
      imagen.close?.()
      alConfirmar({ blob, lado, pesoOriginal: archivo.size })
    } catch (e) {
      setError(e.message)
      setProcesando(false)
    }
  }

  const ladoFinal = imagen ? Math.min(LADO_MAXIMO, Math.round(marco / escala)) : 0

  return (
    <div className="adm-modal" role="dialog" aria-modal="true" aria-labelledby="titulo-recorte">
      <div className="adm-modal-caja">
        <div>
          <h3 id="titulo-recorte">Encuadrar foto {posicion}</h3>
          <p className="adm-ayuda">
            Arrastra para mover y usa la barra para acercar. Se guarda cuadrada, igual que se ve en la tienda.
          </p>
        </div>

        {error ? (
          <div className="adm-alerta" data-tono="error" role="alert">{error}</div>
        ) : (
          <>
            <div
              ref={marcoRef}
              className="adm-recorte"
              tabIndex={0}
              aria-label="Área de recorte. Usa las flechas para mover la foto."
              onPointerDown={alPresionar}
              onPointerMove={alMover}
              onPointerUp={alSoltar}
              onPointerCancel={alSoltar}
              onKeyDown={alTeclear}
            >
              {imagen && urlVista && (
                <img
                  src={urlVista}
                  alt=""
                  draggable={false}
                  style={{
                    width: imagen.width,
                    height: imagen.height,
                    transform: `translate(${desplazamiento.x}px, ${desplazamiento.y}px) scale(${escala})`,
                  }}
                />
              )}
            </div>

            <label className="adm-campo">
              <span className="adm-etiqueta">Acercar</span>
              <input
                type="range"
                className="adm-rango"
                min={1}
                max={ZOOM_MAXIMO}
                step={0.01}
                value={zoom}
                onChange={(e) => cambiarZoom(Number(e.target.value))}
                disabled={!imagen}
              />
            </label>

            {imagen && (
              <p className="adm-ayuda">
                Original: {imagen.width}×{imagen.height} · {formatoPeso(archivo.size)} → se guardará a {ladoFinal}×{ladoFinal}
                {ladoFinal < 1000 && <span className="adm-rojo"> (foto pequeña: puede verse borrosa en pantallas grandes)</span>}
              </p>
            )}
          </>
        )}

        <div className="adm-acciones" style={{ justifyContent: 'flex-end' }}>
          <button type="button" className="adm-btn adm-btn--fantasma" onClick={alCancelar} disabled={procesando}>
            {error ? 'Cerrar' : 'Omitir'}
          </button>
          {!error && (
            <button type="button" className="adm-btn adm-btn--primario" onClick={confirmar} disabled={!imagen || procesando}>
              {procesando ? 'Optimizando…' : 'Usar foto'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
