'use client'

import { Suspense, useActionState, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { iniciarSesion } from './acciones'
import { IconoOjo, IconoOjoCerrado, IconoFlecha } from '@/components/admin/IconosAdmin'

function Formulario() {
  const [estado, accion, enviando] = useActionState(iniciarSesion, null)
  const [verClave, setVerClave] = useState(false)
  const sinPermiso = useSearchParams().get('error') === 'sin-permiso'
  const error = estado?.error || (sinPermiso ? 'Esta cuenta no tiene permiso de administrador.' : null)

  return (
    <form action={accion} className="adm-form adm-login-form">
      {error && <div className="adm-alerta" data-tono="error" role="alert">{error}</div>}
      <div className="adm-campo">
        <label htmlFor="correo">Correo</label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="tu@correo.com"
          required
          className="adm-input"
          defaultValue={estado?.correo}
        />
      </div>
      <div className="adm-campo">
        <label htmlFor="clave">Contraseña</label>
        <div className="adm-input-con-boton">
          <input
            id="clave"
            name="clave"
            type={verClave ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className="adm-input"
          />
          <button
            type="button"
            className="adm-input-boton"
            onClick={() => setVerClave((v) => !v)}
            aria-label={verClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            aria-pressed={verClave}
          >
            {verClave ? <IconoOjoCerrado size={18} /> : <IconoOjo size={18} />}
          </button>
        </div>
      </div>
      <button type="submit" className="adm-btn adm-btn--primario adm-btn--bloque" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar al panel'}
      </button>
    </form>
  )
}

export default function Login() {
  return (
    <main className="adm-login">
      <div className="adm-login-luces" aria-hidden="true" />
      <div className="adm-login-caja">
        <img
          src="/marca/crownlux-logo.png"
          alt="CROWNLUX Premium Caps"
          className="adm-login-logo"
          width="900"
          height="287"
        />
        <div className="adm-tarjeta adm-login-tarjeta">
          <h1>Panel de administración</h1>
          <p className="adm-suave">Entra con tu cuenta para gestionar la tienda.</p>
          <Suspense>
            <Formulario />
          </Suspense>
        </div>
        <Link href="/" className="adm-login-volver">
          <IconoFlecha size={16} />
          Volver a la tienda
        </Link>
      </div>
    </main>
  )
}
