import { menu } from './menu'
import Navbar from './navbar'
import { Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// ... (Tipado de LogoProps y definición de logo se mantienen igual)

export default function Layout() {
  const { user } = useAuth()

  // Filtrar menú basado en el rol del usuario
  const filteredMenu = menu.filter(item => {
    if (item.title === 'Operaciones') {
      return !!user
    }

    if (item.title === 'Configuración') {
      return user?.rol === 'Administrador'
    }

    return true
  })

  return (
    // CONTENEDOR PRINCIPAL:
    // flex min-h-screen flex-col: Esto hace que el contenedor ocupe el 100% de la altura.
    <div className='bg-background text-foreground flex min-h-screen flex-col antialiased'>
      {/* HEADER: Fijo y siempre visible (no se desplaza) */}
      <header className='bg-background sticky top-0 z-50 flex h-16 flex-shrink-0 items-center border-b shadow-md'>
        <Navbar menu={filteredMenu} />
      </header>

      {/* MAIN: Contenido principal (donde debe ir el scroll) */}
      {/* CLAVES:
         1. flex-1: Hace que el main ocupe todo el espacio restante.
         2. overflow-y-auto: Habilita la barra de desplazamiento vertical solo para este contenedor.
         3. p-4 sm:p-8: Se mantiene el padding interno para el contenido.
      */}
      <main className='flex flex-1 flex-col overflow-y-auto p-4 sm:p-8'>
        <Outlet />
      </main>

      {/* FOOTER: Fijo y siempre visible (no se desplaza) */}
      <footer className='bg-muted text-muted-foreground sticky bottom-0 z-50 flex h-12 flex-shrink-0 items-center justify-center border-t text-center text-xs'>
        <span>
          <p>&copy; 2025 Plataforma digital ALMEST | Desarrollado en UBI-RA.</p>
        </span>
      </footer>
    </div>
  )
}
