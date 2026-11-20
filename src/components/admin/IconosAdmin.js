// Íconos de línea del panel (24×24, trazo 1.8). Heredan el color del texto.

function Icono({ children, size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

export function IconoInicio(props) {
  return (
    <Icono {...props}>
      <rect x="3" y="3" width="7.5" height="9" rx="1.5" />
      <rect x="13.5" y="3" width="7.5" height="5" rx="1.5" />
      <rect x="13.5" y="11" width="7.5" height="10" rx="1.5" />
      <rect x="3" y="15" width="7.5" height="6" rx="1.5" />
    </Icono>
  )
}

export function IconoVentas(props) {
  return (
    <Icono {...props}>
      <path d="M5 3h14v18l-2.5-1.6L14 21l-2-1.6L10 21l-2.5-1.6L5 21z" />
      <path d="M9 8h6M9 12h6" />
    </Icono>
  )
}

// Gorra vista de lado
export function IconoProductos(props) {
  return (
    <Icono {...props}>
      <path d="M3.5 15.5a8.5 8.5 0 0 1 17 0" />
      <path d="M3.5 15.5h17c0 1.6-1.3 2.5-3 2.5H6.5c-1.7 0-3-.9-3-2.5z" />
      <path d="M12 7v1.5" />
      <path d="M20.5 15.5l1.5 2" />
    </Icono>
  )
}

export function IconoInventario(props) {
  return (
    <Icono {...props}>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M12 13v8" />
    </Icono>
  )
}

export function IconoAvisos(props) {
  return (
    <Icono {...props}>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </Icono>
  )
}

export function IconoTienda(props) {
  return (
    <Icono {...props}>
      <path d="M15 3h6v6" />
      <path d="M10 14L21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </Icono>
  )
}

export function IconoSalir(props) {
  return (
    <Icono {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </Icono>
  )
}

export function IconoOjo(props) {
  return (
    <Icono {...props}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </Icono>
  )
}

export function IconoOjoCerrado(props) {
  return (
    <Icono {...props}>
      <path d="M9.9 4.2A9.1 9.1 0 0 1 12 4c6.5 0 10 7 10 7a17.6 17.6 0 0 1-2.2 3.2" />
      <path d="M6.6 6.6C3.7 8.6 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6" />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
      <path d="M2 2l20 20" />
    </Icono>
  )
}

export function IconoFlecha(props) {
  return (
    <Icono {...props}>
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </Icono>
  )
}
