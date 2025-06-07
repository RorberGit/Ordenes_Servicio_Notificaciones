import { menu } from './menu'
import Navbar from './navbar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <>
      <header>
        <Navbar menu={menu} />
      </header>
      <main className='flex h-screen items-center justify-center'>
        <Outlet />
      </main>
      <footer>Pie</footer>
    </>
  )
}
