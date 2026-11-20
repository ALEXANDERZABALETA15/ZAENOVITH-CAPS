'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { iniciarSesion } from './acciones'

function Formulario() {
  const [estado, accion, enviando] = useActionState(iniciarSesion, null)
  const sinPermiso = useSearchParams().get('error') === 'sin-permiso'
  const error = estado?.error || (sinPermiso ? 'Esta cuenta no tiene permiso de administrador.' : null)

  return (
    <form action={accion} className="adm-form">
      {error && <div className="adm-alerta" data-tono="error" role="alert">{error}</div>}
      <div className="adm-campo">
        <label htmlFor="correo">Correo</label>
        <input id="correo" name="correo" type="email" autoComplete="email" required className="adm-input" />
      </div>
      <div className="adm-campo">
        <label htmlFor="clave">Contraseña</label>
        <input id="clave" name="clave" type="password" autoComplete="current-password" required className="adm-input" />
      </div>
      <button type="submit" className="adm-btn adm-btn--primario" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
    </form>
  )
}

export default function Login() {
  return (
    <main className="adm-login">
      <div className="adm-tarjeta">
        <h1>CROWNLUX</h1>
        <p className="adm-suave">Panel de administración</p>
        <Suspense>
          <Formulario />
        </Suspense>
      </div>
    </main>
  )
}
