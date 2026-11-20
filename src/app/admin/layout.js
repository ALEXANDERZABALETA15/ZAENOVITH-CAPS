import './admin.css'

// Todo /admin: fuera de Google y sin caché (cada página lee la sesión del admin)
export const metadata = {
  title: 'Admin · CROWNLUX',
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRaiz({ children }) {
  return <div className="adm">{children}</div>
}
