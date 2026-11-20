'use client'

import { useCallback, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import GestorFotos from './GestorFotos'
import { guardarGorra, eliminarGorra, descartarFotosSinGuardar } from '@/app/admin/(panel)/productos/acciones'
import { ESTADOS_GORRA, BADGES, TIPOS_GORRA, VISERAS } from '@/lib/admin/catalogos'
import { formatPrecio } from '@/lib/precio'
import { textoBadge } from '@/lib/badges'

const VACIA = {
  nombre: '', precio: '', precioAnterior: '', costo: '', stockInicial: '',
  coleccion: '', color: '', descripcion: '', estado: 'activo', badge: '',
  marca: '', tipo: '', talla: '', material: '', visera: '',
}

function Campo({ id, etiqueta, ayuda, ancho, children }) {
  return (
    <div className={`adm-campo${ancho ? ' adm-campo--ancho' : ''}`}>
      <label htmlFor={id}>{etiqueta}</label>
      {children}
      {ayuda && <span className="adm-ayuda">{ayuda}</span>}
    </div>
  )
}

// gorra = null → crear. colecciones: las que ya existen, para sugerirlas.
export default function FormProducto({ gorra = null, colecciones = [] }) {
  const router = useRouter()
  const nueva = gorra === null
  const [datos, setDatos] = useState(() => (nueva ? VACIA : { ...VACIA, ...gorra }))
  const [fotos, setFotos] = useState({ urls: gorra?.fotos ?? [], subiendo: false, conError: false, nuevas: [] })
  const [error, setError] = useState(null)
  const [guardando, iniciarGuardado] = useTransition()
  const [eliminando, iniciarEliminacion] = useTransition()

  const alCambiarFotos = useCallback((estado) => setFotos(estado), [])

  function campo(nombre) {
    return {
      id: nombre,
      name: nombre,
      value: datos[nombre] ?? '',
      onChange: (e) => setDatos((d) => ({ ...d, [nombre]: e.target.value })),
    }
  }

  const precio = Number(datos.precio) || 0
  const costo = datos.costo === '' ? null : Number(datos.costo)
  const utilidad = precio && costo !== null ? precio - costo : null
  const margen = utilidad !== null && precio ? Math.round((utilidad / precio) * 100) : null

  function guardar(e) {
    e.preventDefault()
    setError(null)
    if (fotos.subiendo) return setError('Espera a que terminen de subir las fotos.')
    if (fotos.conError) return setError('Hay fotos que no se pudieron subir: reintenta o quítalas.')

    iniciarGuardado(async () => {
      const resultado = await guardarGorra(nueva ? null : gorra.id, { ...datos, fotos: fotos.urls })
      if (resultado?.error) {
        setError(resultado.error)
        // Si la gorra alcanzó a crearse, se sigue editando esa (no se crea otra al reintentar)
        if (nueva && resultado.id) router.replace(`/admin/productos/${resultado.id}`)
        return
      }
      router.push(`/admin/productos?guardado=${resultado.id}`)
      router.refresh()
    })
  }

  function cancelar() {
    // Fotos que se subieron pero no se van a guardar: se borran de Cloudinary
    const sinUsar = fotos.nuevas.filter((url) => fotos.urls.includes(url))
    if (sinUsar.length) descartarFotosSinGuardar(sinUsar)
    router.push('/admin/productos')
  }

  function eliminar() {
    if (!confirm(`¿Eliminar "${gorra.nombre}"? Se borran también sus fotos. No se puede deshacer.`)) return
    iniciarEliminacion(async () => {
      const resultado = await eliminarGorra(gorra.id)
      if (resultado?.error) return setError(resultado.error)
      router.push('/admin/productos')
      router.refresh()
    })
  }

  const ocupado = guardando || eliminando

  return (
    <form className="adm-form" onSubmit={guardar} noValidate>
      {error && <div className="adm-alerta" data-tono="error" role="alert">{error}</div>}

      <section className="adm-tarjeta">
        <h2>Fotos</h2>
        <GestorFotos fotosIniciales={gorra?.fotos ?? []} alCambiar={alCambiarFotos} />
      </section>

      <section className="adm-tarjeta">
        <h2>Información</h2>
        <div className="adm-campos">
          <Campo id="nombre" etiqueta="Nombre *" ancho>
            <input {...campo('nombre')} className="adm-input" required maxLength={120} />
          </Campo>
          <Campo id="coleccion" etiqueta="Colección">
            <input {...campo('coleccion')} className="adm-input" list="lista-colecciones" />
            <datalist id="lista-colecciones">
              {colecciones.map((c) => <option key={c} value={c} />)}
            </datalist>
          </Campo>
          <Campo id="color" etiqueta="Color">
            <input {...campo('color')} className="adm-input" />
          </Campo>
          <Campo id="estado" etiqueta="Estado" ayuda={datos.estado === 'oculto' ? 'No aparece en la web, pero conserva su historial.' : null}>
            <select {...campo('estado')} className="adm-select">
              {ESTADOS_GORRA.map((e) => <option key={e.valor} value={e.valor}>{e.nombre}</option>)}
            </select>
          </Campo>
          <Campo id="badge" etiqueta="Etiqueta" ayuda="Nuevo → sale en Novedades. Oferta → sale en Ofertas.">
            <select {...campo('badge')} className="adm-select">
              <option value="">Sin etiqueta</option>
              {BADGES.map((b) => <option key={b} value={b}>{textoBadge(b)}</option>)}
            </select>
          </Campo>
          <Campo id="descripcion" etiqueta="Descripción" ancho>
            <textarea {...campo('descripcion')} className="adm-textarea" />
          </Campo>
        </div>
      </section>

      <section className="adm-tarjeta">
        <h2>Precio, costo y stock</h2>
        <div className="adm-campos">
          <Campo id="precio" etiqueta="Precio de venta *">
            <input {...campo('precio')} className="adm-input" type="number" min={0} step={1000} inputMode="numeric" required />
          </Campo>
          <Campo id="precioAnterior" etiqueta="Precio anterior" ayuda="Solo si está en oferta: se muestra tachado.">
            <input {...campo('precioAnterior')} className="adm-input" type="number" min={0} step={1000} inputMode="numeric" />
          </Campo>
          <Campo
            id="costo"
            etiqueta="Costo (privado)"
            ayuda={utilidad !== null ? `Ganancia: ${formatPrecio(utilidad)} por unidad (${margen}%)` : 'Lo que te cuesta cada unidad. No se muestra en la web.'}
          >
            <input {...campo('costo')} className="adm-input" type="number" min={0} step={1000} inputMode="numeric" />
          </Campo>
          {nueva ? (
            <Campo id="stockInicial" etiqueta="Unidades disponibles" ayuda="Después se ajusta desde Inventario.">
              <input {...campo('stockInicial')} className="adm-input" type="number" min={0} step={1} inputMode="numeric" placeholder="0" />
            </Campo>
          ) : (
            <div className="adm-campo">
              <span className="adm-etiqueta">Stock</span>
              <span style={{ fontSize: 20, fontWeight: 700 }}>{gorra.stock} {gorra.stock === 1 ? 'unidad' : 'unidades'}</span>
              <Link href={`/admin/inventario?gorra=${gorra.id}`} className="adm-ayuda" style={{ textDecoration: 'underline' }}>
                Ajustar en Inventario
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="adm-tarjeta">
        <h2>Ficha técnica</h2>
        <div className="adm-campos">
          <Campo id="marca" etiqueta="Marca">
            <input {...campo('marca')} className="adm-input" placeholder="New Era, CROWNLUX…" />
          </Campo>
          <Campo id="tipo" etiqueta="Tipo">
            <input {...campo('tipo')} className="adm-input" list="lista-tipos" />
            <datalist id="lista-tipos">
              {TIPOS_GORRA.map((t) => <option key={t} value={t} />)}
            </datalist>
          </Campo>
          <Campo id="talla" etiqueta="Talla">
            <input {...campo('talla')} className="adm-input" placeholder="Ajustable (talla única)" />
          </Campo>
          <Campo id="visera" etiqueta="Visera">
            <select {...campo('visera')} className="adm-select">
              <option value="">—</option>
              {VISERAS.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </Campo>
          <Campo id="material" etiqueta="Material" ancho>
            <input {...campo('material')} className="adm-input" placeholder="100% algodón, bordado 3D" />
          </Campo>
        </div>
      </section>

      <div className="adm-acciones" style={{ justifyContent: 'space-between' }}>
        <div className="adm-acciones">
          {!nueva && (
            <button type="button" className="adm-btn adm-btn--peligro" onClick={eliminar} disabled={ocupado}>
              {eliminando ? 'Eliminando…' : 'Eliminar'}
            </button>
          )}
        </div>
        <div className="adm-acciones">
          <button type="button" className="adm-btn adm-btn--fantasma" onClick={cancelar} disabled={ocupado}>Cancelar</button>
          <button type="submit" className="adm-btn adm-btn--primario" disabled={ocupado || fotos.subiendo}>
            {guardando ? 'Guardando…' : fotos.subiendo ? 'Subiendo fotos…' : nueva ? 'Crear gorra' : 'Guardar cambios'}
          </button>
        </div>
      </div>
    </form>
  )
}
