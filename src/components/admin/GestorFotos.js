'use client'

import { useEffect, useRef, useState } from 'react'
import RecortadorFoto from './RecortadorFoto'
import { subirACloudinary, formatoPeso } from '@/lib/admin/procesarFoto'
import { miniatura } from '@/lib/admin/catalogos'
import { firmarSubidaFoto, descartarFotosSinGuardar } from '@/app/admin/(panel)/productos/acciones'

export const MAXIMO_FOTOS = 6

let siguienteClave = 0
const nuevaClave = () => `foto-${++siguienteClave}`

// Fotos de una gorra: agregar (recortar → comprimir → subir), reordenar y quitar.
// La primera es la portada (la que sale en la card).
// Avisa al formulario con alCambiar({ urls, subiendo, conError, nuevas }):
//   urls     → en orden, solo las ya subidas
//   subiendo → true mientras alguna foto se esté subiendo (el formulario no deja guardar)
//   conError → alguna foto no se pudo subir (hay que reintentar o quitarla)
//   nuevas   → las subidas en esta sesión, para borrarlas de Cloudinary si se cancela
export default function GestorFotos({ fotosIniciales = [], alCambiar }) {
  const [items, setItems] = useState(() => fotosIniciales.map((url) => ({ clave: nuevaClave(), url })))
  const [cola, setCola] = useState([])
  const [mensaje, setMensaje] = useState(null)
  const [arrastrando, setArrastrando] = useState(null)
  const [destino, setDestino] = useState(null)
  const [archivosEncima, setArchivosEncima] = useState(false)
  const inputRef = useRef(null)
  const nuevasRef = useRef(new Set())

  useEffect(() => {
    alCambiar({
      urls: items.filter((i) => i.url).map((i) => i.url),
      subiendo: items.some((i) => !i.url && !i.error) || cola.length > 0,
      conError: items.some((i) => !i.url && i.error),
      nuevas: [...nuevasRef.current],
    })
  }, [items, cola, alCambiar])

  // Libera las vistas previas locales al salir
  useEffect(() => () => items.forEach((i) => i.vista && URL.revokeObjectURL(i.vista)), []) // eslint-disable-line react-hooks/exhaustive-deps

  const espacio = MAXIMO_FOTOS - items.length - cola.length

  function agregarArchivos(lista) {
    const imagenes = [...lista].filter((a) => a.type.startsWith('image/'))
    if (!imagenes.length) return
    if (imagenes.length > espacio) {
      setMensaje({ tono: 'aviso', texto: `Solo caben ${MAXIMO_FOTOS} fotos: se tomaron las primeras ${Math.max(espacio, 0)}.` })
    } else {
      setMensaje(null)
    }
    setCola((c) => [...c, ...imagenes.slice(0, Math.max(espacio, 0))])
  }

  function actualizar(clave, cambios) {
    setItems((lista) => lista.map((i) => (i.clave === clave ? { ...i, ...cambios } : i)))
  }

  async function subir(clave, blob) {
    actualizar(clave, { error: null, progreso: 0 })
    const { firma, error } = await firmarSubidaFoto()
    if (error) return actualizar(clave, { error })
    try {
      const url = await subirACloudinary(blob, firma, (p) => actualizar(clave, { progreso: p }))
      nuevasRef.current.add(url)
      actualizar(clave, { url, progreso: 1 })
    } catch (e) {
      actualizar(clave, { error: e.message })
    }
  }

  function alRecortar({ blob, lado, pesoOriginal }) {
    const clave = nuevaClave()
    setItems((lista) => [...lista, { clave, vista: URL.createObjectURL(blob), blob, lado, pesoOriginal, peso: blob.size, progreso: 0 }])
    setCola((c) => c.slice(1))
    setMensaje({
      tono: 'ok',
      texto: `Foto optimizada: ${formatoPeso(pesoOriginal)} → ${formatoPeso(blob.size)} (${lado}×${lado}).`,
    })
    subir(clave, blob)
  }

  function quitar(clave) {
    const item = items.find((i) => i.clave === clave)
    if (!item) return
    if (item.vista) URL.revokeObjectURL(item.vista)
    // Una foto subida en esta sesión no la usa ninguna gorra guardada: se borra ya.
    // Las fotos que ya estaban guardadas se borran de Cloudinary al guardar el formulario.
    if (item.url && nuevasRef.current.has(item.url)) {
      nuevasRef.current.delete(item.url)
      descartarFotosSinGuardar([item.url])
    }
    setItems((lista) => lista.filter((i) => i.clave !== clave))
  }

  function mover(desde, hasta) {
    if (hasta < 0 || hasta >= items.length || desde === hasta) return
    setItems((lista) => {
      const copia = [...lista]
      const [movido] = copia.splice(desde, 1)
      copia.splice(hasta, 0, movido)
      return copia
    })
  }

  return (
    <div className="adm-form" style={{ gap: 12 }}>
      <div className="adm-fotos">
        {items.map((item, i) => (
          <div
            key={item.clave}
            className="adm-foto"
            draggable
            data-arrastrando={arrastrando === i}
            data-destino={destino === i && arrastrando !== null && arrastrando !== i}
            onDragStart={(e) => {
              setArrastrando(i)
              e.dataTransfer.effectAllowed = 'move'
            }}
            onDragOver={(e) => {
              if (arrastrando === null) return
              e.preventDefault()
              setDestino(i)
            }}
            onDrop={(e) => {
              if (arrastrando === null) return
              e.preventDefault()
              mover(arrastrando, i)
              setArrastrando(null)
              setDestino(null)
            }}
            onDragEnd={() => {
              setArrastrando(null)
              setDestino(null)
            }}
          >
            <img src={item.vista || miniatura(item.url)} alt={`Foto ${i + 1}`} />
            {i === 0 && <span className="adm-foto-portada">Portada</span>}

            {!item.url && (
              <div className="adm-foto-estado">
                {item.error ? (
                  <>
                    <span className="adm-rojo">{item.error}</span>
                    <button type="button" className="adm-btn adm-btn--chico" onClick={() => subir(item.clave, item.blob)}>
                      Reintentar
                    </button>
                  </>
                ) : (
                  <>
                    <span>Subiendo…</span>
                    <div className="adm-progreso"><span style={{ width: `${Math.round((item.progreso || 0) * 100)}%` }} /></div>
                  </>
                )}
              </div>
            )}

            <div className="adm-foto-controles">
              <span style={{ display: 'flex', gap: 4 }}>
                <button type="button" onClick={() => mover(i, i - 1)} disabled={i === 0} aria-label={`Mover foto ${i + 1} a la izquierda`}>←</button>
                <button type="button" onClick={() => mover(i, i + 1)} disabled={i === items.length - 1} aria-label={`Mover foto ${i + 1} a la derecha`}>→</button>
              </span>
              <button type="button" onClick={() => quitar(item.clave)} aria-label={`Quitar foto ${i + 1}`}>✕</button>
            </div>
          </div>
        ))}

        {espacio > 0 && (
          <button
            type="button"
            className="adm-foto-agregar"
            data-encima={archivosEncima}
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => {
              if (arrastrando !== null) return
              e.preventDefault()
              setArchivosEncima(true)
            }}
            onDragLeave={() => setArchivosEncima(false)}
            onDrop={(e) => {
              if (arrastrando !== null) return
              e.preventDefault()
              setArchivosEncima(false)
              agregarArchivos(e.dataTransfer.files)
            }}
          >
            <strong>+</strong>
            Agregar fotos
            <span className="adm-ayuda">o arrástralas aquí</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        multiple
        hidden
        onChange={(e) => {
          agregarArchivos(e.target.files)
          e.target.value = ''
        }}
      />

      <p className="adm-ayuda">
        Hasta {MAXIMO_FOTOS} fotos. La primera es la portada; arrástralas o usa las flechas para ordenarlas.
        Sugerido: frente, lado, atrás, interior con etiquetas y una puesta.
      </p>
      {mensaje && <div className="adm-alerta" data-tono={mensaje.tono} role="status">{mensaje.texto}</div>}

      {cola[0] && (
        <RecortadorFoto
          key={`${cola[0].name}-${cola[0].lastModified}-${cola.length}`}
          archivo={cola[0]}
          posicion={`${items.length + 1} de ${MAXIMO_FOTOS}`}
          alConfirmar={alRecortar}
          alCancelar={() => setCola((c) => c.slice(1))}
        />
      )}
    </div>
  )
}
