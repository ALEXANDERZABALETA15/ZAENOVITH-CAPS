'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import GorraCard from './GorraCard'
import { whatsappLink } from '@/lib/contacto'

const MENSAJE_WHATSAPP = 'Hola, quiero ver las ofertas de Black Friday.'

const UNIDADES = ['Días', 'Horas', 'Min', 'Seg']

// [días, horas, minutos, segundos] que faltan, en texto de dos cifras
function cifras(ms) {
  let s = Math.max(0, Math.floor(ms / 1000))
  const dias = Math.floor(s / 86400)
  s -= dias * 86400
  const horas = Math.floor(s / 3600)
  s -= horas * 3600
  const minutos = Math.floor(s / 60)
  return [dias, horas, minutos, s - minutos * 60].map((n) => String(n).padStart(2, '0'))
}

// Panel temporal del home (estilos: "Black Friday" en globals.css).
// evento: ver src/lib/eventos.js. gorras y descuentoMaximo: resumenOfertas() en el servidor.
export default function BlackFriday({ evento, gorras = [], descuentoMaximo = null }) {
  // null hasta cargar en el navegador: el HTML viene de la caché y la hora del servidor ya no sirve.
  // El panel queda debajo del Hero, así que nadie alcanza a ver el "--" inicial.
  const [ahora, setAhora] = useState(null)
  const fin = Date.parse(evento.fin)

  useEffect(() => {
    const tic = () => setAhora(Date.now())
    tic()
    const intervalo = setInterval(tic, 1000)
    return () => clearInterval(intervalo)
  }, [])

  // Terminó con la página abierta, o la caché trae una versión de antes del cierre
  if (ahora !== null && ahora >= fin) return null

  const hayOfertas = gorras.length > 0
  const valores = ahora === null ? UNIDADES.map(() => '--') : cifras(fin - ahora)

  return (
    <section id="black-friday" className="bf" aria-labelledby="bf-titulo">
      <div className="bf__brillo" aria-hidden="true" />
      <span className="bf__linea-lateral bf__linea-lateral--izq" aria-hidden="true" />
      <span className="bf__linea-lateral bf__linea-lateral--der" aria-hidden="true" />

      <div className="bf__contenido">
        <div className="bf__cabecera">
          <p className="bf__etiqueta">{evento.etiqueta}</p>

          <h2 id="bf-titulo" className="bf__titulo">
            <span className="sr-only">Black Friday</span>
            <span className="bf__titulo-contorno" aria-hidden="true">Black</span>
            <span className="bf__titulo-metal" aria-hidden="true">Friday</span>
          </h2>

          <p className="bf__texto">
            {descuentoMaximo
              ? <>Hasta <strong>{descuentoMaximo}% de descuento</strong> en gorras seleccionadas.</>
              : <>Descuentos en gorras seleccionadas.</>}
            {' '}Unidades limitadas.
          </p>

          <div className="bf__reloj">
            <p className="bf__reloj-titulo">
              <span className="bf__pulso" aria-hidden="true" />
              Termina en
            </p>
            <p className="sr-only">La promoción termina {evento.cierre}.</p>
            <div className="bf__cajas" aria-hidden="true">
              {UNIDADES.map((unidad, i) => (
                <div key={unidad} className="bf__caja">
                  <span className="bf__numero">{valores[i]}</span>
                  <span className="bf__unidad">{unidad}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {hayOfertas && (
          <div className="bf__vitrina">
            <h3 className="bf__vitrina-titulo">En oferta esta semana</h3>
            <div className="bf__fila">
              {gorras.map((gorra) => (
                <div key={gorra.id} className="bf__item">
                  <GorraCard gorra={gorra} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bf__acciones">
          {/* Sin ofertas marcadas, /ofertas estaría vacía: se lleva al catálogo */}
          {hayOfertas ? (
            <Link href="/ofertas" className="btn-cta btn-cta--primario">
              Ver todas las ofertas
            </Link>
          ) : (
            <a href="#catalogo" className="btn-cta btn-cta--primario">
              Ver catálogo
            </a>
          )}
          <a
            href={whatsappLink(MENSAJE_WHATSAPP)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta btn-cta--secundario"
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}
