import { requerirAdmin } from '@/lib/admin/sesion'
import NavAdmin from '@/components/admin/NavAdmin'

// Todas las páginas del panel pasan por aquí: sin sesión de admin, al login.
export default async function PanelLayout({ children }) {
  const { supabase, user } = await requerirAdmin()

  const { count: avisosPendientes } = await supabase
    .from('avisos')
    .select('id', { count: 'exact', head: true })
    .eq('atendido', false)

  return (
    <div className="adm-shell">
      <NavAdmin avisosPendientes={avisosPendientes || 0} correo={user.email} />
      <main className="adm-main">
        {children}
      </main>
    </div>
  )
}
