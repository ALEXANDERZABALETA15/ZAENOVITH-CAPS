'use client'

import { useTransition } from 'react'
import { marcarAviso, borrarAviso } from '@/app/admin/(panel)/avisos/acciones'

export default function AccionesAviso({ aviso, enlaceWhatsApp }) {
  const [pendiente, iniciar] = useTransition()

  function ejecutar(accion) {
    iniciar(async () => {
      const r = await accion()
      if (r?.error) alert(r.error)
    })
  }

  return (
    <div className="adm-acciones">
      {!aviso.atendido && enlaceWhatsApp && (
        <a
          href={enlaceWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="adm-btn adm-btn--chico adm-btn--primario"
          // Al escribirle, queda como atendido
          onClick={() => ejecutar(() => marcarAviso(aviso.id, true))}
        >
          Avisar por WhatsApp
        </a>
      )}
      <button
        type="button"
        className="adm-btn adm-btn--chico"
        disabled={pendiente}
        onClick={() => ejecutar(() => marcarAviso(aviso.id, !aviso.atendido))}
      >
        {aviso.atendido ? 'Marcar pendiente' : 'Marcar atendido'}
      </button>
      <button
        type="button"
        className="adm-btn adm-btn--chico adm-btn--peligro"
        disabled={pendiente}
        onClick={() => confirm('¿Borrar este aviso y el número del cliente?') && ejecutar(() => borrarAviso(aviso.id))}
        aria-label="Borrar aviso"
      >
        ✕
      </button>
    </div>
  )
}
