'use client'

import Link from 'next/link'
import GorraCard from './GorraCard'
import { whatsappLink } from '@/lib/contacto'
import { useTemporada } from '@/lib/TemporadaContext'
import { useCuentaRegresiva } from '@/lib/useCuentaRegresiva'

const UNIDADES = ['Días', 'Horas', 'Min', 'Seg']

// Panel de la temporada en el home, debajo del Hero (estilos: clases .bf en globals.css;
// nacieron con Black Friday y sirven para cualquier temporada).
// temporada: ver src/lib/temporadas.js. gorras y descuentoMaximo: resumenOfertas() en el servidor.
export default function PanelTemporada({ temporada, gorras = [], descuentoMaximo = null }) {
  const activa = useTemporada()
  // Mientras no carga en el navegador muestra "--": el panel queda debajo del Hero y nadie lo alcanza a ver
  const valores = useCuentaRegresiva(temporada.fin)

  // Terminó con la página abierta, o la caché trae una versión de antes del cierre
  if (activa?.id !== temporada.id) return null

  const [contorno, metal] = temporada.panel.titulo
  const hayOfertas = gorras.length > 0

  return (
    <section id="temporada" className="bf" aria-labelledby="temporada-titulo">
      <div className="bf__brillo" aria-hidden="true" />
      <span className="bf__linea-lateral bf__linea-lateral--izq" aria-hidden="true" />
      <span className="bf__linea-lateral bf__linea-lateral--der" aria-hidden="true" />

      <div className="bf__contenido">
        <div className="bf__cabecera">
          <p className="bf__etiqueta">{temporada.etiqueta}</p>

          <h2 id="temporada-titulo" className="bf__titulo">
            <span className="sr-only">{temporada.nombre}</span>
            <span className="bf__titulo-contorno" aria-hidden="true">{contorno}</span>
            <span className="bf__titulo-metal" aria-hidden="true">{metal}</span>
          </h2>

          <p className="bf__texto">
            {descuentoMaximo
              ? <>Hasta <strong>{descuentoMaximo}% de descuento</strong> en gorras seleccionadas.</>
              : <>Descuentos en gorras seleccionadas.</>}
            {' '}Unidades limitadas.
          </p>

          {temporada.contador && (
            <div className="bf__reloj">
              <p className="bf__reloj-titulo">
                <span className="bf__pulso" aria-hidden="true" />
                Termina en
              </p>
              <p className="sr-only">La promoción termina {temporada.cierre}</p>
              <div className="bf__cajas" aria-hidden="true">
                {UNIDADES.map((unidad, i) => (
                  <div key={unidad} className="bf__caja">
                    <span className="bf__numero">{valores[i]}</span>
                    <span className="bf__unidad">{unidad}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            href={whatsappLink(`Hola, quiero ver las ofertas de ${temporada.nombre}.`)}
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
